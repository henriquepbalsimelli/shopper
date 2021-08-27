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

    //console.log(informacoes)
    //console.log(informacoes)
    for (let i = 0; i < valores.length; i++) {
        const valorTotal = (parseFloat(req.body.preco[i])) * (parseFloat(req.body.quantidade[i]))
        numberList.push(parseFloat(valorTotal))

    }
    const total = numberList.reduce((total, currentElement) => total + currentElement)
    //console.log(total)

    const quantidadesDeRetorno = await models.Pedidos_produtos.findAll({
        where: {
            pedidoId: id
        }
    })

    await models.Pedidos.update({
        nomeCliente: nomeCliente,
        dataDeEntrega: dataDeEntrega,
        total: total
    }, {
        where: {
            id: id
        }
    })


    for (var i = 0; i < quantidade.length; i++) {
        await models.Pedidos_produtos.update(
            {
                pedidoId: parseInt(id[i]),
                produtoId: parseInt(produtoId[i]),
                quantidade: parseInt(quantidade[i])
            },
            {
                where: {
                    pedidoId: parseInt(id)
                }
            }


        )

        await models.Produtos.increment({
            qty_stock: quantidadesDeRetorno[i].quantidade
        }, {
            where: {
                id: produtoId[i]
            }
        })


        await models.Produtos.decrement({
            qty_stock: quantidade[i]
        }, {
            where: {
                id: produtoId[i]

            }
        })

    }

    //const pedidosProdutos = models.Pedidos_produtos




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

    const id = parseInt(req.params.id)
    const idItem = parseInt(req.params.idItem)
    console.log(id,idItem)

    const quantidadeItem = await models.Pedidos_produtos.findOne({
        where:
        {
            produtoId: idItem,
            pedidoId: id
        }
    })

    await models.Produtos.increment({
        qty_stock: quantidadeItem.quantidade
    }, {
        where: {
            
            id: idItem
        }
    })

    await models.Pedidos_produtos.update({
        quantidade: 0
    },
        {
            where: {
                produtoId: idItem
            }
        }

    )


    const infos = await models.Pedidos_produtos.findAll({
        where: {
            pedidoId: id,

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

    
    console.log(quantidadeItem)
    const valores = await models.Produtos.findAll({})
    const quantidades = []
    const precos = []
    const numberList = []

    for (let i = 0; i < infos.length; i++) {

        quantidades.push(infos[i].quantidade)
        precos.push(valores[i].price)
        numberList.push(valores[i].price * infos[i].quantidade)
    }
    const total = numberList.reduce((total, currentElement) => total + currentElement)



    await models.Pedidos.update({
        total: total
    },
        {
            where: {
                id: id
            }
        }
    )

    res.redirect('/meusPedidos')
})