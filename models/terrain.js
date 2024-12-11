module.exports = (sequelize, DataTypes) => {
    const Terrain = sequelize.define('Terrain', {
      nom: {
        type: DataTypes.STRING,
        allowNull: false
      },
      disponible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      raisonIndisponibilite: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      tableName: 'terrains', // Nom exact de la table dans la base de données
      timestamps: true // Inclut les colonnes createdAt et updatedAt
    });

    Terrain.associate = (models) => {
      Terrain.hasMany(models.Reservation, { foreignKey: 'terrainId' });
    };
  
    return Terrain;
  };
  