const { Router } = require('express');
const { getCajeros, getCajeroById, new_bulk, createCajero, createCajeros, updateCajero, deleteCajero } = require('../controllers/cajeros.controller');

const router = Router();

router.get('/cajeros', getCajeros);
router.get('/cajeros/:id', getCajeroById);
router.post('/cajeros', createCajero);
router.post('/cajeros/bulk', createCajeros);
router.put('/cajeros/:id', updateCajero);
router.delete('/cajeros/:id', deleteCajero);
router.get('/cajeros_new_bulk', new_bulk);

module.exports = router;
