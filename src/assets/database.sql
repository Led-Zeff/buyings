CREATE TABLE IF NOT EXISTS product (
  id TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  package_type TEXT,
  content_quantity INTEGER NOT NULL,
  last_bought_time TEXT,
  sale_price REAL,
  last_time_updated TEXT DEFAULT CURRENT_TIMESTAMP,
  icon TEXT,
  deleted INTEGER NOT NULL DEFAULT 0
);

CREATE VIRTUAL TABLE IF NOT EXISTS product_fts USING fts5(
  id unindexed,
  "name",
  package_type,
  content_quantity,
  content = 'product'
);

CREATE TABLE IF NOT EXISTS buying (
  id TEXT NOT NULL PRIMARY KEY,
  product_id TEXT NOT NULL,
  is_bought INTEGER NOT NULL DEFAULT 0,
  bought_time TEXT,
  quantity INTEGER,
  price REAL,
  unit_price REAL,
  unit_sale_price REAL,
  last_time_updated TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS packaging (
  package_type TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT NOT NULL PRIMARY KEY,
  "value" TEXT
);

CREATE INDEX IF NOT EXISTS "IX_Buying_ProductId" ON "buying" ("product_id");

INSERT OR REPLACE INTO packaging(`package_type`) VALUES ('KILO');
INSERT OR REPLACE INTO packaging(`package_type`) VALUES ('LITRO');
INSERT OR REPLACE INTO packaging(`package_type`) VALUES ('PIEZA');

INSERT INTO settings
  SELECT 'db.version', 1 WHERE NOT EXISTS(SELECT 1 FROM settings WHERE id = 'db.version');

INSERT INTO product_fts(product_fts) VALUES ('rebuild');
