-- Sweet Deal Decision Engine — PostgreSQL Schema
-- Run once: psql sdde < server/schema.sql

-- User Profile (single row, id=1 upsert)
CREATE TABLE IF NOT EXISTS user_profiles (
  id           SERIAL PRIMARY KEY,
  data         JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Settings (single row, id=1 upsert, stores Claude API key)
CREATE TABLE IF NOT EXISTS settings (
  id           SERIAL PRIMARY KEY,
  data         JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deals (one per deal, full object as JSONB)
CREATE TABLE IF NOT EXISTS deals (
  id           TEXT PRIMARY KEY,
  data         JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Markets (one per market research, full object as JSONB)
CREATE TABLE IF NOT EXISTS markets (
  id           TEXT PRIMARY KEY,
  data         JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Property Lists (metadata only, the raw CSV rows are in property_rows)
CREATE TABLE IF NOT EXISTS property_lists (
  id           TEXT PRIMARY KEY,
  data         JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Raw CSV Data (one row per property list, holds entire array of properties)
-- Stored separately because it can be megabytes
-- Cascade delete when property_lists is deleted
CREATE TABLE IF NOT EXISTS property_rows (
  list_id      TEXT PRIMARY KEY REFERENCES property_lists(id) ON DELETE CASCADE,
  rows         JSONB NOT NULL DEFAULT '[]',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Filtered Lists (filtered view of a property list)
CREATE TABLE IF NOT EXISTS filtered_lists (
  id           TEXT PRIMARY KEY,
  data         JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Letters (generated offer letters)
CREATE TABLE IF NOT EXISTS letters (
  id           TEXT PRIMARY KEY,
  data         JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calculations (profit calculations)
CREATE TABLE IF NOT EXISTS calculations (
  id           TEXT PRIMARY KEY,
  data         JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
