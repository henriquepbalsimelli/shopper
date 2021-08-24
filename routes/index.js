var express = require('express');
var router = express.Router();
const {renderizaForm, enviaPedido, renderizaPedidos, cancelaPedido} = require('../controllers/pedidosController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/pedido/', renderizaForm)
router.post('/pedido/', enviaPedido)

router.get('/meusPedidos/:idPedido?', renderizaPedidos)
router.get('/meusPedidos/:idPedido')

router.get('/cancelaPedido/:id', cancelaPedido)
module.exports = router;
