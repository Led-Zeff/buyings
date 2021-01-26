export interface ResultSet {
  insertId?: number;
  rowsAffected: number;

  rows: {
    length: number;
    item(index: number): any;
  }
}
