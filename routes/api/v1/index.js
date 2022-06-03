const express = require('express');
const router = express.Router();

const categoriesRoutes = require('./categorias');
const usuariosRoutes = require('./usuarios');
const contabilidadRoutes = require('./contabilidad');

router.use('/categories', categoriesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/contabilidad', contabilidadRoutes);

module.exports = router;