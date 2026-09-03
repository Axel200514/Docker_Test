const { Router } = require('express');
const { realizarVenta, getVentas } = require('../controllers/venta.controller');

const router = Router();

router.get('/ventas', getVentas);
router.post('/ventas', realizarVenta);

module.exports = router;
