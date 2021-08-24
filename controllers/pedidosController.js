const models = require('../models');

module.exports.renderizaForm = (async(req,res,next) =>{
    const produtos = await models.Produtos.findAll()
    
    res.render('formCadastro', {
        produtos: produtos
    })
})

module.exports.enviaPedido = (async(req,res,next)=>{
    const produtos = await models.Produtos.findAll()
    const informacoes = req.body

    await models.Pedidos.create({
        nomeCliente: req.body.nomeCliente,
        dataDeEntrega: req.body.dataDeEntrega
    })

    let pedidoId = await models.Pedidos.findAll({
        where: {
            id: req.params.id
        }
    })
    let produtoId = req.body.produtoId
    let quantidade = req.body.quantidade
    
    for (var i =0; i< quantidade.length; i++){
        models.Pedidos_produtos.create({
            pedidoId: req.params.id,
            produtoId: produtoId[i],
            quantidade: quantidade[i]
        })
    }
    
    

    
    
})