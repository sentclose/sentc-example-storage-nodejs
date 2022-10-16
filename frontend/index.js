/*
The dev dependency is just for types
 */

/** @type User */
let user;

let file_id;

function initForm()
{
	const reg_btn = document.getElementsByName("start")[0];
	reg_btn.addEventListener("click",main,false);

	//init the event listener
	const input = document.getElementsByName("file")[0];
	input.addEventListener("change",upload,false);

	const btn = document.getElementsByName("download")[0];
	btn.addEventListener("click",download,false);

	const end = document.getElementsByName("end")[0];
	end.addEventListener("click", endTest, false);
}

async function main()
{
	/** @class Sentc */
	const sentc = window.Sentc.default;

	await sentc.init({
		app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", // <-- your app token
		base_url: "http://127.0.0.1:3002",
		file_part_url: "http://localhost:3000/file"	// <-- your endpoint prefix for upload and download
	});

	await sentc.register("username", "pw");

	user = await sentc.login("username", "pw");
}

async function upload()
{
	/** @type File */
	const file = this.files[0];

	const get_progress = (progress) => {
		console.log("Upload: " + progress);
	};

	//no reply id => file encrypted for the actual user.
	const {file_id: file_id_1} = await user.createFile(file, false, "", get_progress);

	file_id = file_id_1;
}

async function download()
{

}

async function endTest()
{
	await user.deleteFile(file_id);

	await user.deleteUser("pw");
}

initForm();