const DaoObject = require('../../dao/DaoObject');
module.exports = class Contabilidad {
  contabilidadDao = null;

  constructor(contabilidadDao = null) {
    if (!(contabilidadDao instanceof DaoObject)) {
      throw new Error('An Instance of DAO Object is Required');
    }
    this.contabilidadDao = contabilidadDao;
  }
  async init() {
    await this.contabilidadDao.init();
    await this.contabilidadDao.setup();
  }
  async getVersion() {
    return {
      entity: 'Contabilidad',
      version: '1.0.0',
      description: 'CRUD de Contabilidad'
    };
  }

  async addContabilidad({
    type, descripction, amount,category
  }) {
    const result = await this.contabilidadDao.insertOne(
      {
        type, descripction, amount, category
      }
    );
    return {
      type, descripction, amount, category,
      id: result.lastID
    };
  };

  async getContabilidad() {
    return this.contabilidadDao.getAll();
  }

  async getContabilidadById({ codigo }) {
    return this.contabilidadDao.getById({ codigo });
  }

  async updateContabilidad({
    type, descripction, amount, category, codigo
    }) {
    const result = await this.contabilidadDao.updateOne({
      codigo, type, descripction, amount, category });
    return {
      type, descripction, amount, category, codigo,
      modified: result.changes
    }
  }

  async deleteContabilidad({ codigo }) {
    const contabilidadToDelete = await this.contabilidadDao.getById({ codigo });
    const result = await this.contabilidadDao.deleteOne({ codigo });
    return {
      ...contabilidadToDelete,
      deleted: result.changes
    };
  }
}