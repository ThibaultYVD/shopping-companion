const express = require('express')
const router = express.Router()
const db = require('../model/index');

router.get('/', async (req, res) => {
    try {
        const supermarkets = await db.Supermarket.findAll();
        res.status(200).json(supermarkets);
    } catch (err) {
        console.error('Error dans récupération des produits :', err);
        res.status(500).json({ error: 'Error dans récupération des produits' });
    }
});

router.get('/:supermarketId', async (req,res)=>{
    try {
        const supermarket = await db.Supermarket.findByPk(req.params.supermarketId)
        if(supermarket === null){
            res.status(404).json({ error: 'Produit non trouvé.' });
        }else{
            res.status(200).json(supermarket)
        }
        
    } catch (error) {
        console.error(`Error dans récupération du produit ${req.params.supermarketId} :`, err);
        res.status(500).json({ error: 'Error dans récupération du produit' });
    }
})

router.post('/', async (req,res)=>{
    const { supermarket_name, address } = req.body;

    try {
        const createdSupermarket = await db.Supermarket.create({
            supermarket_name: supermarket_name,
            address: address
        });

        res.status(201).json(createdSupermarket);
    } catch (error) {
        console.error(`Error dans l'insertion du produit :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion du produit." });
    }
})

router.delete('/:supermarketId', async (req,res)=>{
    try {

        const existingSupermarket = await db.Supermarket.findByPk(req.params.supermarketId)

        if(!existingSupermarket){
            return res.status(404).json({error: 'Produit introuvable'})
        }

        const removeSupermarket = await db.Supermarket.destroy({
            where: { supermarket_id: req.params.supermarketId }
        })
        res.status(204).json(removeSupermarket)
    } catch (error) {
        console.error(`Error dans suppression du produit ${req.params.supermarketId} :`, error);
        res.status(500).json({ error: 'Error dans suppression du produit' });
    }
})

router.patch('/:supermarketId', async (req, res)=>{

    const { supermarket_name, address } = req.body

    try {
        const existingSupermarket = await db.Supermarket.findByPk(req.params.supermarketId)

        if(!existingSupermarket){
            return res.status(404).json({error: 'Produit introuvable'})
        }

        const patchedSupermarket = await db.Supermarket.update
        ({
            supermarket_name: supermarket_name,
            address: address
        },
        {
            where: { supermarket_id: req.params.supermarketId },
        })

        res.status(200).json(patchedSupermarket)
        
    } catch (error) {
        console.error(`Error dans maj du produit ${req.params.supermarketId} :`, error);
        res.status(500).json({ error: 'Error dans maj du produit' });
    }
    
})

module.exports = router