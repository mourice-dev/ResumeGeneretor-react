BEGIN;

WITH demo_users(full_name, email, password) AS (
  VALUES
    ('Amina Niyonsaba', 'amina@example.com', '$2b$10$SP8IR8rmRY9ihzQsOQDgk.0Fw8HaZ/uyqkRSbZ5V0RPQoCcsxolx.'),
    ('Brian Kamanzi', 'brian@example.com', '$2b$10$SP8IR8rmRY9ihzQsOQDgk.0Fw8HaZ/uyqkRSbZ5V0RPQoCcsxolx.'),
    ('Chipo Moyo', 'chipo@example.com', '$2b$10$SP8IR8rmRY9ihzQsOQDgk.0Fw8HaZ/uyqkRSbZ5V0RPQoCcsxolx.'),
    ('David Okello', 'david@example.com', '$2b$10$SP8IR8rmRY9ihzQsOQDgk.0Fw8HaZ/uyqkRSbZ5V0RPQoCcsxolx.')
)
INSERT INTO users (full_name, email, password)
SELECT du.full_name, du.email, du.password
FROM demo_users du
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.email = du.email
);

WITH demo_resumes(owner_email, title, full_name, email, phone, address, summary, linkedin, website, template) AS (
  VALUES
    ('amina@example.com', 'Frontend Engineer', 'Amina Niyonsaba', 'amina@example.com', '+250700111111', 'Kigali, Rwanda', 'Frontend engineer focused on performant React interfaces.', 'https://linkedin.com/in/amina', 'https://amina.dev', 'modern'),
    ('amina@example.com', 'UI Developer', 'Amina Niyonsaba', 'amina@example.com', '+250700111112', 'Kigali, Rwanda', 'UI developer with strong design-system experience.', 'https://linkedin.com/in/amina-ui', 'https://ui-amina.dev', 'modern'),
    ('amina@example.com', 'Product Designer Resume', 'Amina Niyonsaba', 'amina@example.com', '+250700111113', 'Kigali, Rwanda', 'Design-minded professional building intuitive digital products.', 'https://linkedin.com/in/amina-design', 'https://amina.design', 'classic'),
    ('amina@example.com', 'React Specialist', 'Amina Niyonsaba', 'amina@example.com', '+250700111114', 'Kigali, Rwanda', 'React specialist delivering scalable SPA architecture.', 'https://linkedin.com/in/amina-react', 'https://react-amina.dev', 'modern'),

    ('brian@example.com', 'Backend Engineer', 'Brian Kamanzi', 'brian@example.com', '+250700222221', 'Musanze, Rwanda', 'Backend engineer focused on Node.js and PostgreSQL APIs.', 'https://linkedin.com/in/brian', 'https://brian.dev', 'modern'),
    ('brian@example.com', 'Full Stack Developer', 'Brian Kamanzi', 'brian@example.com', '+250700222222', 'Musanze, Rwanda', 'Full stack developer building end-to-end web products.', 'https://linkedin.com/in/brian-fullstack', 'https://brianfs.dev', 'modern'),
    ('brian@example.com', 'API Developer', 'Brian Kamanzi', 'brian@example.com', '+250700222223', 'Musanze, Rwanda', 'API developer with strong authentication and DB design skills.', 'https://linkedin.com/in/brian-api', 'https://api-brian.dev', 'minimal'),
    ('brian@example.com', 'Platform Engineer', 'Brian Kamanzi', 'brian@example.com', '+250700222224', 'Musanze, Rwanda', 'Platform engineer improving reliability and deployment pipelines.', 'https://linkedin.com/in/brian-platform', 'https://platform-brian.dev', 'classic'),

    ('chipo@example.com', 'Data Analyst', 'Chipo Moyo', 'chipo@example.com', '+263770333331', 'Harare, Zimbabwe', 'Data analyst turning raw data into business insights.', 'https://linkedin.com/in/chipo', 'https://chipo.dev', 'modern'),
    ('chipo@example.com', 'BI Specialist', 'Chipo Moyo', 'chipo@example.com', '+263770333332', 'Harare, Zimbabwe', 'BI specialist building dashboards and reporting pipelines.', 'https://linkedin.com/in/chipo-bi', 'https://chipo-bi.dev', 'minimal'),
    ('chipo@example.com', 'Data Engineer', 'Chipo Moyo', 'chipo@example.com', '+263770333333', 'Harare, Zimbabwe', 'Data engineer focused on ETL and warehouse modeling.', 'https://linkedin.com/in/chipo-data', 'https://data-chipo.dev', 'classic'),

    ('david@example.com', 'DevOps Engineer', 'David Okello', 'david@example.com', '+256700444441', 'Kampala, Uganda', 'DevOps engineer automating CI/CD and cloud infrastructure.', 'https://linkedin.com/in/david', 'https://david.dev', 'modern'),
    ('david@example.com', 'Cloud Engineer', 'David Okello', 'david@example.com', '+256700444442', 'Kampala, Uganda', 'Cloud engineer designing secure and scalable cloud systems.', 'https://linkedin.com/in/david-cloud', 'https://cloud-david.dev', 'minimal'),
    ('david@example.com', 'Site Reliability Engineer', 'David Okello', 'david@example.com', '+256700444443', 'Kampala, Uganda', 'SRE improving uptime, monitoring, and incident response.', 'https://linkedin.com/in/david-sre', 'https://sre-david.dev', 'classic')
)
INSERT INTO resumes (
  user_id, title, full_name, email, phone, address, summary, linkedin, website, template
)
SELECT
  u.id, dr.title, dr.full_name, dr.email, dr.phone, dr.address, dr.summary, dr.linkedin, dr.website, dr.template
FROM demo_resumes dr
JOIN users u ON u.email = dr.owner_email
WHERE NOT EXISTS (
  SELECT 1
  FROM resumes r
  WHERE r.user_id = u.id
    AND r.title = dr.title
);

COMMIT;

-- Verification query:
-- SELECT u.email, COUNT(r.id) AS resume_count
-- FROM users u
-- LEFT JOIN resumes r ON r.user_id = u.id
-- WHERE u.email IN ('amina@example.com','brian@example.com','chipo@example.com','david@example.com')
-- GROUP BY u.email
-- ORDER BY u.email;
