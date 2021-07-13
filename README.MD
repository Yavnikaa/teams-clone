Getting Started

To get you started you can simply clone the repository:

git clone https://github.com/Yavnikaa/teams-clone.git

and install the dependencies

npm install

Start the MongoDB server

First we need to create a MongoDB atlas. Head over to : https://account.mongodb.com/account/login and create an account. Setup your account to create a cluster, and a database within it. The URL can be found by clicking "Connect" -> "Connect to application" on the mongoDB interface. Now, within the server-side directory, add a file called "db-config.json" with the following structure:

{
  "url": "($clustername)jroxs.mongodb.net",
  "username": "$username",
  "password": "$password",
  "database": "$db_name"
}

Run the Application

The project is preconfigured with a simple development web server. The simplest way to start this server is:

npm start

To start the backend server separately:
npm run server

To start off the frontend server separately:
npm run client

Open http://localhost:3000/ to view the application interface and http://localhost:8080/ for the APIs.

