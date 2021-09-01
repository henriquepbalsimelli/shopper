const { name } = require('ejs');
const { Op } = require('sequelize');
const models = require('../models');


module.exports.renderizaForm = (async (req, res, next) => {
    const produtos = await models.Produtos.findAll()
    const pedidos = await models.Pedidos.findAll()


    const pedido = await models.Pedidos.findOne({
        limit: 1,
        order: [['id', 'DESC']]
    })


    res.render('formCadastro', {
        produtos: produtos,
        pedidos: pedidos,
        pedido: pedido
    })
})

module.exports.enviaPedido = (async (req, res, next) => {
    const produtos = await models.Produtos.findAll()
    const informacoes = req.body
    const valores = req.body.preco
    const numberList = []

    for (let i = 0; i < valores.length; i++) {
        const valorTotal = (parseFloat(req.body.preco[i])) * (parseFloat(req.body.quantidade[i]))
        numberList.push(parseFloat(valorTotal))

    }
    const total = numberList.reduce((total, currentElement) => total + currentElement)
    console.log(total)
    await models.Pedidos.create({
        nomeCliente: req.body.nomeCliente,
        dataDeEntrega: req.body.dataDeEntrega,
        total: total
    })


    let produtoId = req.body.produtoId
    let quantidade = req.body.quantidade
    


    const nmrPedido = await models.Pedidos.findOne({
        limit:1,
        order: [['id', 'DESC']]
    })
    


    for (var i = 0; i < quantidade.length; i++) {
        models.Pedidos_produtos.create({
            pedidoId: nmrPedido.id,
            produtoId: produtoId[i],
            quantidade: quantidade[i]
        })

        models.Produtos.decrement({
            qty_stock: quantidade[i]
        }, {
            where: {
                id: produtoId[i]

            }
        })

    }




    res.redirect('/')

})

module.exports.renderizaPedidos = (async (req, res, next) => {
    const idPedido = req.params.idPedido
    //console.log(idPedido)
    const pedidos = await models.Pedidos.findAll({})



    res.render('meusPedidos', {
        pedidos: pedidos,

    })
})




