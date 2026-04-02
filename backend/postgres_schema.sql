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
