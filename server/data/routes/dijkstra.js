const express = require('express')
const router = express.Router()
const db = require('../model/Models');


function dijkstra(graph, source) {

    const distances = {};
    const pq = [];
    let closestPoint = null;
    let minDistance = Infinity;

    for (let vertex in graph) {
        if (vertex === source) {
            distances[vertex] = 0;
            pq.push({ key: vertex, priority: 0 });
        } else {
            distances[vertex] = Infinity;
            pq.push({ key: vertex, priority: Infinity });
        }
    }

    const sortQueue = () => {
        pq.sort((a, b) => a.priority - b.priority);
    };

    while (pq.length > 0) {
        sortQueue();
        const { key: currentVertex } = pq.shift();

        for (let neighbor in graph[currentVertex]) {
            const distance = graph[currentVertex][neighbor];
            const alt = distances[currentVertex] + distance;

            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                const index = pq.findIndex(item => item.key === neighbor);
                if (index !== -1) {
                    pq[index].priority = alt;
                }
            }
        }

        if (currentVertex !== source && distances[currentVertex] < minDistance) {
            closestPoint = currentVertex;
            minDistance = distances[currentVertex];
            break;
        }
    }

    return { closestPoint };
}



function euclideanDistance(point1, point2) {
    let sqrt = Math.sqrt(
        Math.pow(point1.location_x - point2.location_x, 2) + Math.pow(point1.location_y - point2.location_y, 2)
    );

    return sqrt
}

function buildGraph(points) {

    const graph = {};

    points.forEach((pointI, i) => {

        graph[pointI.shelf_id] = {};

        points.forEach((pointJ, j) => {
            if (i !== j) {
                graph[pointI.shelf_id][pointJ.shelf_id] = euclideanDistance(pointI, pointJ);
            }
        });
    });

    return graph;
}




router.get('/:listId', async (req, res) => {
    try {
        const user_id = req.userId;

        const checkIfExist = await db.sequelize.query(
            `SELECT * FROM list_routes WHERE list_id = :list_id`,
            {
                replacements: {
                    list_id: req.params.listId,
                },
                type: db.sequelize.QueryTypes.SELECT,
            }
        );

        if (checkIfExist.length !== 0) {
            const existingRoute = checkIfExist[0].route;
            return res.status(200).json(typeof existingRoute === "string" ? JSON.parse(existingRoute) : existingRoute);
        }

        let sql =
            `SELECT DISTINCT 
                s.shelf_id, s.shelf_name, s.location_x, s.location_y
    
            FROM shelves s 
            
            INNER JOIN supermarkets sm ON sm.supermarket_id = s.supermarket_id
            INNER JOIN lists l ON sm.supermarket_id = l.supermarket_id
            INNER JOIN users_groups g ON g.group_id = l.group_id
            INNER JOIN group_members gm ON gm.group_id = g.group_id

            WHERE l.list_id = :list_id
                AND s.shelf_name = 'start'`;

        const getStart = await db.sequelize.query(sql, {
            replacements: {
                list_id: req.params.listId,
            },
            type: db.sequelize.QueryTypes.SELECT,
        });


        sql =
            `SELECT DISTINCT 
                s.shelf_id, s.shelf_name, s.location_x, s.location_y
    
            FROM shelves s 
            
            INNER JOIN products p ON p.shelf_id = s.shelf_id
            INNER JOIN products_lists pl ON pl.product_id = p.product_id
            INNER JOIN lists l ON l.list_id = pl.list_id
            INNER JOIN users_groups g ON g.group_id = l.group_id
            INNER JOIN group_members gm ON gm.group_id = g.group_id
            INNER JOIN supermarkets sm ON sm.supermarket_id = l.supermarket_id
            
            WHERE (l.list_id = :list_id)
            OR s.shelf_name = 'start'`;

        const shelvesData = await db.sequelize.query(sql, {
            replacements: {
                list_id: req.params.listId,
            },
            type: db.sequelize.QueryTypes.SELECT,
        });


        let shelves = getStart.concat(shelvesData);

        let source = shelves[0].shelf_id.toString();
        let route = [];


        route.push({
            start: {
                shelf_id: shelves[0].shelf_id,
                shelf_name: shelves[0].shelf_name,
            },
        });

        while (shelves.length > 1) {
            let { closestPoint } = dijkstra(buildGraph(shelves), source);

            sql =
                `SELECT DISTINCT 
                    p.product_name, p.price, pl.quantity
    
                FROM products_lists pl
    
                INNER JOIN products p ON pl.product_id = p.product_id
                INNER JOIN shelves s ON s.shelf_id = p.shelf_id
            
                WHERE s.shelf_id = :shelf_id
                AND pl.list_id = :list_id`;

            const products = await db.sequelize.query(sql, {
                replacements: {
                    list_id: req.params.listId,
                    shelf_id: closestPoint,
                },
                type: db.sequelize.QueryTypes.SELECT,
            });


            const closestShelf = shelves.find(
                (shelf) => parseInt(shelf.shelf_id) === parseInt(closestPoint)
            );

            route.push({
                nextShelf: {
                    shelf_name: closestShelf.shelf_name,
                    products: products,
                },
            });

            const sourceIndex = shelves.findIndex(
                (point) => parseInt(point.shelf_id) === parseInt(source)
            );

            shelves.splice(sourceIndex, 1);
            source = closestPoint;
        }

        route.push({
            end: {
                shelf_id: 999,
                shelf_name: "Sortie",
            },
        });


        await db.ListRoute.create({
            list_id: req.params.listId,
            route: route,
            created_at: new Date()
        });


        res.status(200).json(route);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router