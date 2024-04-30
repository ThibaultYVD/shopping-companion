const express = require('express')
const router = express.Router()
const db = require('../model/Models');
const jwt = require("jsonwebtoken");

router.get('/', async (req, res) => {
    try {
        const groups = await db.Group.findAll();
        res.status(200).json(groups);
    } catch (err) {
        console.error('Error dans récupération des groupes :', err);
        res.status(500).json({ error: 'Error dans récupération des groupes' });
    }
});

router.get('/userGroups', async (req, res) => {
    try {

        const token = req.session.token

        if (!token) {
            return res.status(401).json({ error: 'Token d\'accès manquant' });
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id


        const user = await db.User.findOne({
            where: { user_id: tokenUser_id },
            include: [{
                model: db.Group,
                through: { attributes: [] }, // Pour exclure les attributs de la table de jointure
            }]
        });
        res.status(200).json(user.groupes)

    } catch (error) {
        console.error(`Error dans récupération des groupes`, error);
        res.status(500).json({ error: 'Error dans récupération des groupes' });
    }
})

router.get('/userGroup/:groupId', async (req, res) => {
    try {

        const token = req.session.token

        if (!token) {
            return res.status(401).json({ error: 'Token d\'accès manquant' });
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        const userGroup = await db.sequelize.query(`SELECT DISTINCT g.* FROM groupes g INNER JOIN group_members m ON m.user_id = ${tokenUser_id} WHERE g.group_id = ${req.params.groupId}`, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (!userGroup) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à accéder à ce groupe' });
        }

        res.status(200).json(userGroup)
    } catch (error) {
        console.error(`Error dans récupération du groupe ${req.params.groupId} :`, error);
        res.status(500).json({ error: 'Error dans récupération du groupe' });
    }
})



router.get('/:groupId', async (req, res) => {
    try {
        const group = await db.Group.findByPk(req.params.groupId)
        if (group === null) {
            res.status(404).json({ error: 'Group non trouvé.' });
        } else {
            res.status(200).json(group)
        }

    } catch (error) {
        console.error(`Error dans récupération du groupe ${req.params.groupId} :`, err);
        res.status(500).json({ error: 'Error dans récupération du groupe' });
    }
})

router.post('/', async (req, res) => {
    const { group_name, creator_id } = req.body;

    try {
        const createdGroup = await db.Group.create({
            group_name: group_name,
            creation_date: new Date(),
            creator_id: creator_id
        });

        res.status(201).json(createdGroup);
    } catch (error) {
        console.error(`Error dans l'insertion du groupe :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion du groupe." });
    }
})

router.delete('/:groupId', async (req, res) => {
    try {
        const existingGroup = await db.Group.findByPk(req.params.groupId)

        if (!existingGroup) {
            return res.status(404).json({ error: 'Groupe introuvable' })
        }

        const removeGroup = await db.Group.destroy({
            where: { group_id: req.params.groupId }
        })
        res.status(204).json(removeGroup)
    } catch (error) {
        console.error(`Error dans suppression du groupe ${req.params.groupId} :`, error);
        res.status(500).json({ error: 'Error dans suppression du groupe' });
    }
})

router.patch('/:groupId', async (req, res) => {

    const { group_name, creator_id } = req.body

    try {
        const existingGroup = await db.Group.findByPk(req.params.groupId)

        if (!existingGroup) {
            return res.status(404).json({ error: 'Groupe introuvable' })
        }

        const patchedGroup = await db.Group.update
            ({
                group_name: group_name,
                creator_id: creator_id
            },
                {
                    where: { group_id: req.params.groupId },
                })

        res.status(200).json(patchedGroup)

    } catch (error) {
        console.error(`Error dans maj du groupe ${req.params.groupId} :`, error);
        res.status(500).json({ error: 'Error dans maj du groupe' });
    }

})

module.exports = router