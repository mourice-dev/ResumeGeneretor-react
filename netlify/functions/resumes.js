/** @format */

import { handler as listHandler } from "./resumes-list.js";
import { handler as createHandler } from "./resumes-create.js";
import { cors } from "./utils/auth.js";

export const handler = async (event, context) => {
  if (event.httpMethod === "GET") {
    return listHandler(event, context);
  }

  if (event.httpMethod === "POST") {
    return createHandler(event, context);
  }

  if (event.httpMethod === "OPTIONS") {
    return cors({ statusCode: 200, body: "" });
  }

  return cors({
    statusCode: 405,
    body: JSON.stringify({ message: "Method not allowed" }),
  });
};
