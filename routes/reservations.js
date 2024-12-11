// const express = require('express');
// const router = express.Router();
// const { Reservation } = require('../models');
// const { authenticateToken } = require('../middlewares/authMiddleware');
// const { validateReservation } = require('../middlewares/validateReservation');
// const { User, Terrain } = require('../models');

// // Obtenir la liste des réservations
// router.get('/', async (req, res) => {
//   try {
//     const reservations = await Reservation.findAll();
//     res.status(200).json(reservations);
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
//   }
// });

// // Ajouter une réservation
// router.post('/', authenticateToken, validateReservation, async (req, res) => {
//   try {
//     const { terrainId, dateReservation } = req.body;
//     const userId = req.user.id;

//     const reservation = await Reservation.create({ userId, terrainId, dateReservation });
//     res.status(201).json({ message: 'Réservation créée avec succès', reservation });
//   } catch (error) {
//     console.error('Erreur lors de la création de la réservation:', error);
//     res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
//   }
// });

// // Supprimer une réservation
// router.delete('/:id', async (req, res) => {
//   try {
//     const reservation = await Reservation.findByPk(req.params.id);

//     if (!reservation) {
//       return res.status(404).json({ error: 'Réservation non trouvée' });
//     }

//     await reservation.destroy();
//     res.status(200).json({ message: 'Réservation annulée avec succès' });
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur lors de l\'annulation de la réservation' });
//   }
// });

// // Obtenir les détails d’une réservation
// router.get('/:id', authenticateToken, async (req, res) => {
//   try {
//     const reservation = await Reservation.findByPk(req.params.id, {
//       include: [
//         { model: User, attributes: ['pseudo'] },
//         { model: Terrain, attributes: ['nom'] }
//       ]
//     });

//     if (!reservation) {
//       return res.status(404).json({ error: 'Réservation non trouvée' });
//     }

//     res.status(200).json(reservation);
//   } catch (error) {
//     console.error('Erreur lors de la récupération de la réservation :', error);
//     res.status(500).json({ error: 'Erreur interne du serveur' });
//   }
// });

// // Modifier une réservation
// router.put('/:id', authenticateToken, validateReservation, async (req, res) => {
//   try {
//     const { terrainId, dateReservation } = req.body;

//     const reservation = await Reservation.findByPk(req.params.id);

//     if (!reservation) {
//       return res.status(404).json({ error: 'Réservation non trouvée' });
//     }

//     reservation.terrainId = terrainId;
//     reservation.dateReservation = dateReservation;
//     await reservation.save();

//     res.status(200).json({ message: 'Réservation modifiée avec succès', reservation });
//   } catch (error) {
//     console.error('Erreur lors de la modification de la réservation :', error);
//     res.status(500).json({ error: 'Erreur interne du serveur' });
//   }
// });


// module.exports = router;

const express = require('express');
const router = express.Router();
const { Reservation, User, Terrain } = require('../models');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { validateReservation } = require('../middlewares/validateReservation');

// Obtenir la liste des réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: User, attributes: ['id', 'pseudo'] },
        { model: Terrain, attributes: ['id', 'nom'] }
      ]
    });

    const halResponse = {
      _links: {
        self: { href: '/reservations' }
      },
      _embedded: {
        reservations: reservations.map(reservation => ({
          id: reservation.id,
          dateReservation: reservation.dateReservation,
          _links: {
            self: { href: `/reservations/${reservation.id}` },
            user: { href: `/users/${reservation.userId}` },
            terrain: { href: `/terrains/${reservation.terrainId}` }
          }
        }))
      }
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Ajouter une réservation
router.post('/', authenticateToken, validateReservation, async (req, res) => {
  try {
    const { terrainId, dateReservation } = req.body;
    const userId = req.user.id;

    const reservation = await Reservation.create({ userId, terrainId, dateReservation });

    const halResponse = {
      message: 'Réservation créée avec succès',
      _links: {
        self: { href: `/reservations/${reservation.id}` },
        user: { href: `/users/${userId}` },
        terrain: { href: `/terrains/${terrainId}` }
      },
      reservation: {
        id: reservation.id,
        dateReservation: reservation.dateReservation
      }
    };

    res.status(201).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de la création de la réservation :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
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

    const halResponse = {
      message: 'Réservation annulée avec succès',
      _links: {
        self: { href: `/reservations/${req.params.id}` }
      }
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les détails d’une réservation
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'pseudo'] },
        { model: Terrain, attributes: ['id', 'nom'] }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    const halResponse = {
      id: reservation.id,
      dateReservation: reservation.dateReservation,
      _links: {
        self: { href: `/reservations/${reservation.id}` },
        user: { href: `/users/${reservation.userId}` },
        terrain: { href: `/terrains/${reservation.terrainId}` }
      }
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Modifier une réservation
router.put('/:id', authenticateToken, validateReservation, async (req, res) => {
  try {
    const { terrainId, dateReservation } = req.body;

    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    reservation.terrainId = terrainId;
    reservation.dateReservation = dateReservation;
    await reservation.save();

    const halResponse = {
      message: 'Réservation modifiée avec succès',
      _links: {
        self: { href: `/reservations/${reservation.id}` },
        user: { href: `/users/${reservation.userId}` },
        terrain: { href: `/terrains/${reservation.terrainId}` }
      },
      reservation: {
        id: reservation.id,
        dateReservation: reservation.dateReservation
      }
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de la modification de la réservation :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
