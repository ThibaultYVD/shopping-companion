const express = require('express')
const router = express.Router()
const db = require('../../model/Models');
const jwt = require("jsonwebtoken");

const { verifyToken } = require('../../middleware/authjwt')
const { escapeData } = require('../../middleware/validation')

// Récupérer les listes du groupe
router.get('/:groupId', [verifyToken], async (req, res) => {
    try {
        const token = req.session.token

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT l.* 
        FROM lists l 
        INNER JOIN group_members m ON m.user_id = :user_id AND m.group_id = :group_id 
        WHERE l.group_id = :group_id`

        const groupLists = await db.sequelize.query(sql,
            {
                replacements: {
                    user_id: tokenUser_id,
                    group_id: req.params.groupId
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if(!groupLists || groupLists.length == 0){
            res.status(403).json({message: "Vous n'êtes pas autorisé à accéder à ces listes."})
        }else{
            res.status(200).json(groupLists);
        }
        
    } catch (err) {
        console.error('Error dans récupération des listes :', err);
        res.status(500).json({ error: 'Error dans récupération des listes' });
    }
});

router.get('/:groupId/:listId', [verifyToken], async (req, res) => {
    try {
        const token = req.session.token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT l.* 
        FROM lists l 
        INNER JOIN group_members m ON m.user_id = :user_id AND m.group_id = :group_id 
        WHERE l.group_id = :group_id AND l.list_id = :list_id`

        const groupList = await db.sequelize.query(sql,
            {
                replacements: {
                    user_id: tokenUser_id,
                    group_id: req.params.groupId,
                    list_id: req.params.listId
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (!groupList || groupList.length == 0) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à accéder à ce groupe' });
        }
        else {
            res.status(200).json(groupList)
        }


    } catch (error) {
        console.error(`Error dans récupération de la liste ${req.params.listId} :`, err);
        res.status(500).json({ error: 'Error dans récupération de la liste' });
    }
})

router.post('/:groupId', [verifyToken], async (req, res) => {
    const { list_name, shopping_date } = req.body;

    try {
        const token = req.session.token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT user_id 
        FROM groupes 
        WHERE group_id = :group_id`
        
        const creator_id = await db.sequelize.query(sql,
            {
                replacements: {
                    group_id: req.params.groupId,
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (!creator_id || creator_id.length == 0) {
            return res.status(404).json({ error: "Ce groupe n'existe pas." });
        }

        if (creator_id[0].user_id == tokenUser_id){
            const createdList = await db.List.create({
                list_name: list_name,
                group_id: req.params.groupId,
                creation_date: new Date(),
                shopping_date: shopping_date
            });
    
            res.status(201).json(createdList);
            
        } else{
            res.status(403).json({message: "Seul le créateur du groupe peut créer une liste."})
        }
    } catch (error) {
        console.error(`Error dans l'insertion de la liste :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion de la liste." });
    }
})


router.patch('/:groupId/:listId', [verifyToken], async (req, res) => {

    const { list_name, shopping_date } = req.body

    try {
        const token = req.session.token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT g.user_id 
        FROM groupes g
        INNER JOIN lists l ON l.group_id = g.group_id 
        WHERE g.group_id = :group_id
        AND l.list_id = :list_id`
        

        
        const creator_id = await db.sequelize.query(sql,
            {
                replacements: {
                    group_id: req.params.groupId,
                    list_id: req.params.listId,
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (!creator_id || creator_id.length == 0) {
            return res.status(404).json({ error: "Ce groupe ou cette liste n'existe pas ou cette liste n'est pas dans ce groupe." });
        }

        if (creator_id[0].user_id == tokenUser_id){
            const patchedList = await db.List.update
            ({
                list_name: list_name,
                shopping_date: shopping_date
            },
                {
                    where: { list_id: req.params.listId },
                })

            res.status(200).json(patchedList)
            
        } else{
            res.status(403).json({message: "Seul le créateur du groupe peut modifier la liste."})
        }

        

    } catch (error) {
        console.error(`Error dans maj du liste ${req.params.listId} :`, error);
        res.status(500).json({ error: 'Error dans maj de la liste' });
    }

})


router.delete('/:groupId/:listId', [verifyToken], async (req, res) => {
    try {
        const token = req.session.token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT g.user_id 
        FROM groupes g
        INNER JOIN lists l ON l.group_id = g.group_id 
        WHERE g.group_id = :group_id
        AND l.list_id = :list_id`
        

        
        const creator_id = await db.sequelize.query(sql,
            {
                replacements: {
                    group_id: req.params.groupId,
                    list_id: req.params.listId,
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (!creator_id || creator_id.length == 0) {
            return res.status(404).json({ error: "Ce groupe ou cette liste n'existe pas ou cette liste n'est pas dans ce groupe." });
        }

        if (creator_id[0].user_id == tokenUser_id){
            const removeList = await db.List.destroy({
                where: { list_id: req.params.listId }
            })
            res.status(204).json(removeList)
            
        } else{
            res.status(403).json({message: "Seul le créateur du groupe peut supprimer une liste."})
        }

        
    } catch (error) {
        console.error(`Error dans suppression de la liste ${req.params.listId} :`, error);
        res.status(500).json({ error: 'Error dans suppression de la liste' });
    }
})

module.exports = router