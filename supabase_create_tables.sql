-- Create ENUM types for relationship and residenceType
CREATE TYPE resident_relationship AS ENUM ('Chủ hộ', 'Thành viên');
CREATE TYPE resident_residence_type AS ENUM ('Thường trú', 'Tạm trú');

-- Create the 'users' table
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    avatarUrl text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create the 'residents' table
CREATE TABLE residents (
    id text PRIMARY KEY, -- Use text for custom ID format (ID00001, ID00002, etc.)
    name text NOT NULL,
    dob date,
    address text,
    relationship resident_relationship,
    phone text,
    email text,
    residence_type resident_residence_type,
    joined_date date,
    avatar_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create the 'events' table
CREATE TABLE events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    date date,
    description text,
    qrCodeUrl text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create the 'feedbacks' table
CREATE TABLE feedbacks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author text, -- Assuming this might be a user ID or name, text is safe for now.
    timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()),
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Optional: Add foreign key constraint if 'author' in 'feedbacks' should link to 'users.id'
-- ALTER TABLE feedbacks ADD CONSTRAINT fk_author FOREIGN KEY (author) REFERENCES users(id);
-- Note: This requires 'author' in 'feedbacks' to be of type uuid and to exist in 'users' table.
-- For now, keeping it as text as per the type definition.

-- Optional: Add indexes for frequently queried columns if performance becomes an issue
-- CREATE INDEX idx_residents_name ON residents(name);
-- CREATE INDEX idx_events_date ON events(date);
