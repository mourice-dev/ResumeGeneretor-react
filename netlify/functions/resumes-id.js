/** @format */

import { handler as getOneHandler } from "./resumes-get-one.js";
import { handler as updateHandler } from "./resumes-update.js";
import { handler as deleteHandler } from "./resumes-delete.js";
import { cors } from "./utils/auth.js";

const withIdInQuery = (event) => {
  const currentQuery = event.queryStringParameters || {};

  if (currentQuery.id) {
    return event;
  }

  const path = event.path || "";
  const parts = path.split("/").filter(Boolean);
  const id = parts[parts.length - 1];

  return {
    ...event,
    queryStringParameters: {
      ...currentQuery,
      id,
    },
  };
};

export const handler = async (event, context) => {
  const normalizedEvent = withIdInQuery(event);

  if (normalizedEvent.httpMethod === "GET") {
    return getOneHandler(normalizedEvent, context);
  }

  if (normalizedEvent.httpMethod === "PUT") {
    return updateHandler(normalizedEvent, context);
  }

  if (normalizedEvent.httpMethod === "DELETE") {
    return deleteHandler(normalizedEvent, context);
  }

  if (normalizedEvent.httpMethod === "OPTIONS") {
    return cors({ statusCode: 200, body: "" });
  }

  return cors({
    statusCode: 405,
    body: JSON.stringify({ message: "Method not allowed" }),
  });
};
