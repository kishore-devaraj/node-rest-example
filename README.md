# node-rest-example
### Note: This repo is only for study purpose only, not intended for any production use.

Nodejs is becoming popular day by day. It's non-blocking IO, asynchronous event driven runtime is mainly designed 
to build scalable application. Nodejs provides opportunity for every javascript developer to dip their feet in the server side technologies.
With that said, this repo contains a simple rest application built using express.js (popular nodejs framework to write web services).

This repo use mongodb as a data storage layer and use mongoose ORM for communicating with mongodb instead of using node-mongodb-native drivers.

### Steps to install and work locally
#### 1. Install mongodb locally, start the mongodb server by going to bin folder and running mongod command.

#### 2. Download the repo and install the dependencies
- Clone the repo
```
git clone https://github.com/kishore-devaraj/react-component-starter-kit
```

- Install the required packages
```
npm install
```

#### 3. Test, Run and Deploy
- Run the test case to check whether everything is working fine, without any breakage.
```
npm run test
```

- Once every tests passes, run the server.
```
npm start
```

- Login in heroku, set the PROD_NODEMONGDB env specified in the server/db/db.js and also create a git repo in the heroku
```
heroku config:set PROD_MONGODB=mongodb://dbuser:dbpass@host1:port1
heroku create
```
- Push the code to heroku git and note for the build succeed message in the build logs
```
git push heroku master
```
- Once everything succeed type the following command to open your heroku app in the browser
```
 heroku open
```
 
