import * as moment from "moment";

export class SqlUtils {

  static generateInsert<T>(entity: T, tableName: string, generatedIdField?: string): {query: string, params: any[]} {
    const keys = this.getKeys(entity);
    const columns = keys.filter(k => k.key !== generatedIdField).map(k => k.column).join(',');
    const params = keys.filter(k => k.key !== generatedIdField).map(k => k.value);
    const query = `insert into ${tableName} (${columns}) values (${params.map(() => '?').join(',')})`;
    return { query, params };
  }

  static generateUpdate<T>(entity: T, tableName: string, idColumn: string): {query: string, params: any[]} {
    const keys = this.getKeys(entity);
    const id = keys.find(k => k.column === `"${idColumn}"`);
    const query = `update ${tableName} set ${keys.filter(k => k.column !== idColumn).map(k => k.column + " = ?").join(', ')} where ${idColumn} = ?`;
    const params = keys.filter(k => k.column !== idColumn).map(k => k.value).concat(id.value);
    return { query, params };
  }

  static buildTokens(filter: string) {
    return '\'' + (filter || '').trim().replace(/([^\w ])/g, '').toLocaleLowerCase().split(' ').filter(w => w).map(w => w + '*').join(' AND ') + '\'';
  }

  static dateFormat = 'YYYY-MM-DD HH:mm:ss';

  static now() {
    return moment().format(this.dateFormat);
  }

  private static getKeys(obj: any) {
    const keys = Object.getOwnPropertyNames(obj);
    const result: {key: string, column: string, value: any}[] = [];
    for (const key of keys) {
      result.push({ key, column: '"' + key.replace(/([A-Z])/g, '_$1').toLowerCase() + '"', value: obj[key] });
    }
    return result;
  }

}
