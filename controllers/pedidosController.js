const models = require('../models');

module.exports.renderizaForm = (async(req,res,next) =>{
    const produtos = await models.Produtos.findAll()
    const ultimoPedido = await models.Pedidos.findOne({
        where:{},
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