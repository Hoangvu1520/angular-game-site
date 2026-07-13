const { knex: setupKnex, Knex } = require("knex");
const dotenv = require("dotenv");
dotenv.config();

class SetupKnexSingleton {
  constructor() {
    this.knex = setupKnex({
      client: process.env.DB_CLIENT,
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
      },
      useNullAsDefault: true,
      //   migrations: {
      //     extension: "js", // Thay đổi extension thành js
      //     directory: "../migrations",
      //   },
      pool: { min: 0, max: 20 },
    });
  }

  static getInstance() {
    if (!SetupKnexSingleton._instance) {
      SetupKnexSingleton._instance = new SetupKnexSingleton();
    }

    return SetupKnexSingleton._instance.knex;
  }
}

SetupKnexSingleton._instance = null;

module.exports = SetupKnexSingleton.getInstance();
