const express = require('express')
const path = require("path");
const fs = require("fs");
const axios = require('axios');
require('dotenv').config()

const app = express()
const port = 3000

async function registerPart(session_id, sequence, end, jwt)
{
	//don't use your secret token directly in your code
	const secret_token = process.env.SENTC_SECRET_TOKEN;

	try {
		const res = await axios.patch(`http://127.0.0.1:3002/api/v1/file/part/${session_id}/${sequence}/${end}`,null,{
			headers: {"x-sentc-app-token": secret_token, "Authorization": jwt}
		});

		//the part id is in the result filed
		return res.data["result"]["part_id"];
	} catch (e) {
		console.log(e)
	}
}

//cors -.-
app.options("*", (req,res)=> {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Origin, Authorization, x-sentc-app-token");

	res.setHeader("Content-Length", "0");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
	res.setHeader("Access-Control-Max-Age", "86400");

	res.send("");
})

//the sdk will call this endpoint with the parameter session_id, sequence and end
app.post("/file/:session_id/:sequence/:end", (req, res) => {
	//cors -.-
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Origin, Authorization, x-sentc-app-token");

	const session_id = req.params["session_id"];
	const sequence = req.params["sequence"];
	const end = req.params["end"];

	//get the jwt from the req
	const jwt = req.headers.authorization;

	//first register the file part at the sentc api
	registerPart(session_id,sequence,end,jwt).then((part_id) => {
		//then read the file part
		const file_path = path.join(__dirname, "/uploads/"+part_id);

		//we are using the file system here. you can also pipe the stream to another storage like aws s3 or so.
		const stream = fs.createWriteStream(file_path);

		//loads the bytes of the request to file stream
		stream.on("open", () => {
			req.pipe(stream)
		})

		stream.on("close", () => {
			//return the success result as json
			res.status(200).json({"status":true,"result":"Success"});
		})

		stream.on('error', err => {
			// Send an error message to the client
			console.error(err);

			res.status(500).send({ status: 'error', err });
		})
	})
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})