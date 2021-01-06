CREATE TABLE IF NOT EXISTS product (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  packageType TEXT,
  contentQuantity INTEGER,
  lastBoughtTime TEXT,
  deleted INTEGER
);

CREATE TABLE IF NOT EXISTS buying (
  id TEXT NOT NULL PRIMARY KEY,
  productId TEXT NOT NULL,
  isBought INTEGER NOT NULL,
  boughtTime TEXT NOT NULL,
  quantity INTEGER,
  price REAL,
  CONSTRAINT "FK_Buying_Product_ProductId" FOREIGN KEY ("productId") REFERENCES "product" ("Id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "IX_Buying_ProductId" ON "buying" ("productId");
