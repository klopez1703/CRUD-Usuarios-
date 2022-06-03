const DaoObject = require('../../dao/DaoObject');
module.exports = class Category {
  categoryDao = null;
  categoriasMemStore = [];
  categoriasCurrentKey = 0;

  constructor ( categoryDao = null) {
    if (!(categoryDao instanceof DaoObject)) {
     throw new Error('An Instance of DAO Object is Required');
    }
    this.categoryDao = categoryDao;
  }
  async init(){
    await this.categoryDao.init();
    await this.categoryDao.setup();
  }
  async getCategoryVersion () {
    return {
      entity: 'Categories',
      version: '1.0.0',
      description: 'CRUD de Categorías'
    };
  }

  async addCategory ({
    categoria = 'NuevaCategoria',
    estado = 'ACT'
  }) {
    const result =  await this.categoryDao.insertOne(
      {
        categoria,
        estado
      }
    );
    return {
      categoria, estado, id: result.lastID
    };
  };

  async getCategories () {
    return this.categoryDao.getAll();
  }

  async getCategoryById ({ codigo }) {
    return this.categoryDao.getById({codigo});
  }

  async updateCategory ({ codigo, categoria, estado }) {
    const result = await this.categoryDao.updateOne({ codigo, categoria, estado });
    return {
      id: codigo,
      category: categoria,
      status: estado,
      modified: result.changes
    }
  }

  async deleteCategory({ codigo }) {
    const cateToDelete = await this.categoryDao.getById({codigo});
    const result = await this.categoryDao.deleteOne({ codigo });
    return {
      ...cateToDelete,
      deleted: result.changes
    };
  }
}
