# Northcoders News API

## 📖 Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequsites](#prerequisites)
  - [Cloning this repository](#cloning)
  - [Installing dependencies](#dependencies)
- [Database Management](#database-management)
  - [Database setup](#database-setup)
  - [Database seeding](#database-seeding)
- [Special Thanks](#special-thanks)

## 🦇 About <a name = "about"></a>

This REST API has been built to access application data programmatically.

The intention is to mimic the construction of a real-world backend service (such as Reddit), which should provide information to frontend architecture.

A hosted version of this project is [available online here](https://wren-nc-news.onrender.com/api). Please be patient, as it can take a minute or two to spin up for the first time!

=======


Clicking the link above will take you to a directory describing the endpoints accepted by the API, along with examples of accepted queries and typical responses.
**Please be patient, as it can take a minute or two to spin up for the first time!**

_Please note: Your browser may require an extension to format the JSON file to be a little easier to read. For Chrome users, [this one](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en&pli=1) comes highly recommended!_

## 🚀 Getting Started <a name = "getting-started"></a>

These instructions will get a copy of this project running on your local machine for development and testing purposes!

### ⛏️ Prerequisites <a name = "prerequisites"></a>

We need to create a clone of the repository, install some dependencies and set up our testing and development databases.

This API uses Node.js and PostgreSQL for database interactions, so please ensure your installation meets the following minimum requirements:

```bash
- Node v22.8.0
- PostgreSQL v16.4
```

### 🐏 Cloning this repository <a name = "cloning"></a>

Open your terminal, navigate to the directory where you'd like to copy this repo, and run the following command:

```bash
git clone https://github.com/smlbrd/wren-nc-news.git
```

### ⛓️ Installing dependencies <a name = "dependencies"></a>

To run this API, we'll need to install some dependencies using the following terminal command:

```bash
npm install
```

## 🗄 Database Management <a name = "database-management"></a>

### 📂 Database setup <a name = "database-setup"></a>

To set up test and development databases and run this API, create these 2 files in the root of your directory:

- `.env.test`

  - This file should contain: `PGDATABASE=nc_news_test`

- `.env.development`
  - This file should contain: `PGDATABASE_nc_news`

Now we're ready to seed our databases!

### 🌱 Database seeding <a name = "database-seeding"></a>

Now we have our databases set up, we can seed them with the following command:

```bash
npm run setup-dbs
```

## 🧪 Testing <a name = "testing"></a>

The test suite for this project can be run with the following command:

```bash
npm test app
```

If you'd like to expand on this project and add your own tests, all the dependencies used for this project are listed below.

That's it - you're good to go! Have fun, and thank so much for taking a look at my work! 🙌

## 🎉 Special Thanks <a name = "special-thanks"></a>

This project gratefully depends on the work of:

- [dotenv](https://github.com/motdotla/dotenv#readme)
- [express.js](http://expressjs.com/)
- [husky](https://github.com/typicode/husky#readme)
- [jest](https://jestjs.io/)
- [jest-extended](https://github.com/jest-community/jest-extended)
- [jest-sorted](https://github.com/P-Copley/jest-sorted#readme)
- [pg](https://github.com/brianc/node-postgres)
- [pg-format](https://github.com/datalanche/node-pg-format)
- [supertest](github.com/ladjs/supertest#readme)
- [supabase](https://supabase.com/)
- [render](https://render.com/)

---

This portfolio project was built by [Wren Hawthorne](https://github.com/smlbrd) as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
