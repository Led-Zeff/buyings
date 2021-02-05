export class SqlUtils {

  static generateInsert<T>(entity: T, tableName: string): {query: string, params: any[]} {
    const keys = this.getKeys(entity);
    const query = `insert into ${tableName} (${keys.map(k => k.column).join(',')}) values (${keys.map(() => '?').join(',')})`;
    return { query, params: keys.map(k => k.value) };
  }

  static generateUpdate<T>(entity: T, tableName: string, idColumn: string): {query: string, params: any[]} {
    const keys = this.getKeys(entity);
    const id = keys.find(k => k.column === `"${idColumn}"`);
    console.log(id)
    console.log(keys)
    const query = `update ${tableName} set ${keys.filter(k => k.column !== idColumn).map(k => k.column + " = ?").join(', ')} where ${idColumn} = ?`;
    const params = keys.filter(k => k.column !== idColumn).map(k => k.value).concat(id.value);
    return { query, params };
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
