const { name } = require('ejs');
const { Op } = require('sequelize');
const models = require('../models');


module.exports.cancelaItem = (async (req, res, next) => {

    const id = parseInt(req.params.id)
    const idItem = parseInt(req.params.idItem)
    

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

module.exports.cancelaPedido = (async (req, res, next) => {
    const id = req.params.id
    const pedidosProdutos = await models.Pedidos_produtos.findAll()

    for( let i = 0; i < pedidosProdutos.length; i++){
        await models.Produtos.increment({
            qty_stock: pedidosProdutos[i].quantidade
        },{
            where:{
                id: pedidosProdutos[i].produtoId
            }
        })
    }

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