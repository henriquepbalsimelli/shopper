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
    let pedidoId = parseInt(req.body.pedidoId)

    for (var i = 0; i < quantidade.length; i++) {
        models.Pedidos_produtos.create({
            pedidoId: pedidoId,
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

    //const pedidosProdutos = models.Pedidos_produtos

    /*pedidosProdutos.afterCreate('debitaQuantidadeEstoque', async pedidosProdutos => {
        models.Produtos.decrement({

        }, {

        })
    })*/


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

module.exports.renderizaFormAlteracao = (async (req, res, next) => {
    const pedidoId = req.params.id
    const infos = await models.Pedidos_produtos.findOne({
        where: {
            pedidoId: pedidoId
        },
        include: [{
            association: 'produto',
            trough: {
                attributes: []
            },
        }, {
            association: 'pedido',
            trough: {
                attributes: []
            },
        }]
    })

    
    const infosItens = await models.Pedidos_produtos.findAll({
        where: {
            pedidoId: pedidoId
        },
        include: [{
            association: 'produto',
            trough: {
                attributes: []
            },
        }, {
            association: 'pedido',
            trough: {
                attributes: []
            },
        }]
    })

    

    res.render('formAlteracao', {

        infos: infos,
        infosItens: infosItens
    })
})

module.exports.enviaFormAtualizacao = (async (req, res, nex) => {
    const produtos = await models.Produtos.findAll()
    const informacoes = req.body
    const valores = req.body.preco
    const numberList = []
    const id = req.params.id
    const nomeCliente = req.body.nomeCliente
    const dataDeEntrega = req.body.dataDeEntrega
    const produtoId = req.body.produtoId
    const quantidade = req.body.quantidade
    

    for (let i = 0; i < valores.length; i++) {
        const valorTotal = (parseFloat(req.body.preco[i])) * (parseFloat(req.body.quantidade[i]))
        numberList.push(parseFloat(valorTotal))

    }
    const total = numberList.reduce((total, currentElement) => total + currentElement)
    console.log(total)
    

    
    await models.Pedidos.create({
        nomeCliente: nomeCliente,
        dataDeEntrega: dataDeEntrega,
        total: total
    }, {
        where: {
            id: id
        }
    })


    
    
   

    for (var i = 0; i < quantidade.length; i++) {
         await models.Pedidos_produtos.create(
            {
                pedidoId:id,
                produtoId: produtoId[i],
                quantidade: quantidade[i]
            },
            {
                where: {
                    pedidoId: id
                }
            }


        )

        models.Produtos.decrement({
            qty_stock: quantidade[i]
        }, {
            where: {
                id: produtoId[i]

            }
        })

    }

    //const pedidosProdutos = models.Pedidos_produtos

    /*pedidosProdutos.afterCreate('debitaQuantidadeEstoque', async pedidosProdutos => {
        models.Produtos.decrement({

        }, {

        })
    })*/


    res.redirect('/')

})


module.exports.renderizaItensPedidos = (async (req, res, next) => {
    const idPedido = req.params.idPedido

    const produtos = await models.Pedidos_produtos.findAll({
        where: {
            pedidoId: idPedido,
            quantidade: {
                [Op.ne]: 0
            },

        },
        include: [
            {
                association: 'produto',
                trough: {
                    attributes: []
                }
            }
        ]
    })

    res.render('itensPedidos', {
        produtos: produtos
    })
})

module.exports.cancelaItem = (async (req, res, next) => {
    console.log('cancelou')
    const id = req.params.id
    const idItem = req.params.idItem
    console.log(id)
    console.log(idItem)
    //console.log(idItem)
    /*await models.Pedidos_produtos.destroy({
        where: {
            pedidoId: id,
            produtoId: idItem
        }
        ///meusPedidos/:idPedido/cancelaItem/:produtoId
    })*/

    const infos = await models.Pedidos_produtos.findAll({
        where:{
            pedidoId: id,
            quantidade:{[Op.ne]:0}
        }
    })

    const idProdutos = infos
    console.log(idProdutos)
    
    //console.log(valores)

    res.redirect('/meusPedidos')
})