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

    const id = event.queryStringParameters?.id;
    if (!id) {
      return cors({
        statusCode: 400,
        body: JSON.stringify({ message: "Resume ID required" }),
      });
    }

    const sql = getDb();
    const resumeRes = await sql.unsafe(
      "SELECT * FROM resumes WHERE id = $1 AND user_id = $2",
      [id, user.id],
    );

    if (resumeRes.length === 0) {
      return cors({
        statusCode: 404,
        body: JSON.stringify({ message: "Resume not found" }),
      });
    }

    const resume = resumeRes[0];
    const eduRes = await sql.unsafe(
      "SELECT * FROM education WHERE resume_id = $1",
      [id],
    );
    const expRes = await sql.unsafe(
      "SELECT * FROM experience WHERE resume_id = $1",
      [id],
    );
    const projRes = await sql.unsafe(
      "SELECT * FROM projects WHERE resume_id = $1",
      [id],
    );
    const skillRes = await sql.unsafe(
      "SELECT * FROM skills WHERE resume_id = $1",
      [id],
    );

    return cors({
      statusCode: 200,
      body: JSON.stringify({
        ...resume,
        education: eduRes,
        experience: expRes,
        projects: projRes,
        skills: skillRes,
      }),
    });
  } catch (error) {
    return cors({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    });
  }
};
