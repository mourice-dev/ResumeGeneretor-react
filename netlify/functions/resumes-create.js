/** @format */

import { getDb } from "./utils/db.js";
import { getAuthUser, cors } from "./utils/auth.js";

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
    const user = getAuthUser(event);
    if (!user) {
      return cors({
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
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

    const resumeId = await sql.begin(async (tx) => {
      const resumeRes = await tx.unsafe(
        `INSERT INTO resumes (user_id, title, full_name, email, phone, address, summary, linkedin, website, template)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          user.id,
          title,
          full_name,
          email,
          phone,
          address,
          summary,
          linkedin,
          website,
          template || "modern",
        ],
      );
      const newResumeId = resumeRes[0].id;

      if (education && education.length > 0) {
        for (const edu of education) {
          await tx.unsafe(
            "INSERT INTO education (resume_id, institution, degree, field_of_study, start_date, end_date, gpa, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [
              newResumeId,
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
              newResumeId,
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
            [newResumeId, sk.skill_name, sk.proficiency],
          );
        }
      }

      if (projects && projects.length > 0) {
        for (const proj of projects) {
          await tx.unsafe(
            "INSERT INTO projects (resume_id, project_name, description, technologies, url) VALUES ($1, $2, $3, $4, $5)",
            [
              newResumeId,
              proj.project_name,
              proj.description,
              proj.technologies,
              proj.url,
            ],
          );
        }
      }

      return newResumeId;
    });

    return cors({
      statusCode: 201,
      body: JSON.stringify({
        message: "Resume created successfully",
        resumeId,
      }),
    });
  } catch (error) {
    return cors({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    });
  }
};
