const express = require('express')
const router = express.Router()
const db = require('../../model/Models');
const jwt = require("jsonwebtoken");

const { verifyToken } = require('../../middleware/authjwt')
const { escapeData } = require('../../middleware/validation')


router.get('/getall/:listId', [verifyToken], async (req, res) => {
    try {
        const token = req.session.token

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT p.product_id, p.product_name, p.price, s.shelf_name, s.location_x, s.location_y
        FROM products p
        INNER JOIN shelves s ON p.shelf_id = s.shelf_id
        INNER JOIN supermarkets sm ON s.supermarket_id = sm.supermarket_id
        INNER JOIN lists l ON l.supermarket_id = sm.supermarket_id
		INNER JOIN group_members m ON m.group_id = l.group_id AND m.user_id = :user_id
		WHERE l.list_id = :list_id`

        const supermarketProducts = await db.sequelize.query(sql,
            {
                replacements: {
                    list_id: req.params.listId,
                    user_id: tokenUser_id
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if(!supermarketProducts || supermarketProducts.length == 0){
            res.status(403).json({message: "Vous n'êtes pas autorisé à accéder à cette liste de produit."})
        }else{
            res.status(200).json(supermarketProducts);
        }
        
    } catch (err) {
        console.error('Error dans récupération des listes :', err);
        res.status(500).json({ error: 'Error dans récupération des listes' });
    }
});

router.get('/:listId', [verifyToken], async (req, res) => {
    try {
        const token = req.session.token

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT p.product_id, p.product_name, p.price, pl.quantity, pl.added_at, s.shelf_name, s.location_x, s.location_y
        FROM products_list pl
        INNER JOIN products p ON pl.product_id = p.product_id
        INNER JOIN shelves s ON p.shelf_id = s.shelf_id
        INNER JOIN lists l ON l.list_id = pl.list_id
		INNER JOIN group_members m ON m.group_id = l.group_id AND m.user_id = :user_id
		WHERE pl.list_id = :list_id`

        const listProducts = await db.sequelize.query(sql,
            {
                replacements: {
                    list_id: req.params.listId,
                    user_id: tokenUser_id
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if(!listProducts || listProducts.length == 0){
            res.status(403).json({message: "Vous n'êtes pas autorisé à accéder à cette liste de produit."})
        }else{
            res.status(200).json(listProducts);
        }
        
    } catch (err) {
        console.error('Error dans récupération des listes :', err);
        res.status(500).json({ error: 'Error dans récupération des listes' });
    }
});


router.get('/:listId/:productId', [verifyToken], async (req, res) => {
    try {
        const token = req.session.token

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT p.product_id, p.product_name, p.price, s.shelf_name, s.location_x, s.location_y
        FROM products p
        INNER JOIN shelves s ON p.shelf_id = s.shelf_id
        INNER JOIN supermarkets sm ON s.supermarket_id = sm.supermarket_id
        INNER JOIN lists l ON l.supermarket_id = sm.supermarket_id
		INNER JOIN group_members m ON m.group_id = l.group_id AND m.user_id = :user_id
		WHERE l.list_id = :list_id
        AND p.product_id = :product_id`

        const supermarketProducts = await db.sequelize.query(sql,
            {
                replacements: {
                    list_id: req.params.listId,
                    product_id: req.params.productId,
                    user_id: tokenUser_id
                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if(!supermarketProducts || supermarketProducts.length == 0){
            res.status(403).json({message: "Vous n'êtes pas autorisé à accéder à cette liste de produit."})
        }else{
            res.status(200).json(supermarketProducts);
        }
        
    } catch (err) {
        console.error('Error dans récupération des listes :', err);
        res.status(500).json({ error: 'Error dans récupération des listes' });
    }
});

router.post('/:listId/:productId', [verifyToken], async (req, res) => {
    try {
        const token = req.session.token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT m.user_id 
        FROM lists l
        INNER JOIN group_members m ON m.group_id = l.group_id AND m.user_id = :user_id
        WHERE l.list_id = :list_id`
        
        const perm_user = await db.sequelize.query(sql,
            {
                replacements: {
                    list_id: req.params.listId,
                    user_id: tokenUser_id

                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (!perm_user || perm_user.length == 0) return res.status(404).json({ error: "Cette liste n'existe pas. Ou vous n'avez pas l'autorisation à accéder à cette liste." });

        const list = await db.List.findByPk(req.params.listId);
        const product = await db.Product.findByPk(req.params.productId);

        if (!list || !product) return res.status(404).json({error: "Ce produit ou cette liste n'existe pas."});
        sql = `SELECT quantity FROM products_list WHERE product_id = :product_id AND list_id = :list_id`

        const checkQuantity = await db.sequelize.query(sql,
            {
                replacements: {
                    list_id: req.params.listId,
                    product_id: req.params.productId

                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );
        console.log(checkQuantity)
        if(!checkQuantity || checkQuantity.length == 0)
        {
            sql = `INSERT INTO products_list(product_id, list_id, quantity, user_id, added_at) VALUES (:product_id, :list_id, :quantity, :user_id, :added_at)`
            const insert = await db.sequelize.query(sql,
                {
                    replacements: {
                        product_id: req.params.productId,
                        list_id: req.params.listId,
                        quantity: 1,
                        user_id: tokenUser_id,
                        added_at: new Date()
    
                    }, type: db.sequelize.QueryTypes.INSERT,
                }
            );
            return res.status(201).json({message: "Le produit a bien été ajouté à la liste."});

        } else {
            sql = `UPDATE products_list SET quantity = :quantity WHERE product_id = :product_id AND list_id = :list_id`
            const update = await db.sequelize.query(sql,
                {
                    replacements: {
                        product_id: req.params.productId,
                        list_id: req.params.listId,
                        quantity: checkQuantity[0].quantity + 1,   
                    }, type: db.sequelize.QueryTypes.UPDATE,
                }
            );
            return res.status(200).json({message: "La quantité du produit été incrémentée."});
        }

    } catch (error) {
        console.error(`Error dans l'insertion de la liste :`, error);
        res.status(500).json({ error: "Erreur dans l'insertion de la liste." });
    }
})

router.patch('/:listId/:productId', [verifyToken, isAdmin], async (req, res) => {

    try {
        const token = req.session.token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT m.user_id 
        FROM lists l
        INNER JOIN group_members m ON m.group_id = l.group_id AND m.user_id = :user_id
        WHERE l.list_id = :list_id`
        
        const perm_user = await db.sequelize.query(sql,
            {
                replacements: {
                    list_id: req.params.listId,
                    user_id: tokenUser_id

                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (!perm_user || perm_user.length == 0) return res.status(404).json({ error: "Cette liste n'existe pas. Ou vous n'avez pas l'autorisation à accéder à cette liste." });

        const list = await db.List.findByPk(req.params.listId);
        const product = await db.Product.findByPk(req.params.productId);

        if (!list || !product) return res.status(404).json({error: "Ce produit ou cette liste n'existe pas."});
        sql = `SELECT quantity FROM products_list WHERE product_id = :product_id AND list_id = :list_id`

        const checkQuantity = await db.sequelize.query(sql,
            {
                replacements: {
                    list_id: req.params.listId,
                    product_id: req.params.productId

                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );
        console.log(checkQuantity)
        if(checkQuantity[0].quantity > 1) 
        {
            sql = `UPDATE products_list SET quantity = :quantity WHERE product_id = :product_id AND list_id = :list_id`
            const update = await db.sequelize.query(sql,
                {
                    replacements: {
                        product_id: req.params.productId,
                        list_id: req.params.listId,
                        quantity: checkQuantity[0].quantity - 1,   
                    }, type: db.sequelize.QueryTypes.UPDATE,
                }
            );
            return res.status(200).json({message: "La quantité du produit été décrémentée."});

        } else {
            sql = `DELETE FROM products_list WHERE product_id = :product_id AND list_id = :list_id`

            const del = await db.sequelize.query(sql,
                {
                    replacements: {
                        product_id: req.params.productId,
                        list_id: req.params.listId,
                    }, type: db.sequelize.QueryTypes.DELETE,
                }
            );
            res.status(204).json({message: "Le produit a été supprimé de la liste."});
        }

    } catch (error) {
        console.error(`Error dans maj du produit ${req.params.productId} :`, error);
        res.status(500).json({ error: 'Error dans maj du produit' });
    }

})

router.delete('/:listId/:productId', [verifyToken], async (req, res) => {
    try {

        const token = req.session.token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const tokenUser_id = decodedToken.id

        let sql = `SELECT DISTINCT m.user_id 
        FROM lists l
        INNER JOIN group_members m ON m.group_id = l.group_id AND m.user_id = :user_id
        WHERE l.list_id = :list_id`
        
        const perm_user = await db.sequelize.query(sql,
            {
                replacements: {
                    list_id: req.params.listId,
                    user_id: tokenUser_id

                }, type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (!perm_user || perm_user.length == 0) return res.status(404).json({ error: "Cette liste n'existe pas. Ou vous n'avez pas l'autorisation à accéder à cette liste." });

        const list = await db.List.findByPk(req.params.listId);
        const product = await db.Product.findByPk(req.params.productId);

        if (!list || !product) return res.status(404).json({error: "Ce produit ou cette liste n'existe pas."});
        
        sql = `
        DELETE FROM products_list 
        WHERE product_id = :product_id 
        AND list_id = :list_id`

        await db.sequelize.query(sql,
            {
                replacements: {
                    product_id: req.params.productId,
                    list_id: req.params.listId,
                }, type: db.sequelize.QueryTypes.DELETE,
            }
        );
        res.status(201).json({message: "Le produit a bien été supprimé de la liste."});
    } catch (error) {
        console.error(`Error dans suppression du produit ${req.params.productId} :`, error);
        res.status(500).json({ error: 'Error dans suppression du produit' });
    }
})


module.exports = router;