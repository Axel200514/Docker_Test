const {Router} = require('express');
const { getCategorias, getCategoriaById, cnew_bulk, createCategoria, createCategorias, updateCategoria, deleteCategoria } = require('../controllers/categorias.controller');

const router = Router();

router.get('/categorias', getCategorias);
router.get('/categorias/:id', getCategoriaById);
router.post('/categorias', createCategoria);
router.post('/categorias/bulk', createCategorias);
router.put('/categorias/:id', updateCategoria);
router.delete('/categorias/:id', deleteCategoria);
router.get('/categorias_new_bulk', cnew_bulk);
module.exports = router;
