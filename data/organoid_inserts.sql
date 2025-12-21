-- Organoid 数据导入
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W01', '18-1', 'S113', '1', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W02', '18-1', 'S113', '2', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W03', '18-1', 'S113', '3', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W04', '18-1', 'S113', '4', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W05', '18-1', 'S113', '5', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W06', '18-1', 'S113', '6', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W07', '18-1', 'S113', '7', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W08', '18-1', 'S113', '8', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W09', '18-1', 'S113', '9', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W10', '18-1', 'S113', '10', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W11', '18-1', 'S113', '11', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W12', '18-1', 'S113', '12', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W13', '18-1', 'S113', '13', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W14', '18-1', 'S113', '14', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S113W15', '18-1', 'S113', '15', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W01', '18-2', 'S114', '1', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W02', '18-2', 'S114', '2', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W03', '18-2', 'S114', '3', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W04', '18-2', 'S114', '4', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W05', '18-2', 'S114', '5', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W06', '18-2', 'S114', '6', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W07', '18-2', 'S114', '7', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W08', '18-2', 'S114', '8', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W09', '18-2', 'S114', '9', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W10', '18-2', 'S114', '10', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W11', '18-2', 'S114', '11', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W12', '18-2', 'S114', '12', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W13', '18-2', 'S114', '13', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W14', '18-2', 'S114', '14', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S114W15', '18-2', 'S114', '15', (SELECT id FROM batches WHERE batch_id = 'B5'), (SELECT id FROM cell_lines WHERE line_id = 'iPSC01'), (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W01', '18-3', 'S115', '1', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W02', '18-3', 'S115', '2', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W03', '18-3', 'S115', '3', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W04', '18-3', 'S115', '4', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W05', '18-3', 'S115', '5', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W06', '18-3', 'S115', '6', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W07', '18-3', 'S115', '7', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W08', '18-3', 'S115', '8', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W09', '18-3', 'S115', '9', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W10', '18-3', 'S115', '10', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W11', '18-3', 'S115', '11', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W12', '18-3', 'S115', '12', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W13', '18-3', 'S115', '13', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W14', '18-3', 'S115', '14', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S115W15', '18-3', 'S115', '15', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W01', '18-4', 'S116', '1', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W02', '18-4', 'S116', '2', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W03', '18-4', 'S116', '3', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W04', '18-4', 'S116', '4', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W05', '18-4', 'S116', '5', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W06', '18-4', 'S116', '6', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W07', '18-4', 'S116', '7', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W08', '18-4', 'S116', '8', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W09', '18-4', 'S116', '9', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W10', '18-4', 'S116', '10', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W11', '18-4', 'S116', '11', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W12', '18-4', 'S116', '12', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W13', '18-4', 'S116', '13', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W14', '18-4', 'S116', '14', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;
INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('S116W15', '18-4', 'S116', '15', (SELECT id FROM batches WHERE batch_id = 'B5'), NULL, (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 'Day149', '2025-12-18', false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;