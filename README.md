# Sentc own backend storage

This is a simple example how to use your own storage as sentc file storage for your encrypted files.

`frontend` is the html client. A simple html script.

Set the url to your file storage in the sdk options: `frontend/index.js` line 33 at `file_part_url`.
Then set your public token to the options at line 32 at `app_token`

`backend` is a node js backend client as example server.

Set your secret token as an env with the name `SENTC_SECRET_TOKEN`