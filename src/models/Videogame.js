const { DataTypes, Sequelize } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  //UUID Da un ID que se auto enumera (Random)
  sequelize.define('videogame',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      released: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
      },
      rating: {
        type: DataTypes.FLOAT,
      },
      platforms: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      background_image: {
        type: DataTypes.TEXT,
        defaultValue: "https://serviciopad.es/wp-content/uploads/estudio-revela-que-estadounidenses-gastan-cada-vez-mas-en-videojuegos-02-e1445888221548.jpeg"
      },
      createByUs: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }
    },
    { timestamps: false }
  );
};
