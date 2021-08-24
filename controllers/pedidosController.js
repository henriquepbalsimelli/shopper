const { Op } = require('sequelize');
const models = require('../models');

module.exports.renderizaForm = (async(req,res,next) =>{
    const produtos = await models.Produtos.findAll()
    const [ultimoPedido, created] = await models.Pedidos.findOrCreate({
        where:{
           nomeCliente: 'create',
           dataDeEntrega: '2021-08-25 00:00:00'
        },
        order:[['id', 'DESC']]
    })
    
    res.render('formCadastro', {
        produtos: produtos,
        pedidos: ultimoPedido
    })
})

module.exports.enviaPedido = (async(req,res,next)=>{
    const produtos = await models.Produtos.findAll()

    const informacoes = req.body
    
    await models.Pedidos.create({
        nomeCliente: req.body.nomeCliente,
        dataDeEntrega: req.body.dataDeEntrega
    })

    
    let produtoId = req.body.produtoId
    let quantidade = req.body.quantidade
    let pedidoId = parseInt(req.body.pedidoId)

    for (var i =0; i< quantidade.length; i++){
        models.Pedidos_produtos.create({
            pedidoId: pedidoId,
            produtoId: produtoId[i],
            quantidade: quantidade[i]
        })
    }
    
    

    
    
})

module.exports.renderizaPedidos = (async(req,res,next)=>{
    const idPedido = req.params.idPedido
    //console.log(idPedido)
    const pedidos = await models.Pedidos.findAll()
    
    res.render('meusPedidos', {
        pedidos: pedidos
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