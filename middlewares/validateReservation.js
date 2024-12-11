const { Terrain, Reservation } = require('../models');

const validateReservation = async (req, res, next) => {
  const { terrainId, dateReservation } = req.body;

  const terrain = await Terrain.findByPk(terrainId);
  if (!terrain || !terrain.disponible) {
    return res.status(400).json({ error: 'Le terrain n\'est pas disponible' });
  }

  const reservationDate = new Date(dateReservation);
  const day = reservationDate.getDay();
  const hour = reservationDate.getHours();
  const minutes = reservationDate.getMinutes();

  if (day === 0 || day === 6 && hour < 10 || hour >= 22 || minutes % 45 !== 0) {
    return res.status(400).json({ error: 'Horaire invalide : les réservations sont possibles du lundi au samedi de 10h à 22h, par créneaux de 45 minutes.' });
  }

  const existingReservation = await Reservation.findOne({
    where: {
      terrainId,
      dateReservation,
    },
  });

  if (existingReservation) {
    return res.status(400).json({ error: 'Ce créneau est déjà réservé.' });
  }

  next();
};

module.exports = { validateReservation };
