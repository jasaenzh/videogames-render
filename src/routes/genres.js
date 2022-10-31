const { Router } = require("express");
const axios = require("axios");
const { Videogame, Genre, videogame_genre } = require("../db");
const { MY_API_KEY } = process.env;
const router = Router();


//Entra a la API, la mapea y una vez que la Mapea,
//hace un findOrCreate dentro del modelo y guarda todas las ocupaciones dentro del modelo

// GET /genres: Pide a la API todos los Generos y a cargamos en nuestra base de datos, Antes que el Server levante
router.get('/', async (req, res) => {


    try {
        // Con esta funcion me traigo (Asincronico) la informacion de la API
        // axios.get(`https://api.rawg.io/api/genres?key=${MY_API_KEY}`).then((respose) => {
        //     let aux = respose.data.results.map((generos) => {
        //         const objGenre = {
        //             id: generos.id,
        //             name: generos.name,
        //         };
        //         return objGenre;
        //     });
        //     Genre.bulkCreate(aux);
        //     res.json({ msg: "Done!" });

        // })

        const genre = await Genre.findAll();
        res.status(200).json(genre);
    } catch (error) {
        res.json(error.message)
    }

})

module.exports = router;
