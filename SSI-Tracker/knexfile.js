require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : process.env.PG_PASSWORD,
      database : 'postgres',
      port: process.env.PG_PORT || 5432
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds' },
  },

  testing: {
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : process.env.PG_PASSWORD,
      database : 'test',
      port: process.env.PG_PORT || 5432
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds' },
  },

  production: {
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : process.env.PG_PASSWORD,
      database : 'postgres',
      port: process.env.PG_PORT || 5432
    },
    migrations: {
      directory: './database/migrations',
    },
    seeds: { directory: './database/seeds' },
  },
};
