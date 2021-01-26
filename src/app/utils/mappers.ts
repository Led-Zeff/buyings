import { ResultSet } from "../models/result-set";

export class Mappers {
  static singleRowMapper<T>(resultSet: ResultSet): T[] {
    const items: T[] = [];
    if (resultSet.rows.length > 0) {
      for (let index = 0; index < resultSet.rows.length; index++) {
        const element = resultSet.rows.item(index);
        const keys = Object.getOwnPropertyNames(element);

        if (keys.length > 1) throw new Error('More than one column in result set');
        
        items.push(element[keys[0]]);
      }
    }
    return items;
  }
}
