BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(100),
  address TEXT,
  summary TEXT,
  linkedin TEXT,
  website TEXT,
  template VARCHAR(100) DEFAULT 'modern',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  institution VARCHAR(255),
  degree VARCHAR(255),
  field_of_study VARCHAR(255),
  start_date VARCHAR(100),
  end_date VARCHAR(100),
  gpa VARCHAR(50),
  description TEXT
);

CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  company VARCHAR(255),
  position VARCHAR(255),
  start_date VARCHAR(100),
  end_date VARCHAR(100),
  current_job BOOLEAN DEFAULT FALSE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  skill_name VARCHAR(255),
  proficiency VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  project_name VARCHAR(255),
  description TEXT,
  technologies TEXT,
  url TEXT
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_resumes_updated_at ON resumes;

CREATE TRIGGER set_resumes_updated_at
BEFORE UPDATE ON resumes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

INSERT INTO users (id, full_name, email, password, created_at)
VALUES
  (
    1,
    'Sample User',
    'user@email.com',
    '$2b$10$SP8IR8rmRY9ihzQsOQDgk.0Fw8HaZ/uyqkRSbZ5V0RPQoCcsxolx.',
    CURRENT_TIMESTAMP
  )
ON CONFLICT (email) DO NOTHING;

INSERT INTO resumes (
  id,
  user_id,
  title,
  full_name,
  email,
  phone,
  address,
  summary,
  linkedin,
  website,
  template,
  created_at,
  updated_at
)
VALUES
  (
    1,
    1,
    'Senior Frontend Developer',
    'Sample User',
    'user@email.com',
    '+1 234 567 890',
    'City, Country',
    'Experienced professional with a passion for building great products and delivering value through quality work.',
    'https://www.linkedin.com/in/user',
    'https://user.dev',
    'modern',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT DO NOTHING;

INSERT INTO education (id, resume_id, institution, degree, field_of_study, start_date, end_date, gpa, description)
VALUES
  (
    1,
    1,
    'University of Rwanda',
    'Bachelor of Science',
    'Computer Science',
    '2016',
    '2020',
    '3.8/4.0',
    'Focused on software engineering, database systems, and human-computer interaction.'
  )
ON CONFLICT DO NOTHING;

INSERT INTO experience (id, resume_id, company, position, start_date, end_date, current_job, description)
VALUES
  (
    1,
    1,
    'Acme Digital Studio',
    'Senior Frontend Developer',
    '2022',
    'Present',
    TRUE,
    'Built reusable React components, improved dashboard performance, and collaborated with backend engineers to ship resume-building workflows.'
  ),
  (
    2,
    1,
    'BrightSoft',
    'Frontend Developer',
    '2020',
    '2022',
    FALSE,
    'Developed responsive user interfaces, integrated REST APIs, and contributed to authentication and profile management features.'
  )
ON CONFLICT DO NOTHING;

INSERT INTO skills (id, resume_id, skill_name, proficiency)
VALUES
  (1, 1, 'React', 'Expert'),
  (2, 1, 'JavaScript', 'Expert'),
  (3, 1, 'PostgreSQL', 'Intermediate'),
  (4, 1, 'Node.js', 'Intermediate'),
  (5, 1, 'Tailwind CSS', 'Expert')
ON CONFLICT DO NOTHING;

INSERT INTO projects (id, resume_id, project_name, description, technologies, url)
VALUES
  (
    1,
    1,
    'ResumeForge',
    'A resume builder platform that allows users to create, update, preview, and manage professional resumes online.',
    'React, Node.js, Express, PostgreSQL',
    'https://github.com/mourice-dev/ResumeGeneretor-react'
  ),
  (
    2,
    1,
    'Portfolio Website',
    'Personal portfolio showcasing projects, technical writing, and contact information.',
    'React, Vite, CSS',
    'https://johndoe.dev'
  )
ON CONFLICT DO NOTHING;

SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1), TRUE);
SELECT setval('resumes_id_seq', COALESCE((SELECT MAX(id) FROM resumes), 1), TRUE);
SELECT setval('education_id_seq', COALESCE((SELECT MAX(id) FROM education), 1), TRUE);
SELECT setval('experience_id_seq', COALESCE((SELECT MAX(id) FROM experience), 1), TRUE);
SELECT setval('skills_id_seq', COALESCE((SELECT MAX(id) FROM skills), 1), TRUE);
SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 1), TRUE);

COMMIT;
