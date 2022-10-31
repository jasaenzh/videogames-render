const { Router } = require("express");
const axios = require("axios");
const { Videogame, Genre, videogame_genre } = require("../db");
const { MY_API_KEY } = process.env;
const router = Router();
const genres = require('./genres.js')

// GET /videogames Ruta para obtener todos los VideoJuegos o por Query
router.get('/', async (req, res) => {

    const name = req.query.name

    try {
        //Creo un array
        let formatApi = []

        // Con esta for me traigo (Asincronico) la informacion de la API
        for (let i = 1; i <= 5; i++) {
            await axios.get(`https://api.rawg.io/api/games?key=${MY_API_KEY}&page=${i}`)
                .then(response => response.data.results.map((game) => {

                    // console.log("Descripcion: ", game.description)

                    const objGame = {
                        id: game.id,
                        name: game.name,
                        description: game.description_raw,
                        released: game.released,
                        rating: game.rating,
                        background_image: game.background_image,
                        platforms: game.platforms.map((element) => element.platform.name),
                        genres: game.genres?.map(element => element.name)

                    }
                    formatApi.push(objGame)
                }))

        }

        // Con esta funcion me traigo la informacion de la Base de Datos, y con el include agrego el Genero
        const dbLocal = await Videogame.findAll({ include: [{ model: Genre, attributes: ['name'], through: { attributes: [], } }] });

        // Concateno (Asincronico)  la Base de Datos con la informnacion que viene de la API
        const unionDbApi = [...formatApi, ...dbLocal];

        // Teniendo ya las bases de datos unidas puedo buscar o mostrar los juegos

        //Buscar por Query
        if (name) {
            //El includes hace una busqueda mas global y el toLowerCase convierte todo a minuscula
            const queryGameName = await unionDbApi.filter((game) => game.name.toLowerCase().startsWith(name.toLocaleLowerCase()));
            queryGameName.length ? res.status(200).json(queryGameName) : res.status(400).json("No se encontro Video Juego 2")
        } else {
            //Envio resultado de todos los Video Juegos
            res.json(unionDbApi)

        }


    } catch (error) {
        res.json(error.message)
    }


})




// GET /videogame/{idVideogame}: Obtener un Videjo Juego por ID
router.get('/:id', async (req, res) => {

    const id = req.params.id;

    // console.log(typeof Number(id))

    try {

        if (id.length < 6) {

            try {
                // const resultApi = await axios.get(`https://api.rawg.io/api/games?key=${MY_API_KEY}`)
                const resultApi = await axios.get(`https://api.rawg.io/api/games/${id}?key=${MY_API_KEY}`)

                // const filterGame = resultApi.data.results.find((element) => element.id === Number(id))



                // console.log("Get :id => ", resultApi.data.description_raw)

                const objGame = {
                    id: resultApi.data.id,
                    name: resultApi.data.name,
                    released: resultApi.data.released,
                    genres: resultApi.data.genres?.map(gen => gen.name),
                    description: resultApi.data.description_raw,
                    rating: resultApi.data.rating,
                    background_image: resultApi.data.background_image,
                    platforms: resultApi.data.platforms.map((element) => element.platform.name),
                }

                // const objGame = {
                //     id: filterGame.id,
                //     name: filterGame.name,
                //     released: filterGame.released,
                //     genres: filterGame.genres?.map(gen => gen.name),
                //     description: filterGame.description_raw,
                //     rating: filterGame.rating,
                //     background_image: filterGame.background_image,
                //     platforms: filterGame.platforms.map((element) => element.platform.name),
                // }
                return res.status(200).json(objGame)
            } catch (error) {
                return res.status(400).json(error.message)
            }



        }
        else {
            try {
                const filterDbGame = await Videogame.findByPk(id)
                return res.status(200).json(filterDbGame)
            } catch (error) {
                return res.status(400).json({ msg: "No se encuentra el ID" })
            }

        }

    } catch (error) {
        res.status(400).json(error.message)
    }


})


// POST / videogames: Crear un personaje
router.post('/', async (req, res) => {

    // Recibo los datos y les hago un destructurin
    let { name, platforms, description, released, rating, genres } = req.body;

    // Validacion de los datos
    if (!name || !description || !released || !rating || !platforms) {
        res.status(400).json({ msg: "Faltan Datos" })
    }

    try {

        // Agrego informacion a mi base de datos (Asincronico), con create o con findAll
        const newVideoGame = await Videogame.create(
            {
                name,
                description,
                released,
                rating,
                platforms,
            }
        )
        let findGenre = await Genre.findAll({ where: { name: genres } })

        // Agrego la relacion que tiene generos para la tabla intermedia del modelo Generos
        newVideoGame.addGenre(findGenre)

        //Envio el resultado de creacion
        res.json("Done")

    } catch (error) {
        res.json(error.message)
    }

})


module.exports = router;
