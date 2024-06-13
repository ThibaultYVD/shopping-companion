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
    return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
}

// Construire un graph avec les coordonnées des rayons
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




router.get('/', async (req, res) => {

    try {

        const user_id = 30
        const list_id = 1


        const checkIfExist = await db.sequelize.query(`SELECT * FROM list_routes WHERE list_id = :list_id`,
            {
                replacements: {
                    list_id: list_id,
                }, type: db.sequelize.QueryTypes.SELECT,
            });

        let route

        if(checkIfExist.length != 0) return res.status(201).json(checkIfExist[0].route)
                    

        
    
            let sql = 
            `SELECT DISTINCT 
                s.shelf_id, s.shelf_name, s.location_x, s.location_y
    
            FROM shelves s 
            
            INNER JOIN products p ON p.shelf_id = s.shelf_id
            INNER JOIN products_list pl ON pl.product_id = p.product_id
            INNER JOIN lists l ON l.list_id = pl.list_id
            INNER JOIN groupes g ON g.group_id = l.group_id
            INNER JOIN group_members gm ON gm.group_id = g.group_id
            
            WHERE l.list_id = :list_id
            AND gm.user_id = :user_id`
    
            const shelvesData = await db.sequelize.query(sql,
            {
                replacements: {
                    list_id: list_id,
                    user_id: user_id
                }, type: db.sequelize.QueryTypes.SELECT,
            });

            console.log(shelvesData)

    
            const points = []
    
            for (let i = 0; i < shelvesData.length; i++){
    
                points.push({
                    shelf_id: shelvesData[i].shelf_id, 
                    shelf_name: shelvesData[i].shelf_name,
                    x:shelvesData[i].location_x, 
                    y:shelvesData[i].location_y
                })
            }

            console.log(points)
    
            let source = '11';
            route = []
    
            route.push({
                start: {
                    shelf_id:0,
                    shelf_name:"Entrée"
                }                 
            });
    
            while(points.length > 1){
                let { closestPoint } = dijkstra(buildGraph(points), source);
        
                sql = 
                    `SELECT DISTINCT 
                        s.shelf_name
            
                    FROM shelves s 
        
                    WHERE s.shelf_id = :shelf_id`
        
                const toShelveName = await db.sequelize.query(sql,
                {
                    replacements: {
                        shelf_id: closestPoint,
                    }, type: db.sequelize.QueryTypes.SELECT,
                });
    
                sql = 
                `SELECT DISTINCT 
                pl.product_id, p.product_name, p.price, pl.quantity
    
            FROM products_list pl
    
            INNER JOIN products p ON pl.product_id = p.product_id
            INNER JOIN shelves s ON s.shelf_id = p.shelf_id
            
            WHERE s.shelf_id = :shelf_id
            AND pl.list_id = :list_id`
    
                const products = await db.sequelize.query(sql,
                    {
                        replacements: {
                            list_id: list_id,
                            shelf_id: closestPoint,
                        }, type: db.sequelize.QueryTypes.SELECT,
                    });
    
                route.push({
                        nextStop: {
                            shelf_id:parseInt(closestPoint),
                            shelf_name:toShelveName[0].shelf_name,
                            products:products
                        }                 
                    });
    
                const sourceIndex = points.findIndex(point => parseInt(point.shelf_id) === parseInt(source));
                points.splice(sourceIndex, 1)
                source = closestPoint;
            }
    
            route.push(
                { 
                    end: {
                        shelf_id:99,
                        shelf_name:"Sortie"
                    }       
                });


        res.json(route)
        
 } catch (error) {
        console.log(error)
    }

})

module.exports = router