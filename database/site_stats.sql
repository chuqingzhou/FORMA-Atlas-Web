-- Site visit statistics table (single row)
CREATE TABLE IF NOT EXISTS site_stats (
  id TEXT PRIMARY KEY DEFAULT 'default',
  total_visits BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default row if not exists
INSERT INTO site_stats (id, total_visits) VALUES ('default', 0)
ON CONFLICT (id) DO NOTHING;
