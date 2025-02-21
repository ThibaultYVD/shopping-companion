require('dotenv/config');
const fs = require("fs");
const path = require("path");
const db = require("./model/Models");

async function seedDatabase() {
    try {
        // Charger les données depuis le JSON
        const rawData = fs.readFileSync(path.join(__dirname, "seedData.json"));
        const data = JSON.parse(rawData);

        // Insérer les supermarchés si non existants
        const supermarketMap = {};
        for (const market of data.supermarkets) {
            const [newMarket] = await db.Supermarket.findOrCreate({
                where: { supermarket_name: market.supermarket_name },
                defaults: market // Si l'enregistrement n'existe pas, il sera créé
            });
            supermarketMap[market.supermarket_name] = newMarket.supermarket_id;
        }

        // Insérer les étagères si non existantes
        const shelfMap = {};
        for (const shelf of data.shelves) {
            const supermarketId = supermarketMap[shelf.supermarket_name];
            if (!supermarketId) {
                console.error(`Supermarché introuvable pour ${shelf.shelf_name}`);
                continue;
            }
            const [newShelf] = await db.Shelf.findOrCreate({
                where: { shelf_name: shelf.shelf_name, supermarket_id: supermarketId },
                defaults: { ...shelf, supermarket_id: supermarketId }
            });
            shelfMap[shelf.shelf_name] = newShelf.shelf_id;
        }

        // Insérer les produits si non existants
        for (const product of data.products) {
            const shelfId = shelfMap[product.shelf_name];
            if (!shelfId) {
                console.error(`Étagère introuvable pour ${product.product_name}`);
                continue;
            }
            await db.Product.findOrCreate({
                where: { product_name: product.product_name, shelf_id: shelfId },
                defaults: {
                    product_name: product.product_name,
                    price: product.price,
                    shelf_id: shelfId
                }
            });
        }

        console.log("Base de données initialisée avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la base de données :", error);
    } finally {
        process.exit();
    }
}

seedDatabase();
