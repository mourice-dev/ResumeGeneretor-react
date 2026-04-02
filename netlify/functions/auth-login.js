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
    const { email, password } = JSON.parse(event.body);
    const sql = getDb();

    const userResult = await sql.unsafe(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (userResult.length === 0) {
      console.error(`Login failed: User not found for email ${email}`);
      return cors({
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid email or password" }),
      });
    }

    const user = userResult[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return cors({
        statusCode: 200,
        body: JSON.stringify({
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          token: generateToken(user.id),
        }),
      });
    } else {
      console.error(`Login failed: Password mismatch for email ${email}`);
      return cors({
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid email or password" }),
      });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    return cors({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    });
  }
};
