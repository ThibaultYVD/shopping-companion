const express = require('express')
const router = express.Router()
const db = require('../../model/Models');
const jwt = require("jsonwebtoken");
const { verifyToken, isAdmin } = require('../../middleware/authjwt')



router.get('/', [verifyToken, isAdmin], async (req, res) => {
    try {
        const groups = await db.Group.findAll();
        res.status(200).json(groups);
    } catch (err) {
        console.error('Error dans récupération des groupes :', err);
        res.status(500).json({ error: 'Error dans récupération des groupes' });
    }
});





module.exports = router