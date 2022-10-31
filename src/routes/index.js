const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require("axios");
const { Videogame, Genre, videogame_genre } = require("../db");
const { MY_API_KEY } = process.env;
const videogamesRouter = require('./videogames.js')
const genresRouter = require('./genres.js')



const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


router.use('/videogames', videogamesRouter);
router.use('/genres', genresRouter);

module.exports = router;
