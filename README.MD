<h1> Getting Started </h1> 

To get you started you can simply clone the repository:
<br/>
 git clone https://github.com/Yavnikaa/teams-clone.git </div>


and install the dependencies
<br/>
npm install
<br/>

<h2> Start the MongoDB server </h2>

First we need to create a MongoDB atlas. Head over to : https://account.mongodb.com/account/login and create an account. Setup your account to create a cluster, and a database within it. The URL can be found by clicking "Connect" -> "Connect to application" on the mongoDB interface. Now, within the server-side directory, add a file called "db-config.json" with the following structure:
<br/>

{
  "url": "($clustername)jroxs.mongodb.net",
  <br/>
  "username": "$username",
  <br/>
  "password": "$password",
  <br/>
  "database": "$db_name"
}
<br/>

<h2> Run the Application </h2>

The project is preconfigured with a simple development web server. The simplest way to start this server is:
<br/>
npm start

To start the backend server separately:
<br/>
npm run server

To start off the frontend server separately:
<br/>
npm run client

Open http://localhost:3000/ to view the application interface and http://localhost:8080/ for the APIs.

