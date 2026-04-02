/** @format */

import bcrypt from "bcrypt";
import { getDb } from "./utils/db.js";
import { generateToken, cors } from "./utils/auth.js";

export const handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return cors({ statusCode: 200, body: "" });
  }

  if (event.httpMethod !== "POST") {
    return cors({
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    });
  }

  try {
    const { full_name, email, password } = JSON.parse(event.body);
    const sql = getDb();

    const userExists = await sql.unsafe(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (userExists.length > 0) {
      return cors({
        statusCode: 400,
        body: JSON.stringify({ message: "User already exists" }),
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await sql.unsafe(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [full_name, email, hashedPassword],
    );

    return cors({
      statusCode: 201,
      body: JSON.stringify({
        id: newUser[0].id,
        full_name,
        email,
        token: generateToken(newUser[0].id),
      }),
    });
  } catch (error) {
    return cors({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    });
  }
};
