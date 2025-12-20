-- FORMA Atlas Database Schema

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  abbreviation VARCHAR(10) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert region data
INSERT INTO regions (name, abbreviation, description) VALUES
  ('Cerebral (General Telencephalon)', 'CEREBRAL', 'Modeling general telencephalon'),
  ('Medial Ganglionic Eminence', 'MGE', 'Ventral forebrain'),
  ('Midbrain (Mesencephalon)', 'MIDBRAIN', 'Mesencephalon organoids')
ON CONFLICT (name) DO NOTHING;

-- Genotypes table
CREATE TABLE IF NOT EXISTS genotypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert genotype data
INSERT INTO genotypes (name, description) VALUES
  ('Healthy Control', 'Healthy control cell lines'),
  ('SCZ Patient', 'Schizophrenia patient-derived cell lines')
ON CONFLICT (name) DO NOTHING;

-- Organoids table
CREATE TABLE IF NOT EXISTS organoids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organoid_id VARCHAR(50) NOT NULL UNIQUE,
  region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
  genotype_id UUID REFERENCES genotypes(id) ON DELETE CASCADE,
  cell_line VARCHAR(100),
  initial_age_weeks INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MRI Scans table
CREATE TABLE IF NOT EXISTS mri_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organoid_id UUID REFERENCES organoids(id) ON DELETE CASCADE,
  scan_date DATE NOT NULL,
  age_weeks INTEGER NOT NULL,
  volume_path TEXT,
  file_size BIGINT,
  resolution_x FLOAT,
  resolution_y FLOAT,
  resolution_z FLOAT,
  sequence_type VARCHAR(50) DEFAULT 'T2-weighted 3D RARE',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_organoids_region ON organoids(region_id);
CREATE INDEX IF NOT EXISTS idx_organoids_genotype ON organoids(genotype_id);
CREATE INDEX IF NOT EXISTS idx_mri_scans_organoid ON mri_scans(organoid_id);
CREATE INDEX IF NOT EXISTS idx_mri_scans_date ON mri_scans(scan_date);
CREATE INDEX IF NOT EXISTS idx_mri_scans_age ON mri_scans(age_weeks);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for organoids table
DROP TRIGGER IF EXISTS update_organoids_updated_at ON organoids;
CREATE TRIGGER update_organoids_updated_at
  BEFORE UPDATE ON organoids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for organoid details with joins
CREATE OR REPLACE VIEW organoid_details AS
SELECT 
  o.id,
  o.organoid_id,
  r.name AS region_name,
  r.abbreviation AS region_abbreviation,
  g.name AS genotype_name,
  o.cell_line,
  o.initial_age_weeks,
  o.notes,
  o.created_at,
  o.updated_at,
  COUNT(ms.id) AS scan_count,
  MIN(ms.age_weeks) AS min_age_weeks,
  MAX(ms.age_weeks) AS max_age_weeks
FROM organoids o
LEFT JOIN regions r ON o.region_id = r.id
LEFT JOIN genotypes g ON o.genotype_id = g.id
LEFT JOIN mri_scans ms ON o.id = ms.organoid_id
GROUP BY o.id, o.organoid_id, r.name, r.abbreviation, g.name, o.cell_line, o.initial_age_weeks, o.notes, o.created_at, o.updated_at;

-- Enable Row Level Security (RLS)
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE genotypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE organoids ENABLE ROW LEVEL SECURITY;
ALTER TABLE mri_scans ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for regions" ON regions FOR SELECT USING (true);
CREATE POLICY "Public read access for genotypes" ON genotypes FOR SELECT USING (true);
CREATE POLICY "Public read access for organoids" ON organoids FOR SELECT USING (true);
CREATE POLICY "Public read access for mri_scans" ON mri_scans FOR SELECT USING (true);

