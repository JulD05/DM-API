const express = require('express');
const router = express.Router();
const { Reservation } = require('../models');

// Obtenir la liste des réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// Ajouter une réservation
router.post('/', async (req, res) => {
  try {
    const { userId, terrainId, dateReservation } = req.body;

    const reservation = await Reservation.create({ userId, terrainId, dateReservation });
    res.status(201).json({ message: 'Réservation créée avec succès', reservation });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// Supprimer une réservation
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    await reservation.destroy();
    res.status(200).json({ message: 'Réservation annulée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'annulation de la réservation' });
  }
});

module.exports = router;
