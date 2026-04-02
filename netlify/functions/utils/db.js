/** @format */

import postgres from "postgres";

let sql;

export const getDb = () => {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL, {
      ssl: 'require',
      max: 10,
    });
  }
  return sql;
};
