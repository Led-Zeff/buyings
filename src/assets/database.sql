CREATE TABLE IF NOT EXISTS product (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  packageType TEXT,
  contentQuantity INTEGER,
  lastBoughtTime TEXT
);

CREATE TABLE IF NOT EXISTS buying (
  id TEXT NOT NULL PRIMARY KEY,
  productId TEXT NOT NULL,
  isBought INTEGER NOT NULL,
  boughtTime TEXT NOT NULL,
  quantity INTEGER,
  price REAL
);