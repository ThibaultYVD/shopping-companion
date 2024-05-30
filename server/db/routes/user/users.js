const express = require('express')
const router = express.Router()
const db = require('../../model/Models');
const jwt = require("jsonwebtoken");
const { verifyToken } = require('../../middleware/authjwt')
const { escapeData } = require('../../middleware/validation')


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




router.post('/', [verifyToken, escapeData], async (req, res) => {

    const token = req.session.token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const tokenUser_id = decodedToken.id


    try {
        const createdGroup = await db.Group.create({
            group_name: group_name,
            creation_date: new Date(),
            user_id: tokenUser_id
        });

        res.status(201).json(createdGroup);
    } catch (error) {
        console.error(`Error dans l'insertion du groupe :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion du groupe." });
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

module.exports = router