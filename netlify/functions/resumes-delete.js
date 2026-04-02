/** @format */

import { getDb } from "./utils/db.js";
import { getAuthUser, cors } from "./utils/auth.js";

export const handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return cors({ statusCode: 200, body: "" });
  }

  if (event.httpMethod !== "DELETE") {
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

    const id = event.queryStringParameters?.id;
    if (!id) {
      return cors({
        statusCode: 400,
        body: JSON.stringify({ message: "Resume ID required" }),
      });
    }

    const sql = getDb();
    const result = await sql.unsafe(
      "DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, user.id],
    );

    if (result.length === 0) {
      return cors({
        statusCode: 404,
        body: JSON.stringify({ message: "Resume not found" }),
      });
    }

    return cors({
      statusCode: 200,
      body: JSON.stringify({ message: "Resume deleted successfully" }),
    });
  } catch (error) {
    return cors({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    });
  }
};
