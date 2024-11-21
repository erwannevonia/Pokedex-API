/**
* Serveur Backend Pokedex
*/
// console.log ("Hello World!");
// Définir l'emplacement des fichiers bases de données
const POKEDEX_SRC = "./DATA/pokedex.json";
// Définir l'emplacement des images
const IMAGES_SRC = "./FILES/images";
// Définir un port
const PORT = 5001;
// ************************************************
// Lancer un serveur express sur un port défini
const fs = require('fs');
// npm install express
const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors())
// Lancement du serveur et attendre
app.listen(
    PORT,
    '127.0.0.1',
    () => {
        console.log('Server Pokedex is listening on ' + PORT);
    }
)

// Route pour afficher tout le fichier s'il n'y a pas de paramètres
app.get(
    '/pokemon', (req, res) => {
        let data = fs.readFileSync(POKEDEX_SRC);
        let pokedex = JSON.parse(data);
        res.send(pokedex);
    }
)

// Route pour afficher de manière aléatoire
app.get(
    '/pokemon/hasard', (req, res) => {
        // 1. Lecture du fichier
        let data = fs.readFileSync(POKEDEX_SRC);
        let pokedex = JSON.parse(data);
        
        // 2. Récupération du dernier id
        const lastId = pokedex[pokedex.length -2].id;

        // 3. Création d'un id aléatoire
        const idRandom = Math.floor(Math.random() * lastId);

        // 4. Renvoi du pokemon aléatoire
        res.send(pokedex[idRandom]);
    }
)

// Route pour afficher un pokemon spécifique via son id
app.get(
    '/pokemon/:id(\\d+)', (req, res) => {
        const id = req.params.id -1;
        let data = fs.readFileSync(POKEDEX_SRC);
        let pokedex = JSON.parse(data);
        if (pokedex[id] != null) {
            res.send(pokedex[id]);
        }

        // Si aucun Pokémon n'est trouvé avec cet id
        res.status(404).send({ error: "Pokemon not found" });
    }
)

// Route pour afficher un pokemon spécifique via son nom en anglais
app.get(
    '/pokemon/:name([a-zA-Z]+)', (req, res) => {
        const name = req.params.name;
        let data = fs.readFileSync(POKEDEX_SRC);
        let pokedex = JSON.parse(data);
        for (let i = 0; i < pokedex.length; ++i) {
            const element = pokedex[i];
            if (pokedex[i].name.english === name) {
                return res.send(pokedex[i]);
            }
        }

        // Si aucun Pokémon n'est trouvé avec ce nom
        res.status(404).send({ error: "Pokemon not found" });
    }
)

// Route pour afficher un pokemon spécifique via son type en anglais
app.get(
    '/pokemon/type/:type', (req, res) => {
        const type = req.params.type;
        let data = fs.readFileSync(POKEDEX_SRC);
        let pokedex = JSON.parse(data);
        let result = [];
        let compteur = 0;
        for (let i = 0; i < pokedex.length; ++i) {
            const element = pokedex[i];
            if (pokedex[i].type.includes(type)) {
                result.push(pokedex[i]); // Ajoute le Pokémon dans les résultats
                compteur = compteur +1;
            }
        }
    
        // Vérifie si des résultats ont été trouvés
        if (result.length > 0) {
            compteur = "Il y a " + compteur + " Pokemons de type " + type;
            result.unshift(compteur);
            res.send(result); // Renvoie tous les Pokémon du type spécifié
        } else {
            res.status(404).send({ error: "Pokemon not found with type " + type });
        }
    }
)