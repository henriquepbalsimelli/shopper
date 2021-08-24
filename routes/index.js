var express = require('express');
var router = express.Router();
const {renderizaForm, enviaPedido} = require('../controllers/pedidosController')

/* GET home page. */
router.get('/:id', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/pedido/:id', renderizaForm)
router.post('/pedido/:id', enviaPedido)

module.exports = router;
