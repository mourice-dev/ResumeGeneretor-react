/** @format */

import postgres from "postgres";

let sql;

export const getDb = () => {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL, {
      ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
      max: 10,
    });
  }
  return sql;
};
