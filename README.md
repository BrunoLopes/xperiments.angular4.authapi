# Xperiments.Angular4.AuthApi

This project was developed for a quick programming test and uses jwt token expiring in 1 minute to access some methods

### Getting things ready


## Installing packages and dependencies

Run `npm install` for get api packages and dependencies installed. 


## Database access configuration

Configure .env file full filling the mongodb access configuration properties: 
#MONGO_DB_HOST= `mongodb host`
#MONGO_DB_HOST_PORT= `mongodb host port`
#MONGO_DB_NAME= `mongodb databse name`
#MONGO_DB_USER= `mongodb user`
#MONGO_DB_PASS= `mongodb user password`
#JWT_SECRET_KEY= `jwt secret key`

## Seeding database

Run `npm seed` to seed the database with some data with default credential teste@teste (user: teste // password: teste) 


## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:6799/`. The api will automatically reload if you change any of the source files.


## Further improvements

Due implementation of OAuth 2 protocol and as always some code refactoring
