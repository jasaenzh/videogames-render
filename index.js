//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn, Genre } = require('./src/db.js');
const axios = require("axios");
const { MY_API_KEY } = process.env;

// // Con esta funcion cargo la datos del modelo Generos(Genres) antes iniciar el server
function cargarGenres() {
  axios.get(`https://api.rawg.io/api/genres?key=${MY_API_KEY}`).then((respose) => {
    let aux = respose.data.results.map((generos) => {
      const objGenre = {
        id: generos.id,
        name: generos.name,
      };
      return objGenre;
    });
    aux.forEach(async (video) => {
      try {
        await Genre.findOrCreate({
          where: video
        })
      } catch (error) {
        console.log(error)
      }
    })
  })
}

// Syncing all the models at once.
conn.sync({ force: false }).then(async () => {

  // //Cargar la base de datos Generos
  await cargarGenres();

  server.listen(3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
});



