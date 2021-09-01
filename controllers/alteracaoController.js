const { name } = require('ejs');
const { Op } = require('sequelize');
const models = require('../models');


module.exports.renderizaFormAlteracao = (async (req, res, next) => {
    const pedidoId = req.params.id
    

    const produtos = await models.Produtos.findAll({})

    const pedido = await models.Pedidos.findOne({
        where: {
            id: pedidoId
        }
    })

    const infosItens = await models.Pedidos_produtos.findAll({
        where: {
            pedidoId: pedidoId
        }
    })

    

    res.render('formAlteracao', {
        infosItens: infosItens,
        produtos:produtos,
        pedido: pedido
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

    const quantidadesDeRetorno = await models.Pedidos_produtos.findAll({
        where: {
            pedidoId: id
        }
    })
    
    for (let i = 0; i < valores.length; i++) {
        const valorTotal = (parseFloat(req.body.preco[i])) * (parseFloat(req.body.quantidade[i]))
        numberList.push(parseFloat(valorTotal))

    }
    const total = numberList.reduce((total, currentElement) => total + currentElement)

    console.log(informacoes)

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
                pedidoId: id,
                produtoId: produtoId[i],
                quantidade: quantidade[i]
            },
            {
                where: {
                    produtoId: parseInt(produtoId[i]),
                    pedidoId: id
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