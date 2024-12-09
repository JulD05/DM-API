module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Nom de la table associée
          key: 'id'
        }
      },
      terrainId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'terrains', // Nom de la table associée
          key: 'id'
        }
      },
      dateReservation: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'reservations', // Nom exact de la table dans la base de données
      timestamps: true // Inclut les colonnes createdAt et updatedAt
    });
  
    return Reservation;
  };
  