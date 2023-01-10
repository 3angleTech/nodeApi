# webApi

Web API stub project written in NodeJS on top of TypeScript.

## Prerequisites

[Node.js v16.19 - installation instructions](*https://nodejs.org/en/download/package-manager/).

Docker v17.0 & Docker Compose - installation instructions can be found [here](https://docs.docker.com/install/) or [here](https://docs.docker.com/compose/install/).

The recommended IDE is [Visual Studio Code](https://code.visualstudio.com/).

## Running the application

### Running the application via NPM

The application requires a PostgreSql instance which is available via docker when running

```
$ docker-compose up -d 3at-postgres
```

We need to move to the `web-api` folder in a terminal and run initially

```
$ npm install
$ npm run build
$ npm run prepare-db
```

and afterwards to start the NodeJS server

```
$ npm start
```

### Running the application via Docker

Run in the terminal the following commands:

```
$ docker-compose build
$ docker-compose up -d
```

## Database management

The application uses the [Sequelize ORM](http://docs.sequelizejs.com) for managing migration scripts, database models, seed scripts and query language.

**Sequelize will generate all files as `js` files in the `dist` folder. They need to be moved manually in the `src` folder and changed to `ts` files.**

To generate a new database model, in the `web-api` folder, run:
```
$ npm run sequelize model:generate -- --name User --attributes username:string,password:string
```

which will generate the `user` file in the `models` folder along w/ a migration script `XXXXXXXXXXXXXX-create-user.js` in the `migrations` folder.

The generate a migration or a seeder script we can run one of the following commands:

```
$ npm run sequelize migration:generate -- --name "migration-name"
$ npm run sequelize seed:generate -- --name "seeder-name"
```

To apply the new sequelize scripts in the DB we need to run 

```
$ npm run prepare-db
```

To revert a specific seed, we need to run the following command:
```
$ npm run sequelize db:seed:undo -- --seed "seeder-name"
```

To run a specific seed, we need to run the following command:
```
$ npm run sequelize db:seed -- --seed "seeder-name"
```

To see which seeders were already run, query the `data_meta` table in the database. There is no explicit Sequelize command that shows this information.

## SendGrid configuration

To use SendGrid, you need to configure your API key. This is done with the following commands, where YOUR_API_KEY is your SendGrid API key.
```
echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
source ./sendgrid.env
```

## SST

SST makes it easy to build modern full-stack applications on AWS.

* Lambdas, S3, Cron jobs, and SQS are examples of services supported by the SST API (see `SstStack.ts`)
* For ECS cluster and services, not supported by its API, we use pure AWS SDK inside an SST stack (see `AwsCdkStack.ts`)

See more documentation here https://docs.sst.dev/

### Environment Variables

In SST the environment variables are pulled from `.env` files.
Variables specific per stage (e.g. `uat`, `prod`) will be placed in these files: `.env.{stage}`.
View .env file examples in LastPass.
