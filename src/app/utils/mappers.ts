import { ResultSet } from "../models/result-set";

export class Mappers {
  static singleColumnMapper<T>(resultSet: ResultSet): T[] {
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

  static objectMapper<T>(resultSet: ResultSet): T[] {
    const items: T[] = [];
    if (resultSet.rows.length > 0) {
      const keys = this.getKeys(resultSet.rows.item(0));
      for (let index = 0; index < resultSet.rows.length; index++) {
        const item = {};
        for (const key of keys) {
          item[key.camelCase] = resultSet.rows.item(index)[key.key];
        }
        items.push(item as T);
      }
    }
    return items;
  }

  static singleRowObjectMapper<T>(resultSet: ResultSet): T {
    if (resultSet.rows.length > 0) {
      const keys = this.getKeys(resultSet.rows.item(0));
      if (keys.length > 1) {
        const item = {};
        for (const key of keys) {
          item[key.camelCase] = resultSet.rows.item(0)[key.key];
        }
        return item as T;
      } else {
        return resultSet.rows.item(0)[0];
      }
    }
  }

  private static getKeys(obj: any) {
    const keys = Object.getOwnPropertyNames(obj || {});
    return keys.map(k => ({ key: k, camelCase: k.replace(/_([A-Z])/gi, (m, l) => l.toUpperCase()) }));
  }
}
