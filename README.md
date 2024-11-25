# Northcoders News API

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
  - [Cloning this repository](#cloning)
  - [Installing dependencies](#dependencies)
  - [Database setup](#database_setup)
  - [Database seeding](#database-seeding)

## About <a name = "about"></a>

This API has been built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

## Getting Started <a name = "getting_started"></a>

These instructions will get a copy of this project running on your local machine for development and testing purposes!

### Prerequisites

First, we need to create a clone of the repository, install some dependencies and set up our testing and development databases.

#### Cloning this repository <a name = "cloning"></a>

Open your terminal, navigate to the directory where you'd like to copy this repo, and run the following command:

```bash
git clone https://github.com/smlbrd/wren-nc-news.git
```

From here, you can create a new (empty!) repository on GitHub, link it to your clone and push it to your new repo:

```bash
git remote set-url origin <YOUR-REPO-URL>
git push -u origin main
```

Now you should be all set to push any changes you make to your GitHub!

#### Installing dependencies <a name = "dependencies"></a>

To run this API, we'll need to install dependencies using the following terminal command:

```bash
npm install
```

This project gratefully depends on:

- [dotenv](https://github.com/motdotla/dotenv#readme)
- [express.js](http://expressjs.com/)
- [husky](https://github.com/typicode/husky#readme)
- [jest](https://jestjs.io/)
- [jest-extended](https://github.com/jest-community/jest-extended)
- [jest-sorted](https://github.com/P-Copley/jest-sorted#readme)
- [pg](https://github.com/brianc/node-postgres)
- [pg-format](https://github.com/datalanche/node-pg-format)
- [supertest](github.com/ladjs/supertest#readme)

#### Database setup <a name = "database_setup"></a>

To set up test and development databases and run this API, create these 2 files in the root of your directory:

- `.env.test`

  - This file should contain: `PGDATABASE=nc_news_test`

- `.env.development`
  - This file should contain: `PGDATABASE_nc_news`

Now we're ready to seed our databases!

#### Database seeding <a name = "database_seeding"></a>

Now we have our databases set up, we can seed them with the following command:

```bash
npm run setup-dbs
```

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
