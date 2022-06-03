const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class ContabilidadDao extends DaoObject{
  constructor(db = null){
    console.log('ContabilidadDao db: ', db);
    super(db);
  }
  setup(){
    if (process.env.SQLITE_SETUP) {
      const createStatement = 'CREATE TABLE IF NOT EXISTS contabilidad (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, descripction TEXT, fecha TEXT, amount DECIMAL, category TEXT);';
      this.conn.run(createStatement);
    }
  }

  getAll(){
    return this.all(
      'SELECT * from contabilidad;', []
    );
  }

  getById( {codigo} ){
    const sqlstr= 'SELECT * from contabilidad where id=?;';
    const sqlParamArr = [codigo];
    return this.get(sqlstr, sqlParamArr);
  }

  insertOne({type, descripction, amount, category}) {
    const fecha = new Date().toISOString();
    const sqlstr = 'INSERT INTO contabilidad (type, descripction, fecha,  amount, category) values (?, ?, ?, ?, ?);';
    const sqlParamArr = [type, descripction, fecha, amount, category];
    return this.run(sqlstr, sqlParamArr);
  }

  updateOne({codigo, type, descripction, amount, category}){
    const sqlstr= 'UPDATE contabilidad set type = ?, descripction = ?, amount = ?, category = ? where id = ?;';
    const sqlParamArr = [type, descripction, amount, category, codigo];
    return this.run(sqlstr, sqlParamArr);
  }

  deleteOne({ codigo }) {
    const sqlstr = 'DELETE FROM contabilidad where id = ?;';
    const sqlParamArr = [codigo];
    return this.run(sqlstr, sqlParamArr);
  }

}