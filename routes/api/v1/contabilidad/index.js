const express = require('express');
const router = express.Router();
const Contabilidad = require('../../../../libs/contabilidad');
const ContabilidadDao = require('../../../../dao/models/ContabilidadDao');
const contaDao = new ContabilidadDao();
const conta = new Contabilidad(contaDao);
conta.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await conta.getVersion();
    return res.status(200).json(versionData);
  } catch (ex) {
    // manejar el error que pueda tirar el controlador
    console.error('Error Contabilidad', ex);
    return res.status(502).json({ 'error': 'Error Interno de Server' });
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const usuarios = await conta.getContabilidad();
    return res.status(200).json(usuarios);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
});

router.get('/byid/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({
        error: 'Se espera un codigo numérico'
      });
    }
    const registro = await conta.getContabilidadById({ codigo: parseInt(codigo) });
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
});

router.post('/new', async (req, res) => {
  try {
    const { type = '',
    descripction = '',
      amount = '',
      category = '' } = req.body;

    if (!(/^(INCOME)|(EXPENSES)$/.test(type))) {
      return res.status(400).json({
        error: 'Se espera valor de type INCOME o EXPENSES'
      });
    }

    if (/^\s*$/.test(descripction)) {
      return res.status(400).json({
        error: 'Se espera valor de la descripcion'
      });
    }
    if (/^[0-9]+([.])?([0-9]+)?$/.test(amount)) {
      return res.status(400).json({
        error: 'Se espera valor del monto'
      });
    }
    if (/^\s*$/.test(category)) {
      return res.status(400).json({
        error: 'Se espera valor de la categoria'
      });
    }

    const newContabilidad = await conta.addContabilidad({
      type,
      descripction,
      amount,
      category
    });
    return res.status(200).json(newContabilidad);
  } catch (ex) {
    console.error(ex);
    return res.status(502).json({ error: 'Error al procesar solicitud' });
  }
});

router.put('/update/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }
    const { type, descripction, amount, category } = req.body;
    
    if (!(/^(INCOME)|(EXPENSES)$/.test(type))) {
        return res.status(400).json({
          error: 'Se espera valor de type INCOME o EXPENSES'
        });
      }
  
      if (/^\s*$/.test(descripction)) {
        return res.status(400).json({
          error: 'Se espera valor de la descripcion'
        });
      }
      if (/^[0-9]+([.])?([0-9]+)?$/.test(amount)) {
        return res.status(400).json({
          error: 'Se espera valor del monto'
        });
      }
      if (/^\s*$/.test(category)) {
        return res.status(400).json({
          error: 'Se espera valor de la categoria'
        });
      }

    const updateResult = await conta.updateContabilidad({ codigo: parseInt(codigo), type, descripction, amount, category  });

    if (!updateResult) {
      return res.status(404).json({ error: 'Contabilidad no encontrada.' });
    }
    return res.status(200).json({ updateContabilidad: updateResult });

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});


router.delete('/delete/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }

    const deletedContabilidad = await conta.deleteContabilidad({ codigo: parseInt(codigo) });

    if (!deletedContabilidad) {
      return res.status(404).json({ error: 'Contabilidad no encontrada.' });
    }
    return res.status(200).json({ deletedContabilidad });

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;