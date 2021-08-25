var express = require('express');
var router = express.Router();
const {
  renderizaForm, 
  enviaPedido, 
  renderizaPedidos, 
  cancelaPedido, 
  alteraPedido,
  renderizaItensPedidos,
  cancelaItem} = require('../controllers/pedidosController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shopper' });
});



router.get('/pedido/', renderizaForm)

router.post('/pedido/', enviaPedido)
router.get('/meusPedidos/', renderizaPedidos)

router.get('/meusPedidos/:idPedido/itens', renderizaItensPedidos)
router.get('/cancelaItem/:id/:idItem', cancelaItem)

router.get('/cancelaPedido/:id/:idProduto', cancelaPedido)

router.get('/alterarPedido/:id', alteraPedido)

module.exports = router;
