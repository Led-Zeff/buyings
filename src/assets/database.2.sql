CREATE TABLE IF NOT EXISTS category (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  profit_percentage INTEGER
);

CREATE TABLE IF NOT EXISTS branch (
  name TEXT NOT NULL PRIMARY KEY
);

ALTER TABLE product
  ADD COLUMN category_id INTEGER REFERENCES category(id);

ALTER TABLE buying
  ADD COLUMN branch TEXT;

UPDATE settings SET value = 2 where id = 'db.version';
