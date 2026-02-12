
-- D1 Database Schema for Crop Diary (Fasli)

CREATE TABLE IF NOT EXISTS farmers (
  id TEXT PRIMARY KEY,
  name TEXT,
  mobile TEXT UNIQUE,
  region_id TEXT,
  primary_crop TEXT,
  membership_type TEXT,
  joint_year TEXT
);

CREATE TABLE IF NOT EXISTS cultivations (
  id TEXT PRIMARY KEY,
  farmer_id TEXT,
  crop_name TEXT,
  land_name TEXT,
  area_size REAL,
  start_date TEXT,
  image_url TEXT,
  farming_method TEXT,
  irrigation_source TEXT,
  irrigation_method TEXT,
  is_insured INTEGER, -- 0 or 1
  planting_method TEXT
);

CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  cultivation_id TEXT,
  date TEXT,
  category TEXT,
  type TEXT,
  amount REAL,
  quantity REAL,
  description TEXT,
  FOREIGN KEY(cultivation_id) REFERENCES cultivations(id)
);

CREATE TABLE IF NOT EXISTS market_posts (
  id TEXT PRIMARY KEY,
  farmer_id TEXT,
  farmer_name TEXT,
  type TEXT,
  item_name TEXT,
  quantity REAL,
  amount REAL,
  date TEXT,
  contact TEXT
);

CREATE TABLE IF NOT EXISTS queries (
  id TEXT PRIMARY KEY,
  cultivation_id TEXT,
  farmer_id TEXT,
  crop_name TEXT,
  date TEXT,
  status TEXT,
  question TEXT,
  solution TEXT,
  image_url TEXT
);
