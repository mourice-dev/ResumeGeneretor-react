import sql from '../config/db.js';

export const getResumes = async (req, res) => {
  try {
    const result = await sql.unsafe(
      'SELECT * FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  const { id } = req.params;
  try {
    const resumeRes = await sql.unsafe(
      'SELECT * FROM resumes WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (resumeRes.length === 0) return res.status(404).json({ message: 'Resume not found' });

    const resume = resumeRes[0];
    const eduRes = await sql.unsafe('SELECT * FROM education WHERE resume_id = $1', [id]);
    const expRes = await sql.unsafe('SELECT * FROM experience WHERE resume_id = $1', [id]);
    const projRes = await sql.unsafe('SELECT * FROM projects WHERE resume_id = $1', [id]);
    const skillRes = await sql.unsafe('SELECT * FROM skills WHERE resume_id = $1', [id]);

    res.json({
      ...resume,
      education: eduRes,
      experience: expRes,
      projects: projRes,
      skills: skillRes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createResume = async (req, res) => {
  const { title, full_name, email, phone, address, summary, linkedin, website, template, education, experience, skills, projects } = req.body;

  try {
    const resumeId = await sql.begin(async (tx) => {
      const resumeRes = await tx.unsafe(
        `INSERT INTO resumes (user_id, title, full_name, email, phone, address, summary, linkedin, website, template)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [req.user.id, title, full_name, email, phone, address, summary, linkedin, website, template || 'modern']
      );
      const newResumeId = resumeRes[0].id;

      if (education && education.length > 0) {
        for (const edu of education) {
          await tx.unsafe(
            'INSERT INTO education (resume_id, institution, degree, field_of_study, start_date, end_date, gpa, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [newResumeId, edu.institution, edu.degree, edu.field_of_study, edu.start_date, edu.end_date, edu.gpa, edu.description]
          );
        }
      }

      if (experience && experience.length > 0) {
        for (const exp of experience) {
          await tx.unsafe(
            'INSERT INTO experience (resume_id, company, position, start_date, end_date, current_job, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [newResumeId, exp.company, exp.position, exp.start_date, exp.end_date, exp.current_job || false, exp.description]
          );
        }
      }

      if (skills && skills.length > 0) {
        for (const sk of skills) {
          await tx.unsafe(
            'INSERT INTO skills (resume_id, skill_name, proficiency) VALUES ($1, $2, $3)',
            [newResumeId, sk.skill_name, sk.proficiency]
          );
        }
      }

      if (projects && projects.length > 0) {
        for (const proj of projects) {
          await tx.unsafe(
            'INSERT INTO projects (resume_id, project_name, description, technologies, url) VALUES ($1, $2, $3, $4, $5)',
            [newResumeId, proj.project_name, proj.description, proj.technologies, proj.url]
          );
        }
      }

      return newResumeId;
    });

    res.status(201).json({ message: 'Resume created successfully', resumeId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  const { id } = req.params;
  const { title, full_name, email, phone, address, summary, linkedin, website, template, education, experience, skills, projects } = req.body;

  try {
    const checkRes = await sql.unsafe('SELECT id FROM resumes WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (checkRes.length === 0) {
      return res.status(404).json({ message: 'Resume not found or unauthorized' });
    }

    await sql.begin(async (tx) => {
      await tx.unsafe(
        `UPDATE resumes SET title=$1, full_name=$2, email=$3, phone=$4, address=$5, summary=$6, linkedin=$7, website=$8, template=$9, updated_at=CURRENT_TIMESTAMP WHERE id = $10`,
        [title, full_name, email, phone, address, summary, linkedin, website, template, id]
      );

      await tx.unsafe('DELETE FROM education WHERE resume_id = $1', [id]);
      await tx.unsafe('DELETE FROM experience WHERE resume_id = $1', [id]);
      await tx.unsafe('DELETE FROM skills WHERE resume_id = $1', [id]);
      await tx.unsafe('DELETE FROM projects WHERE resume_id = $1', [id]);

      if (education && education.length > 0) {
        for (const edu of education) {
          await tx.unsafe(
            'INSERT INTO education (resume_id, institution, degree, field_of_study, start_date, end_date, gpa, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, edu.institution, edu.degree, edu.field_of_study, edu.start_date, edu.end_date, edu.gpa, edu.description]
          );
        }
      }

      if (experience && experience.length > 0) {
        for (const exp of experience) {
          await tx.unsafe(
            'INSERT INTO experience (resume_id, company, position, start_date, end_date, current_job, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [id, exp.company, exp.position, exp.start_date, exp.end_date, exp.current_job || false, exp.description]
          );
        }
      }

      if (skills && skills.length > 0) {
        for (const sk of skills) {
          await tx.unsafe(
            'INSERT INTO skills (resume_id, skill_name, proficiency) VALUES ($1, $2, $3)',
            [id, sk.skill_name, sk.proficiency]
          );
        }
      }

      if (projects && projects.length > 0) {
        for (const proj of projects) {
          await tx.unsafe(
            'INSERT INTO projects (resume_id, project_name, description, technologies, url) VALUES ($1, $2, $3, $4, $5)',
            [id, proj.project_name, proj.description, proj.technologies, proj.url]
          );
        }
      }
    });

    res.json({ message: 'Resume updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.unsafe(
      'DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    if (result.length === 0) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const duplicateResume = async (req, res) => {
  res.status(501).json({ message: 'Not Implemented Yet' });
};
