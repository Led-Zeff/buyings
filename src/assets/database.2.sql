CREATE TABLE IF NOT EXISTS category (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  profit_percentage INTEGER
);

ALTER TABLE product
  ADD COLUMN category_id INTEGER REFERENCES category(id);

UPDATE settings SET value = 2 where id = 'db.version';
