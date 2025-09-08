-- 1. Core Users & Roles
CREATE TABLE roles (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE
);
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id     INT REFERENCES roles(id),
  full_name   TEXT NOT NULL,
  username    TEXT NOT NULL UNIQUE,
  phone       TEXT,
  password_hash TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. School Configuration
CREATE TABLE terms (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL
);
CREATE TABLE classes (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL
);
CREATE TABLE sections (
  id          SERIAL PRIMARY KEY,
  class_id    INT REFERENCES classes(id),
  name        TEXT NOT NULL
);
CREATE TABLE subjects (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL
);

-- 3. Pupils & Registration
CREATE TABLE pupils (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT NOT NULL,
  class_id    INT REFERENCES classes(id),
  section_id  INT REFERENCES sections(id),
  date_of_birth DATE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Academic Records
CREATE TABLE marks (
  id          SERIAL PRIMARY KEY,
  pupil_id    UUID REFERENCES pupils(id),
  subject_id  INT REFERENCES subjects(id),
  term_id     INT REFERENCES terms(id),
  marks       NUMERIC(5,2),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE conduct_reports (
  id          SERIAL PRIMARY KEY,
  pupil_id    UUID REFERENCES pupils(id),
  term_id     INT REFERENCES terms(id),
  behavior    TEXT,
  attendance  INT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Fees
CREATE TABLE fee_schedules (
  id          SERIAL PRIMARY KEY,
  class_id    INT REFERENCES classes(id),
  term_id     INT REFERENCES terms(id),
  amount_due  NUMERIC(12,2) NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE fee_payments (
  id          SERIAL PRIMARY KEY,
  pupil_id    UUID REFERENCES pupils(id),
  schedule_id INT REFERENCES fee_schedules(id),
  amount      NUMERIC(12,2) NOT NULL,
  paid_at     DATE NOT NULL,
  recorded_by UUID REFERENCES users(id),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Library
CREATE TABLE books (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  author        TEXT NOT NULL,
  isbn          TEXT UNIQUE,
  total_copies  INT NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE checkouts (
  id            SERIAL PRIMARY KEY,
  book_id       INT REFERENCES books(id),
  pupil_id      UUID REFERENCES pupils(id),
  checked_out_at DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date      DATE NOT NULL,
  returned_at   DATE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Assignments & Submissions
CREATE TABLE assignments (
  id            SERIAL PRIMARY KEY,
  teacher_id    UUID REFERENCES users(id),
  subject_id    INT REFERENCES subjects(id),
  title         TEXT NOT NULL,
  description   TEXT,
  due_date      DATE NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE assignment_files (
  id            SERIAL PRIMARY KEY,
  assignment_id INT REFERENCES assignments(id),
  filename      TEXT,
  path          TEXT,
  mime_type     TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE submissions (
  id            SERIAL PRIMARY KEY,
  assignment_id INT REFERENCES assignments(id),
  student_id    UUID REFERENCES users(id),
  comment       TEXT,
  submitted_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE submission_files (
  id            SERIAL PRIMARY KEY,
  submission_id INT REFERENCES submissions(id),
  filename      TEXT,
  path          TEXT,
  mime_type     TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE grades (
  id            SERIAL PRIMARY KEY,
  submission_id INT REFERENCES submissions(id),
  teacher_id    UUID REFERENCES users(id),
  grade         TEXT,
  graded_at     TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Messaging
CREATE TABLE threads (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE thread_members (
  thread_id     INT REFERENCES threads(id),
  user_id       UUID REFERENCES users(id),
  PRIMARY KEY (thread_id, user_id)
);
CREATE TABLE messages (
  id            SERIAL PRIMARY KEY,
  thread_id     INT REFERENCES threads(id),
  sender_id     UUID REFERENCES users(id),
  text          TEXT NOT NULL,
  timestamp     TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE message_reads (
  message_id    INT REFERENCES messages(id),
  user_id       UUID REFERENCES users(id),
  read_at       TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

-- 9. Notifications Settings
CREATE TABLE parent_settings (
  parent_id     UUID PRIMARY KEY REFERENCES users(id),
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled   BOOLEAN DEFAULT FALSE,
  push_enabled  BOOLEAN DEFAULT FALSE
);
CREATE TABLE child_notifications (
  parent_id     UUID REFERENCES users(id),
  child_id      UUID REFERENCES pupils(id),
  event_id      TEXT,
  email         BOOLEAN DEFAULT FALSE,
  sms           BOOLEAN DEFAULT FALSE,
  push          BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (parent_id, child_id, event_id)
);
-- 10. Audit Logs
CREATE TABLE audit_logs (
  id            SERIAL PRIMARY KEY,
  user_id       UUID REFERENCES users(id),
  action        TEXT NOT NULL,
  entity        TEXT NOT NULL,
  entity_id     UUID,
  timestamp     TIMESTAMP WITH TIME ZONE DEFAULT now(),
  details       JSONB
);
-- Indexes for performance
CREATE INDEX idx_marks_pupil ON marks(pupil_id);  
CREATE INDEX idx_fee_payments_pupil ON fee_payments(pupil_id);  
CREATE INDEX idx_checkouts_pupil ON checkouts(pupil_id);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);  
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
-- End of schema.sql
