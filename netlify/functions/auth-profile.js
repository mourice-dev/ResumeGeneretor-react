/** @format */

import { getDb } from "./utils/db.js";
import { getAuthUser, cors } from "./utils/auth.js";

export const handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return cors({ statusCode: 200, body: "" });
  }

  if (event.httpMethod !== "GET") {
    return cors({
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    });
  }

  try {
    const user = getAuthUser(event);
    if (!user) {
      return cors({
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      });
    }

    const sql = getDb();
    const userResult = await sql.unsafe(
      "SELECT id, full_name, email, created_at FROM users WHERE id = $1",
      [user.id],
    );

    if (userResult.length > 0) {
      return cors({
        statusCode: 200,
        body: JSON.stringify(userResult[0]),
      });
    } else {
      return cors({
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      });
    }
  } catch (error) {
    return cors({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    });
  }
};
