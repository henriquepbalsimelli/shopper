var express = require('express');
var router = express.Router();
const {renderizaForm, enviaPedido, renderizaPedidos} = require('../controllers/criacaoController')
const {cancelaItem, cancelaPedido} = require('../controllers/cancelamentoController')
const {renderizaItensPedidos, enviaFormAtualizacao, renderizaFormAlteracao} = require('../controllers/alteracaoController')



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shopper' });
});



router.get('/pedido/', renderizaForm)

router.post('/pedido/', enviaPedido)
router.get('/meusPedidos/', renderizaPedidos)

router.get('/meusPedidos/:idPedido/itens', renderizaItensPedidos)
router.get('/cancelaItem/:id/:idItem', cancelaItem)

router.get('/cancelaPedido/:id', cancelaPedido)

router.get('/alterarPedido/:id', renderizaFormAlteracao)
router.post('/alteraFormAtu/:id', enviaFormAtualizacao)

module.exports = router;
