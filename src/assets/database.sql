drop INDEX IF EXISTS "IX_Buying_ProductId";
drop table if exists buying;
drop table if exists product;
drop table if exists product_fts;

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

insert into buying (id, product_id, is_bought, bought_time, quantity, price, unit_price, unit_sale_price) values ('506AF5EF-79D3-FF56-1D89-25D145A05CB4', '506AF5EF-79D3-FF56-1D89-25D145A05CB4', 1, '2021-02-08 18:43:23', 1, 232.32, 2, 3);

INSERT INTO packaging
  SELECT 'PIEZA' WHERE NOT EXISTS(SELECT 1 FROM packaging WHERE package_type = 'PIEZA')
  UNION
  SELECT 'KILO' WHERE NOT EXISTS(SELECT 1 FROM packaging WHERE package_type = 'KILO')
  UNION
  SELECT 'LITRO' WHERE NOT EXISTS(SELECT 1 FROM packaging WHERE package_type = 'LITRO');

INSERT INTO settings
  SELECT 'db.version', 1 WHERE NOT EXISTS(SELECT 1 FROM settings WHERE id = 'db.version');

delete from product;
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("506AF5EF-79D3-FF56-1D89-25D145A05CB4","Lindsay, Laith M.","LITRO",68,"pricetag-outline"),("3203C29C-DB35-0C76-E03D-E1726315459D","Hudson, Genevieve V.","LITRO",100,"water-outline"),("71F2A289-B360-744A-A32D-1CDDCAD29422","Russo, Tallulah L.","KILO",7,"cube-outline"),("9C170B6E-0ECD-67D4-5B65-14FD7AC2BB28","Bonner, Bradley A.","LITRO",81,"water-outline"),("78557146-DC58-0FD6-6A44-4555B7037AD4","Guerra, Brody M.","KILO",67,"cube-outline"),("6CB92AA7-22D5-576C-7A5F-13BB076BDC65","Booth, Odessa W.","KILO",96,"cube-outline"),("6148546A-5272-48C8-90DA-A5C67194C207","Villarreal, Ruby A.","KILO",83,"water-outline"),("754AE51F-874E-80DA-3296-453BCF9A6EE7","Carlson, Cooper A.","PIEZA",80,"water-outline"),("112DF983-0C05-C407-6334-F52935AA9772","Mcmahon, Hayley A.","PIEZA",82,"water-outline"),("CFFA5752-3B09-827B-1120-405FD6B5AD9F","Gaines, Briar O.","LITRO",75,"cube-outline");
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("6ABE9CB0-4102-567C-268C-5E26C84E4F05","Martinez, Kevin U.","KILO",20,"water-outline"),("BEF0C454-A87F-0464-0611-6AE33F3E0F7D","Mack, Hashim R.","LITRO",41,"pricetag-outline"),("5837B7AE-2552-928A-29AE-0D485D098461","Fry, Dexter S.","PIEZA",73,"cube-outline"),("6C975DBC-AFE3-41A0-0EAB-3463341F4316","Lee, Plato A.","KILO",38,"pricetag-outline"),("79D3701E-31C0-139A-8B10-55372C86B92C","Fry, Kasper L.","LITRO",63,"pricetag-outline"),("5A17AED6-C629-0C1C-97BB-24CD5AD64B8F","Stone, Cameron A.","KILO",20,"cube-outline"),("4DE4FD1C-0551-DB7C-00C3-1C1428000742","Bradley, Hamilton P.","LITRO",69,"water-outline"),("C6EB1948-D346-1472-34AD-13F1F2C6BAFF","Chang, Kim N.","KILO",61,"pricetag-outline"),("3161472D-7683-4306-4338-28994093C277","Mercer, Macy F.","LITRO",91,"pricetag-outline"),("8AD89D5B-628E-F349-AF67-6B4BC57F0A72","Ayala, Arthur B.","KILO",13,"cube-outline");
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("CA97F7AF-5691-5B1D-498E-AAE27F407101","Adkins, Logan M.","PIEZA",15,"pricetag-outline"),("08D542BB-2188-5AA4-2EA3-D43130C5FCC7","Mitchell, Hu X.","PIEZA",5,"water-outline"),("E1ADD22D-0C83-ABAE-3367-640F76EEE2A3","Gill, Lareina Q.","KILO",62,"water-outline"),("3875F77B-9E61-5ADF-CB8E-372BD591AA61","Fisher, Nadine M.","LITRO",53,"pricetag-outline"),("C77D355D-3963-862C-F8CE-27F759F3F0D9","Jensen, Channing A.","LITRO",37,"pricetag-outline"),("39018B5C-F9C7-D2EB-5764-19BE33EFE70B","Joyner, Wesley S.","LITRO",92,"pricetag-outline"),("E8EC5B2B-CFD1-5952-73D3-C6FD42AE3D78","Crosby, Burton B.","KILO",93,"pricetag-outline"),("F4146C17-081B-8D04-79FC-1D4E70C9D259","Nicholson, Rhea J.","LITRO",31,"pricetag-outline"),("49BE931B-793C-3BAC-1200-28501FA38DE6","Rodriguez, Tanya M.","KILO",3,"pricetag-outline"),("745FBBCE-8574-554E-3E63-AEF4B84E7B35","Alston, Zachery D.","LITRO",17,"cube-outline");
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("7519EC15-8524-219A-8464-0EC38141F7D5","Curtis, Amy W.","KILO",62,"water-outline"),("11424843-9452-A015-1DD3-79BFE67C8461","Ochoa, Reece I.","KILO",36,"water-outline"),("6CCCCDF5-A563-6573-2541-4B616399E7B1","Holden, Plato Y.","PIEZA",20,"cube-outline"),("F5F2C97E-4098-92B1-57CB-86A6C12380F8","Benson, Cynthia K.","LITRO",37,"water-outline"),("0774FAC6-C26C-E605-9108-D46760F6A69E","Sampson, Breanna Z.","PIEZA",88,"cube-outline"),("E9BABDCE-304C-02AF-DDBE-8BF237A58671","Duke, Nevada W.","LITRO",33,"pricetag-outline"),("F8FC4C64-EAD1-9D9C-C9C0-55F6397B92F1","Gallagher, Asher R.","KILO",2,"water-outline"),("39FFF665-A2AD-8367-44F5-1D6A2DB39818","Crawford, Acton I.","KILO",24,"water-outline"),("41583C57-59DC-FF91-A34C-95C741755E20","Kane, Gage S.","PIEZA",31,"pricetag-outline"),("24381368-FC28-C833-475B-35AEB6942B48","Jackson, Orla J.","PIEZA",92,"pricetag-outline");
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("7233714D-453D-76CA-28EB-E1C191F7D00D","Norris, Stella T.","KILO",60,"pricetag-outline"),("650FBE38-D62A-B971-F49B-76EDCFCCFD39","Hanson, Justine K.","LITRO",45,"cube-outline"),("709F2770-7FE6-19AC-DDA3-0FFAC6A9228C","Adams, Meghan E.","LITRO",94,"pricetag-outline"),("C357318C-3F01-92A9-9A9B-47F5888A6C84","Morales, Wade T.","PIEZA",4,"pricetag-outline"),("78BE040F-4A9C-EADF-2214-130ECCC52725","Wright, Clare Z.","KILO",9,"pricetag-outline"),("1CB32749-1552-49CA-D733-3B6370B02D91","Craig, Duncan O.","LITRO",45,"water-outline"),("790548DC-C3BC-F7CD-B15A-4DBC42DD46E9","Sullivan, Geraldine I.","KILO",99,"cube-outline"),("A54EFD97-2557-D1F1-02E4-EB597B22B34F","Benson, Kirsten G.","KILO",92,"water-outline"),("54E941D9-D953-54A6-D497-8500F53F4D28","Leonard, Clark F.","PIEZA",46,"water-outline"),("1E5F0639-A07F-ABE4-5112-E1B392375419","Mcknight, Quynn N.","PIEZA",27,"water-outline");
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("CDBA0106-FFED-2375-7F21-7BCCC5828526","Jimenez, Eliana T.","PIEZA",30,"cube-outline"),("5B51E0D1-ABF4-A2F1-B591-788BAEECEDC3","Strickland, Ruth I.","LITRO",57,"pricetag-outline"),("4DA1C09D-C651-A6E3-CBEC-B9E2B6860C7E","Ewing, Colorado E.","LITRO",6,"pricetag-outline"),("B4B305BD-2760-B46A-8FEC-E9F7A56046A7","Cole, Christine X.","KILO",41,"pricetag-outline"),("E6F4B025-E5FA-E2A3-D568-C45D5EAC7793","Hayden, Mara O.","PIEZA",34,"water-outline"),("9F42797D-FFED-0E06-52AB-73A83CDF0E9F","Haney, Aaron J.","KILO",40,"pricetag-outline"),("6DDD1792-CC3F-7278-F363-E3B4F50E6E9A","Vance, Carl X.","KILO",19,"cube-outline"),("EEA815AC-D9C8-FE92-08A7-CE3CEDA9F1C3","Jimenez, Armand S.","LITRO",14,"cube-outline"),("2E8A7042-9FF4-685B-00AD-E0B90DE993D0","Sloan, Aaron G.","LITRO",90,"pricetag-outline"),("5E5E1477-FC00-362C-7D72-BC6C02E609E2","Santos, Wynter G.","KILO",64,"cube-outline");
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("6AF2D116-3C06-BB25-05BC-7A9591ABDB94","Booth, Preston H.","KILO",10,"water-outline"),("506DB612-F227-5EBA-43F1-B9D1B9F9012D","Chaney, Anika A.","KILO",47,"pricetag-outline"),("60895496-8BDE-CE8C-5000-210C42945D7C","Lucas, Cain H.","LITRO",7,"water-outline"),("7BD92772-4B59-204A-4EF6-2B9B60C40DD0","Greene, Vincent E.","KILO",66,"water-outline"),("5A40C00A-8CB7-7898-60E4-2830B149339B","Vance, Steven F.","LITRO",52,"cube-outline"),("97977086-40FE-CA8F-87D3-0F0BCBB37A50","Aguilar, Clark I.","PIEZA",2,"cube-outline"),("C9C2F447-8FFC-A0D4-DADC-96DD8D0E2302","Fry, Kevin L.","LITRO",73,"pricetag-outline"),("E33494F1-1964-7AD6-379F-884DEB68D52B","Conway, Laith L.","PIEZA",73,"pricetag-outline"),("1747CA08-971E-9D8E-F710-2CE350B0AC30","Kidd, Mufutau V.","KILO",89,"pricetag-outline"),("F5FB2E99-FD50-F9D6-AF75-DBF3F805CEF8","Herring, Eaton F.","PIEZA",22,"cube-outline");
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("85DEB62D-3C2F-5996-253D-C19BDCB1F462","Petersen, Emma F.","KILO",43,"water-outline"),("360AB04D-06D3-E5FF-1037-61670550F8D7","Conner, Aurora U.","KILO",70,"cube-outline"),("99183ACC-25AD-8BFB-1030-5B7960342F36","Williams, Bevis T.","KILO",82,"water-outline"),("61A524A7-5089-36B9-CF70-F4A28740110F","Mejia, Naida H.","LITRO",76,"pricetag-outline"),("30762F12-1719-F87E-C6AA-6C79E6A14E1F","Solomon, Tatiana D.","PIEZA",34,"cube-outline"),("C985FFFC-2FCD-93C0-BA33-B8D0AD4D7582","House, Harriet V.","LITRO",56,"cube-outline"),("A0125846-83D4-2B3B-5031-F443C6BEF560","Sykes, Brandon N.","LITRO",2,"water-outline"),("D4D794E3-F913-1796-A8C1-87EECF54EE13","Houston, Yasir X.","LITRO",22,"cube-outline"),("AD909771-14F5-E6AB-9B31-0EC130020C0C","Sawyer, Darryl O.","LITRO",32,"water-outline"),("DE4036AC-5FB5-16A4-0AA5-011B42DD8E5E","Serrano, Anthony H.","KILO",15,"water-outline");
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("5606968D-FA4A-BFEB-4B1E-4E88AA68FB86","Ashley, Freya G.","PIEZA",4,"cube-outline"),("22076FC2-117F-A09D-694A-817F47745F64","Foster, Evan M.","KILO",25,"pricetag-outline"),("FD960ADD-BC19-7BA9-7456-F625139DBD48","Dalton, Ifeoma Z.","KILO",57,"water-outline"),("356B070B-8D35-B4AC-DE6B-6BC129DB14B7","Grant, Maile X.","KILO",49,"pricetag-outline"),("C541AC7A-E2E6-AACB-C872-91BFC0A17E9D","Vincent, Evan U.","KILO",50,"cube-outline"),("27708CDE-39BE-A7E0-004F-A3A1B519BB45","Newman, Justina W.","PIEZA",20,"water-outline"),("EF5AE141-3103-5C6C-127F-0ED0215690D0","Villarreal, Ocean P.","PIEZA",67,"cube-outline"),("EFE1A324-7121-5243-224E-C8A5BD5AA9B8","Hahn, Hilda V.","KILO",33,"water-outline"),("EA3F92B2-A04A-05F3-7A99-818F564821AC","Spence, Harper E.","PIEZA",76,"cube-outline"),("4E0E732A-2C78-C3AB-D484-25B30C18DE20","Murphy, Ishmael D.","LITRO",46,"water-outline");
INSERT INTO `product` (`id`,`name`,`package_type`,`content_quantity`,`icon`) VALUES ("CC9A6809-F0D6-F014-CF24-663DCAF32230","Stephenson, Justina D.","KILO",77,"water-outline"),("C205F25D-BBA7-7E1A-F4A9-9397FEB8C429","Hunt, Whoopi Y.","PIEZA",22,"pricetag-outline"),("DBA1D990-9B71-C582-349D-B38D30DA1EDD","Mcmahon, Kalia A.","LITRO",43,"pricetag-outline"),("D777B1E1-7CE3-14A9-B7DA-B1DE1D0F54DB","Webb, Troy Y.","PIEZA",3,"cube-outline"),("D859DC1D-7582-372F-0037-7397E385A90D","Stokes, Thane Z.","LITRO",73,"cube-outline"),("B8BE2D6D-23B0-72E7-F475-D3C05AC48528","Shelton, Heidi C.","KILO",41,"pricetag-outline"),("922CBCD0-3C3D-0552-C1F3-5B06D6C3755A","Gould, Mercedes G.","KILO",41,"water-outline"),("12ED6358-6D6F-A862-C561-64B8C563F2D3","Burns, Todd G.","KILO",69,"water-outline"),("DC359968-BAF8-8430-942E-04896FC66C16","Nelson, Madeline C.","LITRO",64,"cube-outline"),("97746474-87DC-54D4-4D57-FE9F6E5BFB41","Jimenez, Ebony A.","KILO",50,"water-outline");

-- delete from product_fts;
-- insert into product_fts (id, "name", package_type, content_quantity) select id, "name", package_type, content_quantity from product;
-- insert into product_fts(product_fts) values ('integrity-check');
insert into product_fts(product_fts) values ('rebuild');
