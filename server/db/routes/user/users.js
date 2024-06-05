const express = require('express')
const router = express.Router()
const db = require('../../model/Models');
const jwt = require("jsonwebtoken");
const { verifyToken } = require('../../middleware/authjwt')
const { escapeData } = require('../../middleware/validation')
const bcrypt = require("bcryptjs");

router.get('/', [verifyToken], async (req, res) => {
    const token = req.session.token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const tokenUser_id = decodedToken.id
    try {
        const user = await db.sequelize.query(`SELECT * FROM users WHERE user_id = :user_id`,
            {
                replacements: {
                    user_id: tokenUser_id,
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (!user || user.length == 0) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à accéder à cet utilisateur.' });
        }

        res.status(200).json(user)
    } catch (error) {
        console.error(`Error dans récupération de l'utilisateur ${tokenUser_id} :`, error);
        res.status(500).json({ error: "Error dans récupération de l'utilisateur." });
    }
})

router.post('/joingroup/:groupId', [verifyToken, escapeData], async (req, res) => {

    const existingGroup = await db.Group.findByPk(req.params.groupId)

    const token = req.session.token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const tokenUser_id = decodedToken.id

    try {

        if (!existingGroup) return res.status(404).json({ error: 'Groupe introuvable' })
        
        if (existingGroup.is_open == "FALSE") return res.status(403).json({ error: 'Vous ne pouvez pas rejoindre ce groupe' })

        bcrypt.compare(req.body.code, existingGroup.invitation_code, async function(err, response) {
            if (err){ 
                //console.log(err)
                return res.status(500).json(err)
            } 
            if (response) {
                
            const alreadyJoined = await db.sequelize.query(`SELECT * FROM group_members WHERE user_id = :user_id AND group_id = :group_id`,
            {
                replacements:{
                    user_id : tokenUser_id,
                    group_id:req.params.groupId,
                },type: db.sequelize.QueryTypes.SELECT
            }
            )

            console.log(alreadyJoined.length)

            if(alreadyJoined.length != 0) return res.status(200).json({error: "Vous êtes déjà membre de ce groupe."})
        
            await db.sequelize.query(`INSERT INTO group_members (user_id, group_id, joined_at) VALUES (:user_id, :group_id, :joined_at)`,
            {
                replacements: {
                    user_id: tokenUser_id,
                    group_id: req.params.groupId,
                    joined_at: new Date(),
                }, type: db.sequelize.QueryTypes.INSERT,
            }
            );

            res.status(201).json(existingGroup);
            }
            else {
                res.status(403).json({message:"Code invalide"});
            }
        });
  
    } catch (error) {
        console.error(`Error pour rejoindre le groupe ${req.params.groupId}`, error);
        res.status(500).json({ error: "Erreur pour rejoindre le groupe." });
    }

})


router.patch('/', [verifyToken], async (req, res) => {
    const token = req.session.token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const tokenUser_id = decodedToken.id

    try {
        const { first_name, last_name } = req.body

        const patchedUser = await db.User.update
            ({
                first_name: first_name,
                last_name: last_name
            },
                {
                    where: { user_id: tokenUser_id },
                })

        res.status(200).json(patchedUser)

    } catch (error) {
        console.error(`Error dans maj de l'utilisateur ${tokenUser_id} :`, error);
        res.status(500).json({ error: "Error dans maj de l'utilisateur." });
    }

})


router.delete('/', [verifyToken], async (req, res) => {
    try {
        const token = req.session.token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        const removeUser = await db.User.destroy({
            where: { user_id: tokenUser_id }
        })
        res.status(204).json(removeUser)

    } catch (error) {
        console.error(`Error dans suppression de l'utilisateur ${tokenUser_id} :`, error);
        res.status(500).json({ error: "Error dans suppression de l'utilisateur" });
    }
})


module.exports = router