const express = require('express')
const router = express.Router()
const db = require('../../model/Models');
const { verifyToken, isAdmin } = require('../../middleware/authjwt')

router.get('/', [verifyToken, isAdmin], async (req, res) => {
    try {
        const shelves = await db.Shelf.findAll();
        res.status(200).json(shelves);
    } catch (err) {
        console.error('Error dans récupération des rayons :', err);
        res.status(500).json({ error: 'Error dans récupération des rayons' });
    }
});

router.get('/:shelfId', [verifyToken, isAdmin], async (req, res) => {
    try {
        const shelf = await db.Shelf.findByPk(req.params.shelfId)
        if (shelf === null) {
            res.status(404).json({ error: 'Rayon non trouvé.' });
        } else {
            res.status(200).json(shelf)
        }

    } catch (error) {
        console.error(`Error dans récupération du rayon ${req.params.shelfId} :`, err);
        res.status(500).json({ error: 'Error dans récupération du rayon' });
    }
})

router.post('/', [verifyToken, isAdmin], async (req, res) => {
    const { shelf_name, location_x, location_y, supermarket_id } = req.body;

    try {
        const createdShelf = await db.Shelf.create({
            shelf_name: shelf_name,
            location_x: location_x,
            location_y: location_y,
            supermarket_id: supermarket_id
        });

        res.status(201).json(createdShelf);
    } catch (error) {
        console.error(`Error dans l'insertion du rayon :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion du rayon." });
    }
})

router.delete('/:shelfId', [verifyToken, isAdmin], async (req, res) => {
    try {

        const existingShelf = await db.Shelf.findByPk(req.params.shelfId)

        if (!existingShelf) {
            return res.status(404).json({ error: 'Rayon introuvable' })
        }

        const removeShelf = await db.Shelf.destroy({
            where: { shelf_id: req.params.shelfId }
        })
        res.status(204).json(removeShelf)
    } catch (error) {
        console.error(`Error dans suppression du rayon ${req.params.shelfId} :`, error);
        res.status(500).json({ error: 'Error dans suppression du rayon' });
    }
})

router.patch('/:shelfId', [verifyToken, isAdmin], async (req, res) => {

    const { shelf_name, location_x, location_y, } = req.body

    try {
        const existingShelf = await db.Shelf.findByPk(req.params.shelfId)

        if (!existingShelf) {
            return res.status(404).json({ error: 'Payon introuvable' })
        }

        const patchedShelf = await db.Shelf.update
            ({
                shelf_name: shelf_name,
                location_x: location_x,
                location_y: location_y
            },
                {
                    where: { shelf_id: req.params.shelfId },
                })

        res.status(200).json(patchedShelf)

    } catch (error) {
        console.error(`Error dans maj du rayon ${req.params.shelfId} :`, error);
        res.status(500).json({ error: 'Error dans maj du rayon' });
    }

})

module.exports = router