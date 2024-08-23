const express = require('express')
const router = express.Router()
const db = require('../../model/Models');
const { verifyToken, isAdmin } = require('../../security/authjwt')

router.get('/', [verifyToken, isAdmin], async (req, res) => {
    try {
        const roles = await db.Role.findAll();
        res.status(200).json(roles);
    } catch (err) {
        console.error('Error dans récupération des roles :', err);
        res.status(500).json({ error: 'Error dans récupération des roles' });
    }
});

router.get('/:roleId', [verifyToken, isAdmin], async (req, res) => {
    try {
        const role = await db.Role.findByPk(req.params.roleId)
        if (role === null) {
            res.status(404).json({ error: 'Role non trouvé.' });
        } else {
            res.status(200).json(role)
        }

    } catch (error) {
        console.error(`Error dans récupération du role ${req.params.roleId} :`, error);
        res.status(500).json({ error: 'Error dans récupération du role' });
    }
})

router.post('/', [verifyToken, isAdmin], async (req, res) => {
    const { role_name } = req.body;

    try {
        const createdRole = await db.Role.create({
            role_name: role_name
        });

        res.status(201).json(createdRole);
    } catch (error) {
        console.error(`Error dans l'insertion du role :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion du role" });
    }
})

router.delete('/:roleId', [verifyToken, isAdmin], async (req, res) => {
    try {

        const existingRole = await db.Role.findByPk(req.params.roleId)

        if (!existingRole) {
            return res.status(404).json({ error: 'Role introuvable' })
        }

        const removeRole = await db.Role.destroy({
            where: { role_id: req.params.roleId }
        })
        res.status(204).json(removeRole)
    } catch (error) {
        console.error(`Error dans suppression du role ${req.params.roleId} :`, error);
        res.status(500).json({ error: 'Error dans suppression du role' });
    }
})

router.patch('/:roleId', [verifyToken, isAdmin], async (req, res) => {

    const { role_name } = req.body

    try {
        const existingRole = await db.Role.findByPk(req.params.roleId)

        if (!existingRole) {
            return res.status(404).json({ error: 'Role introuvable' })
        }

        const patchedRole = await db.Role.update
            ({
                role_name: role_name
            },
                {
                    where: { role_id: req.params.roleId },
                })

        res.status(200).json(patchedRole)

    } catch (error) {
        console.error(`Error dans maj du role ${req.params.roleId} :`, error);
        res.status(500).json({ error: 'Error dans maj du role' });
    }

})

module.exports = router