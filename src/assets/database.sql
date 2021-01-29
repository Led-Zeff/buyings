CREATE TABLE IF NOT EXISTS product (
  id TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  package_type TEXT,
  content_quantity INTEGER NOT NULL,
  last_bought_time TEXT,
  sale_price REAL,
  last_time_updated TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted INTEGER NOT NULL DEFAULT 0
);
delete from product;

CREATE TABLE IF NOT EXISTS buying (
  id TEXT NOT NULL PRIMARY KEY,
  product_id TEXT NOT NULL,
  is_bought INTEGER NOT NULL,
  bought_time TEXT NOT NULL,
  quantity INTEGER,
  price REAL,
  FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS packaging (
  package_type TEXT NOT NULL PRIMARY KEY
);

CREATE INDEX IF NOT EXISTS "IX_Buying_ProductId" ON "buying" ("product_id");

INSERT INTO packaging
  SELECT 'PIEZA' WHERE NOT EXISTS(SELECT 1 FROM packaging WHERE package_type = 'PIEZA')
  UNION
  SELECT 'KILO' WHERE NOT EXISTS(SELECT 1 FROM packaging WHERE package_type = 'KILO')
  UNION
  SELECT 'LITRO' WHERE NOT EXISTS(SELECT 1 FROM packaging WHERE package_type = 'LITRO');
