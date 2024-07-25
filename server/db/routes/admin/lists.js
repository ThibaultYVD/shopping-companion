const express = require('express')
const router = express.Router()
const db = require('../../model/Models');
const { verifyToken, isAdmin } = require('../../middleware/authjwt')

router.get('/', [verifyToken, isAdmin], async (req, res) => {
    try {
        const lists = await db.List.findAll();
        res.status(200).json(lists);
    } catch (err) {
        console.error('Error dans récupération des listes :', err);
        res.status(500).json({ error: 'Error dans récupération des listes' });
    }
});

router.get('/:listId', [verifyToken, isAdmin], async (req, res) => {
    try {
        const list = await db.List.findByPk(req.params.listId)
        if (list === null) {
            res.status(404).json({ error: 'Liste non trouvé.' });
        } else {
            res.status(200).json(list)
        }

    } catch (error) {
        console.error(`Error dans récupération de la liste ${req.params.listId} :`, error);
        res.status(500).json({ error: 'Error dans récupération de la liste' });
    }
})

router.post('/', [verifyToken, isAdmin], async (req, res) => {
    const { list_name, group_id, shopping_date } = req.body;

    try {

        const createdList = await db.List.create({
            list_name: list_name,
            group_id: group_id,
            creation_date: new Date(),
            shopping_date: shopping_date
        });

        res.status(201).json(createdList);
    } catch (error) {
        console.error(`Error dans l'insertion de la liste :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion de la liste." });
    }
})

router.delete('/:listId', [verifyToken, isAdmin], async (req, res) => {
    try {
        const existingList = await db.List.findByPk(req.params.listId)

        if (!existingList) {
            return res.status(404).json({ error: 'liste introuvable' })
        }

        const removeList = await db.List.destroy({
            where: { list_id: req.params.listId }
        })
        res.status(204).json(removeList)
    } catch (error) {
        console.error(`Error dans suppression de la liste ${req.params.listId} :`, error);
        res.status(500).json({ error: 'Error dans suppression de la liste' });
    }
})

router.patch('/:listId', [verifyToken, isAdmin], async (req, res) => {

    const { list_name, shopping_date } = req.body

    try {
        const existingList = await db.List.findByPk(req.params.listId)

        if (!existingList) {
            return res.status(404).json({ error: 'liste introuvable' })
        }

        const patchedList = await db.List.update
            ({
                list_name: list_name,
                shopping_date: shopping_date
            },
                {
                    where: { list_id: req.params.listId },
                })

        res.status(200).json(patchedList)

    } catch (error) {
        console.error(`Error dans maj du liste ${req.params.listId} :`, error);
        res.status(500).json({ error: 'Error dans maj de la liste' });
    }

})

module.exports = router