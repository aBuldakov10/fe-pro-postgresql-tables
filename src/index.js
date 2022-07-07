import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'buldakov',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'buldakov',
    password: POSTGRES_PASSWORD || 'buldakov',
    port: POSTGRES_PORT || 5432,
  });


  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR (30) UNIQUE NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_DATE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS categories(
      id SERIAL PRIMARY KEY,
      name VARCHAR (30) UNIQUE NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS authors(
      id SERIAL PRIMARY KEY,
      name VARCHAR (30) UNIQUE NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS books(
      id SERIAL PRIMARY KEY,
      title VARCHAR (30) UNIQUE NOT NULL,
      userid INTEGER NOT NULL,
      authorid INTEGER NOT NULL,
      categoryid INTEGER NOT NULL,
      FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (authorid) REFERENCES authors (id) ON DELETE CASCADE,
      FOREIGN KEY (categoryid) REFERENCES categories (id) ON DELETE CASCADE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS descriptions(
      id SERIAL PRIMARY KEY,
      description VARCHAR (10000) UNIQUE NOT NULL,
      bookid INTEGER NOT NULL,
      FOREIGN KEY (bookid) REFERENCES books (id) ON DELETE CASCADE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS reviews(
      id SERIAL PRIMARY KEY,
      message VARCHAR (10000) NOT NULL,
      userid INTEGER NOT NULL,
      bookid INTEGER NOT NULL,
      FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (bookid) REFERENCES books (id) ON DELETE CASCADE
    );
  `);

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`
    INSERT INTO users(name) VALUES('userName');
  `);

  await client.query(`
    INSERT INTO categories(name) VALUES('categoryName');
  `);

  await client.query(`
    INSERT INTO authors(name) VALUES('authorsName');
  `);

  await client.query(`
    INSERT INTO books(title, userid, authorid, categoryid) VALUES('hollyBible', 1, 1, 1);
  `);

  await client.query(`
    INSERT INTO descriptions(description, bookid) VALUES('bookDescription', 1);
  `);

  await client.query(`
    INSERT INTO reviews(message, userid, bookid) VALUES('reviewsMessage', 1, 1);
  `);

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
