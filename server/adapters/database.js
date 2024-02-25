import pg from "pg";
const { Pool } = pg;
import "dotenv/config";

/**
 * Database class
 */
export class DatabaseAdapter {
  pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
    });

    this.pool.connect((err) => {
      if (err) {
        throw err;
      }
      console.log("Connected to database");
    });
  }

  /**
   * Query the database
   * @param {string} query
   */
  query(query, params) {
    if (params === undefined) {
      return this.pool.query(query);
    } else {
      return this.pool.query(query, params);
    }
  }
}
