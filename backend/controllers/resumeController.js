import pool from '../config/db.js';

export const getResumes = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC',
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
    const [resumeRes] = await pool.query('SELECT * FROM resumes WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (resumeRes.length === 0) return res.status(404).json({ message: 'Resume not found' });

    const resume = resumeRes[0];
    const [eduRes] = await pool.query('SELECT * FROM education WHERE resume_id = ?', [id]);
    const [expRes] = await pool.query('SELECT * FROM experience WHERE resume_id = ?', [id]);
    const [projRes] = await pool.query('SELECT * FROM projects WHERE resume_id = ?', [id]);
    const [skillRes] = await pool.query('SELECT * FROM skills WHERE resume_id = ?', [id]);

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
  const client = await pool.getConnection();
  try {
    await client.beginTransaction();
    const [resumeRes] = await client.query(
      `INSERT INTO resumes (user_id, title, full_name, email, phone, address, summary, linkedin, website, template)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, full_name, email, phone, address, summary, linkedin, website, template || 'modern']
    );
    const resumeId = resumeRes.insertId;

    if (education && education.length > 0) {
      for (const edu of education) {
        await client.query(
          'INSERT INTO education (resume_id, institution, degree, field_of_study, start_date, end_date, gpa, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [resumeId, edu.institution, edu.degree, edu.field_of_study, edu.start_date, edu.end_date, edu.gpa, edu.description]
        );
      }
    }

    if (experience && experience.length > 0) {
      for (const exp of experience) {
        await client.query(
          'INSERT INTO experience (resume_id, company, position, start_date, end_date, current_job, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [resumeId, exp.company, exp.position, exp.start_date, exp.end_date, exp.current_job || false, exp.description]
        );
      }
    }

    if (skills && skills.length > 0) {
      for (const sk of skills) {
        await client.query(
          'INSERT INTO skills (resume_id, skill_name, proficiency) VALUES (?, ?, ?)',
          [resumeId, sk.skill_name, sk.proficiency]
        );
      }
    }

    if (projects && projects.length > 0) {
      for (const proj of projects) {
        await client.query(
          'INSERT INTO projects (resume_id, project_name, description, technologies, url) VALUES (?, ?, ?, ?, ?)',
          [resumeId, proj.project_name, proj.description, proj.technologies, proj.url]
        );
      }
    }

    await client.commit();
    res.status(201).json({ message: 'Resume created successfully', resumeId });
  } catch (error) {
    await client.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const updateResume = async (req, res) => {
  const { id } = req.params;
  const { title, full_name, email, phone, address, summary, linkedin, website, template, education, experience, skills, projects } = req.body;
  const client = await pool.getConnection();

  try {
    const [checkRes] = await client.query('SELECT id FROM resumes WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (checkRes.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Resume not found or unauthorized' });
    }

    await client.beginTransaction();

    await client.query(
      `UPDATE resumes SET title=?, full_name=?, email=?, phone=?, address=?, summary=?, linkedin=?, website=?, template=?, updated_at=CURRENT_TIMESTAMP WHERE id = ?`,
      [title, full_name, email, phone, address, summary, linkedin, website, template, id]
    );

    await client.query('DELETE FROM education WHERE resume_id = ?', [id]);
    await client.query('DELETE FROM experience WHERE resume_id = ?', [id]);
    await client.query('DELETE FROM skills WHERE resume_id = ?', [id]);
    await client.query('DELETE FROM projects WHERE resume_id = ?', [id]);

    if (education && education.length > 0) {
      for (const edu of education) {
        await client.query('INSERT INTO education (resume_id, institution, degree, field_of_study, start_date, end_date, gpa, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [id, edu.institution, edu.degree, edu.field_of_study, edu.start_date, edu.end_date, edu.gpa, edu.description]);
      }
    }

    if (experience && experience.length > 0) {
      for (const exp of experience) {
        await client.query('INSERT INTO experience (resume_id, company, position, start_date, end_date, current_job, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id, exp.company, exp.position, exp.start_date, exp.end_date, exp.current_job || false, exp.description]);
      }
    }

    if (skills && skills.length > 0) {
      for (const sk of skills) {
        await client.query('INSERT INTO skills (resume_id, skill_name, proficiency) VALUES (?, ?, ?)', [id, sk.skill_name, sk.proficiency]);
      }
    }

    if (projects && projects.length > 0) {
      for (const proj of projects) {
        await client.query('INSERT INTO projects (resume_id, project_name, description, technologies, url) VALUES (?, ?, ?, ?, ?)', [id, proj.project_name, proj.description, proj.technologies, proj.url]);
      }
    }

    await client.commit();
    res.json({ message: 'Resume updated successfully' });
  } catch (error) {
    await client.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const deleteResume = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM resumes WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const duplicateResume = async (req, res) => {
  res.status(501).json({ message: 'Not Implemented Yet' });
};
