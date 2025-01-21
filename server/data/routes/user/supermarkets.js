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

        const supermarkets = await db.sequelize.query(
            `SELECT DISTINCT s.* 
             FROM supermarkets s`,
            {
                replacements: {
                    user_id: tokenUser_id
                },
                type: db.sequelize.QueryTypes.SELECT,
            }
        );
        res.status(200).json(supermarkets)

    } catch (error) {
        console.error(`Error dans récupération des groupes`, error);
        res.status(500).json({ error: 'Error dans récupération des groupes' });
    }
})


module.exports = router