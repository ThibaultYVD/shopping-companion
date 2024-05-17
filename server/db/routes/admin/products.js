const express = require('express')
const router = express.Router()
const db = require('../../model/Models');

router.get('/', [verifyToken, isAdmin], async (req, res) => {
    try {
        const products = await db.Product.findAll();
        res.status(200).json(products);
    } catch (err) {
        console.error('Error dans récupération des produits :', err);
        res.status(500).json({ error: 'Error dans récupération des produits' });
    }
});

router.get('/:productId', [verifyToken, isAdmin], async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.productId)
        if (product === null) {
            res.status(404).json({ error: 'Produit non trouvé.' });
        } else {
            res.status(200).json(product)
        }

    } catch (error) {
        console.error(`Error dans récupération du produit ${req.params.productId} :`, err);
        res.status(500).json({ error: 'Error dans récupération du produit' });
    }
})

router.post('/', [verifyToken, isAdmin], async (req, res) => {
    const { product_name, price, shelf_id } = req.body;

    try {
        const createdProduct = await db.Product.create({
            product_name: product_name,
            price: price,
            shelf_id: shelf_id
        });

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(`Error dans l'insertion du produit :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion du produit." });
    }
})

router.delete('/:productId', [verifyToken, isAdmin], async (req, res) => {
    try {

        const existingProduct = await db.Product.findByPk(req.params.productId)

        if (!existingProduct) {
            return res.status(404).json({ error: 'Produit introuvable' })
        }

        const removeProduct = await db.Product.destroy({
            where: { product_id: req.params.productId }
        })
        res.status(204).json(removeProduct)
    } catch (error) {
        console.error(`Error dans suppression du produit ${req.params.productId} :`, error);
        res.status(500).json({ error: 'Error dans suppression du produit' });
    }
})



module.exports = router