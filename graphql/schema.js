const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } = require('graphql');
const { Op } = require('sequelize');
const { Reservation, Terrain } = require('../models');

// Type pour représenter un créneau horaire
const SlotType = new GraphQLObjectType({
  name: 'Slot',
  fields: {
    time: { type: GraphQLString }, // Heure du créneau
    isAvailable: { type: GraphQLBoolean } // Disponibilité
  }
});

// Query pour récupérer les créneaux disponibles
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    availableSlots: {
      type: new GraphQLList(SlotType),
      args: {
        date: { type: new GraphQLNonNull(GraphQLString) }, // Date (format ISO)
        terrain: { type: new GraphQLNonNull(GraphQLString) } // Nom du terrain
      },
      async resolve(parent, args) {
        const { date, terrain } = args;

        // Étape 1 : Vérifier si le terrain existe
        const terrainObj = await Terrain.findOne({ where: { nom: terrain } });
        if (!terrainObj) {
          throw new Error(`Terrain "${terrain}" non trouvé`);
        }

        // Étape 2 : Générer les créneaux pour la journée
        const startTime = new Date(`${date}T10:00:00Z`);
        const endTime = new Date(`${date}T22:00:00Z`);
        const slots = [];

        for (let time = startTime; time < endTime; time.setMinutes(time.getMinutes() + 45)) {
          slots.push(new Date(time).toISOString());
        }

        // Étape 3 : Vérifier les réservations existantes pour ce terrain
        const reservations = await Reservation.findAll({
          where: {
            terrainId: terrainObj.id,
            dateReservation: {
              [Op.gte]: startTime,
              [Op.lt]: endTime
            }
          }
        });

        const reservedSlots = reservations.map(res => res.dateReservation.toISOString());

        // Étape 4 : Retourner la disponibilité des créneaux
        return slots.map(slot => ({
          time: slot,
          isAvailable: !reservedSlots.includes(slot)
        }));
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
