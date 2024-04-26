const express = require('express')
const router = express.Router()
const db = require('../model/index');

router.get('/', async (req, res) => {
    try {
        const products = await db.Product.findAll();
        res.json(products);
    } catch (err) {
        console.error('Error dans récupération des produits :', err);
        res.status(500).json({ error: 'Error dans récupération des produits' });
    }
});

router.get('/:productId', async (req,res)=>{
    try {
        const product = await db.Product.findByPk(req.params.productId)
        if(product === null){
            res.status(404).json({ error: 'Produit non trouvé.' });
        }else{
            res.json(product)
        }
        
    } catch (error) {
        console.error(`Error dans récupération du produit ${req.params.productId} :`, err);
        res.status(500).json({ error: 'Error dans récupération des produits' });
    }
})

router.post('/', async (req,res)=>{
    const { product_name, price, shelf_id } = req.body;

    try {
        const createdProduct = await db.Product.create({
            product_name: product_name,
            price: price,
            shelf_id: shelf_id
        });

        res.json(createdProduct);
    } catch (error) {
        console.error(`Error dans l'insertion du produit :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion du produit." });
    }
})

router.delete('/:productId', async (req,res)=>{
    try {
        const removeProduct = await db.Product.destroy({
            where: { product_id: req.params.productId }
        })
        res.json(removeProduct)
    } catch (error) {
        console.error(`Error dans suppression du produit ${req.params.productId} :`, error);
        res.status(500).json({ error: 'Error dans suppression du produit' });
    }
})

router.patch('/:productId', async (req, res)=>{

    const { product_name, price, shelf_id } = req.body

    try {
        const existingProduct = await db.Product.findByPk(req.params.productId)

        if(!existingProduct){
            return res.status(404).json({error: 'Produit introuvable'})
        }

        const patchedProduct = await db.Product.update
        ({
            product_name: product_name,
            price: price,
            shelf_id: shelf_id
        },
        {
            where: { product_id: req.params.productId },
        })

        res.json(patchedProduct)
        
    } catch (error) {
        console.error(`Error dans maj du produit ${req.params.productId} :`, error);
        res.status(500).json({ error: 'Error dans maj du produit' });
    }
    
})

module.exports = router