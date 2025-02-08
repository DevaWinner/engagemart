-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_id VARCHAR(255) NOT NULL, 
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_id VARCHAR(255) NOT NULL,  -- Changed to VARCHAR to store session IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_product_user_like UNIQUE (product_id, user_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" ON comments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON likes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON likes FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX comments_created_at_desc_idx ON comments (created_at DESC);
CREATE INDEX comments_product_id_idx ON comments(product_id);
CREATE INDEX likes_product_id_idx ON likes(product_id);
