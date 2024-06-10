const express = require('express')
const router = express.Router()
const db = require('../model/Models');


function dijkstra(graph, source) {
    const distances = {};
    const prev = {};
    const pq = [];
    let closestPoint = null;
    let minDistance = Infinity;

    // Initialisation des distances et de la file de priorité
    for (let vertex in graph) {
        if (vertex === source) {
            distances[vertex] = 0;
            pq.push({ key: vertex, priority: 0 });
        } else {
            distances[vertex] = Infinity;
            pq.push({ key: vertex, priority: Infinity });
        }
        prev[vertex] = null;
    }

    // Fonction pour trier la file de priorité
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
                prev[neighbor] = currentVertex;

                // Mise à jour de la priorité dans la file
                const index = pq.findIndex(item => item.key === neighbor);
                if (index !== -1) {
                    pq[index].priority = alt;
                }
            }
        }

        // Vérifier si le point actuel est le plus proche trouvé
        if (currentVertex !== source && distances[currentVertex] < minDistance) {
            closestPoint = currentVertex;
            minDistance = distances[currentVertex];
            break;
        }
    }

    return { closestPoint, minDistance };
}



function euclideanDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
}


function buildGraph(points) {
    const graph = {};

    for (let i = 0; i < points.length; i++) {
        console.log(points[i].shelf_id)
        graph[points[i].shelf_id] = {};  // Initialise une liste d'adjacence pour le point i
        

        for (let j = 0; j < points.length; j++) {

            if (i !== j) {
                const distance = euclideanDistance(points[i], points[j]);
                console.log(distance)
                graph[points[i].shelf_id][points[j].shelf_id] = distance;  // Ajoute le voisin j avec la distance
            }
        }
    }

    return graph;
}




router.get('/', async (req, res) => {

    try {
        const user_id = 30
        const list_id = 1

        let sql = 
        `SELECT DISTINCT 
            l.list_id, s.shelf_id, s.shelf_name, s.location_x, s.location_y

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

        const points = []

        for (let i = 0; i < shelvesData.length; i++){

            points.push({
                shelf_id: shelvesData[i].shelf_id, 
                x:shelvesData[i].location_x, 
                y:shelvesData[i].location_y
            })
        }

        const source = '1';
        const { closestPoint, minDistance } = dijkstra(buildGraph(points), source);

    console.log(`Le point le plus proche de ${source} est ${closestPoint} avec une distance de ${minDistance}`);
   
        
 } catch (error) {

        console.log(error)
    }

})

module.exports = router