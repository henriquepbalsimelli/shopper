const { Op } = require('sequelize');
const models = require('../models');

module.exports.renderizaForm = (async (req, res, next) => {
    const produtos = await models.Produtos.findAll()
    const pedidos = await models.Pedidos.findAll()



    if (pedidos.length < 1) {
        console.log('n tem nenhum pedido')
        await models.Pedidos.create({

            nomeCliente: 'nome',
            dataDeEntrega: '2021-08-23 11:13:36'

        })
    }


    const pedido = await models.Pedidos.findOne({
        limit: 1,
        order: [['id', 'DESC']]
    })

    console.log(pedido)
    res.render('formCadastro', {
        produtos: produtos,
        
        pedido: pedido
    })
})

module.exports.enviaPedido = (async (req, res, next) => {
    const produtos = await models.Produtos.findAll()

    const informacoes = req.body

    await models.Pedidos.create({
        nomeCliente: req.body.nomeCliente,
        dataDeEntrega: req.body.dataDeEntrega
    })


    let produtoId = req.body.produtoId
    let quantidade = req.body.quantidade
    let pedidoId = parseInt(req.body.pedidoId)

    for (var i = 0; i < quantidade.length; i++) {
        models.Pedidos_produtos.create({
            pedidoId: pedidoId,
            produtoId: produtoId[i],
            quantidade: quantidade[i]
        })
    }



    res.redirect('/')

})

module.exports.renderizaPedidos = (async (req, res, next) => {
    const idPedido = req.params.idPedido
    //console.log(idPedido)
    const pedidos = await models.Pedidos.findAll()



    res.render('meusPedidos', {
        pedidos: pedidos,

    })
})

module.exports.cancelaPedido = (async (req, res, next) => {
    const id = req.params.id
    await models.Pedidos.destroy({
        where: {
            id: id
        }
    })
    await models.Pedidos_produtos.destroy({
        where: {
            pedidoId: id
        }
    })
    res.redirect('/')

})

module.exports.alteraPedido = (async (req, res, next) => {

})

module.exports.renderizaItensPedidos = (async (req, res, next) => {
    const idPedido = req.params.idPedido
    const produtos = await models.Pedidos_produtos.findAll({
        where: {
            quantidade: {
                [Op.ne]: 0
            }
        }
    })
    /*const item = await models.Produtos.findAll({
        where:{
            idprodutos
        }
    })*/

    const { idprodutos } = produtos

    console.log(idprodutos.produtoId)
    res.render('itensPedidos', {
        produtos: produtos
    })
})