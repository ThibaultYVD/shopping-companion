const express = require('express')
const router = express.Router()
const db = require('../../model/Models');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { verifyToken } = require('../../security/authjwt')
const { escapeData } = require('../../security/validation')

router.get('/', [verifyToken], async (req, res) => {
    try {
        const tokenUser_id = req.userId

        const groups = await db.sequelize.query(
            `SELECT DISTINCT g.* 
             FROM users_groups g 
             INNER JOIN group_members m 
             ON g.group_id = m.group_id 
             WHERE m.user_id = :user_id`,
            {
                replacements: {
                    user_id: tokenUser_id
                },
                type: db.sequelize.QueryTypes.SELECT,
            }
        );
        res.status(200).json(groups)

    } catch (error) {
        console.error(`Error dans récupération des groupes`, error);
        res.status(500).json({ error: 'Error dans récupération des groupes' });
    }
})



router.get('/:groupId', [verifyToken], async (req, res) => {
    try {

        const tokenUser_id = req.userId

        const userGroup = await db.sequelize.query(`SELECT DISTINCT g.*, u.first_name, u.last_name FROM users_groups g 
            INNER JOIN group_members m ON m.user_id = :user_id AND m.group_id = :group_id 
            INNER JOIN users u ON u.user_id = g.user_id
            WHERE g.group_id = :group_id`,
            {
                replacements: {
                    user_id: tokenUser_id,
                    group_id: req.params.groupId
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (!userGroup || userGroup.length == 0) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à accéder à ce groupe' });
        }

        res.status(200).json(userGroup)
    } catch (error) {
        console.error(`Error dans récupération du groupe ${req.params.groupId} :`, error);
        res.status(500).json({ error: 'Error dans récupération du groupe' });
    }
})



router.post('/', [verifyToken], async (req, res) => {
    const { group_name } = req.body;

    const tokenUser_id = req.userId


    try {
        const createdGroup = await db.Group.create({
            group_name: group_name,
            creation_date: new Date(),
            user_id: tokenUser_id,
            is_open: "FALSE"
        });

        const group_id = createdGroup.group_id

        await db.sequelize.query(`INSERT INTO group_members (user_id, group_id, joined_at) VALUES (:user_id, :group_id, :joined_at)`,
            {
                replacements: {
                    user_id: tokenUser_id,
                    group_id: group_id,
                    joined_at: new Date(),
                }, type: db.sequelize.QueryTypes.INSERT,
            }
        );

        res.status(201).json(createdGroup);
    } catch (error) {
        console.error(`Error dans l'insertion du groupe :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion du groupe." });
    }

})


router.patch('/:groupId', [verifyToken], async (req, res) => {
    try {
        const { group_name } = req.body

        const tokenUser_id = req.userId

        const existingGroup = await db.Group.findByPk(req.params.groupId)

        if (!existingGroup) {
            return res.status(404).json({ error: 'Groupe introuvable' })
        }

        if (tokenUser_id != existingGroup.user_id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas modifier ce groupe' })
        }

        const patchedGroup = await db.Group.update
            ({
                group_name: group_name
            },
                {
                    where: { group_id: req.params.groupId },
                })

        res.status(200).json({ "group_id": req.params.groupId, "old_name": existingGroup.group_name, "new_name:": group_name })

    } catch (error) {
        console.error(`Error dans maj du groupe ${req.params.groupId} :`, error);
        res.status(500).json({ error: 'Error dans maj du groupe' });
    }

})


router.patch('/createInvit/:groupId', [verifyToken], async (req, res) => {
    try {

        const tokenUser_id = req.userId

        const verifCreator = await db.sequelize.query(`SELECT user_id FROM users_groups WHERE group_id = :group_id`,
            {
                replacements: {
                    group_id: req.params.groupId
                }, type: db.sequelize.QueryTypes.SELECT,
            });

        if (!verifCreator || verifCreator.length == 0) return res.status(404).json({ message: "Ce groupe n'existe pas." })
        if (verifCreator[0].user_id != tokenUser_id) return res.status(403).json({ message: "Vous n'êtes pas autorisé à créer un code d'invitation." })

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        const length = 8

        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        let hashedCode = bcrypt.hashSync(result, 8)

        await db.sequelize.query(`UPDATE users_groups SET invitation_code = :invitation_code, is_open = :is_open WHERE group_id = :group_id`,
            {
                replacements: {
                    invitation_code: hashedCode,
                    is_open: "TRUE",
                    group_id: req.params.groupId,
                }, type: db.sequelize.QueryTypes.UPDATE,
            });


        setTimeout(async () => {
            await db.sequelize.query(`UPDATE users_groups SET is_open = :is_open WHERE group_id = :group_id`,
                {
                    replacements: {
                        is_open: "FALSE",
                        group_id: req.params.groupId,
                    },
                    type: db.sequelize.QueryTypes.UPDATE,
                });
        }, 600000);

        res.status(200).json({ "invitation_code": result });
    } catch (error) {
        console.error(`Error dans création de l'invitation du groupe ${req.params.groupId}`)
        res.status(500).json({ error: "Error dans création de l'invitation." });
    }
})



router.delete('/:groupId', [verifyToken], async (req, res) => {
    try {
        const existingGroup = await db.Group.findByPk(req.params.groupId)

        const tokenUser_id = req.userId

        if (!existingGroup) {
            return res.status(404).json({ error: 'Groupe introuvable' })
        }

        if (tokenUser_id != existingGroup.user_id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas supprimer ce groupe' })
        }

        const removeGroup = await db.Group.destroy({
            where: { group_id: req.params.groupId }
        })
        res.status(204).json({ "Deleted group": existingGroup.group_name })

    } catch (error) {
        console.error(`Error dans suppression du groupe ${req.params.groupId} :`, error);
        res.status(500).json({ error: 'Error dans suppression du groupe' });
    }
})

module.exports = router