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
    const result = await sql.unsafe(
      "SELECT * FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC",
      [user.id],
    );

    return cors({
      statusCode: 200,
      body: JSON.stringify(result),
    });
  } catch (error) {
    return cors({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    });
  }
};
