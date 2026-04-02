/** @format */

import { getDb } from "./utils/db.js";
import { getAuthUser, cors } from "./utils/auth.js";

export const handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return cors({ statusCode: 200, body: "" });
  }

  if (event.httpMethod !== "PUT") {
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

    const {
      title,
      full_name,
      email,
      phone,
      address,
      summary,
      linkedin,
      website,
      template,
      education,
      experience,
      skills,
      projects,
    } = JSON.parse(event.body);
    const sql = getDb();

    const checkRes = await sql.unsafe(
      "SELECT id FROM resumes WHERE id = $1 AND user_id = $2",
      [id, user.id],
    );
    if (checkRes.length === 0) {
      return cors({
        statusCode: 404,
        body: JSON.stringify({ message: "Resume not found or unauthorized" }),
      });
    }

    await sql.begin(async (tx) => {
      await tx.unsafe(
        `UPDATE resumes SET title=$1, full_name=$2, email=$3, phone=$4, address=$5, summary=$6, linkedin=$7, website=$8, template=$9, updated_at=CURRENT_TIMESTAMP WHERE id = $10`,
        [
          title,
          full_name,
          email,
          phone,
          address,
          summary,
          linkedin,
          website,
          template,
          id,
        ],
      );

      await tx.unsafe("DELETE FROM education WHERE resume_id = $1", [id]);
      await tx.unsafe("DELETE FROM experience WHERE resume_id = $1", [id]);
      await tx.unsafe("DELETE FROM skills WHERE resume_id = $1", [id]);
      await tx.unsafe("DELETE FROM projects WHERE resume_id = $1", [id]);

      if (education && education.length > 0) {
        for (const edu of education) {
          await tx.unsafe(
            "INSERT INTO education (resume_id, institution, degree, field_of_study, start_date, end_date, gpa, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [
              id,
              edu.institution,
              edu.degree,
              edu.field_of_study,
              edu.start_date,
              edu.end_date,
              edu.gpa,
              edu.description,
            ],
          );
        }
      }

      if (experience && experience.length > 0) {
        for (const exp of experience) {
          await tx.unsafe(
            "INSERT INTO experience (resume_id, company, position, start_date, end_date, current_job, description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [
              id,
              exp.company,
              exp.position,
              exp.start_date,
              exp.end_date,
              exp.current_job || false,
              exp.description,
            ],
          );
        }
      }

      if (skills && skills.length > 0) {
        for (const sk of skills) {
          await tx.unsafe(
            "INSERT INTO skills (resume_id, skill_name, proficiency) VALUES ($1, $2, $3)",
            [id, sk.skill_name, sk.proficiency],
          );
        }
      }

      if (projects && projects.length > 0) {
        for (const proj of projects) {
          await tx.unsafe(
            "INSERT INTO projects (resume_id, project_name, description, technologies, url) VALUES ($1, $2, $3, $4, $5)",
            [
              id,
              proj.project_name,
              proj.description,
              proj.technologies,
              proj.url,
            ],
          );
        }
      }
    });

    return cors({
      statusCode: 200,
      body: JSON.stringify({ message: "Resume updated successfully" }),
    });
  } catch (error) {
    return cors({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    });
  }
};
