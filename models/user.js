module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      'User',
      {
        pseudo: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            len: [3, 50],
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [['admin', 'user']],
          },
        },
      },
      {
        tableName: 'users',
        timestamps: true,
      }
    );
  
    return User;
  };
  