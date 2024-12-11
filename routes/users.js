// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const { User } = require('../models');
// const { authenticateToken } = require('../middlewares/authMiddleware');
// const { Reservation, Terrain } = require('../models');

// // Endpoint pour s'authentifier
// router.post('/login', async (req, res) => {
//   const { pseudo, password } = req.body;

//   try {
//     console.log('Tentative de connexion pour : ', pseudo);

//     const user = await User.findOne({ where: { pseudo } });
//     if (!user) {
//       console.error('Utilisateur non trouvé');
//       return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect' });
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       console.error('Mot de passe invalide');
//       return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect' });
//     }

//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     console.log('Utilisateur authentifié : ', user.pseudo);

//     res.status(201).json({ jwt: token });
//   } catch (error) {
//     console.error('Erreur interne : ', error);
//     res.status(500).json({ error: 'Erreur interne du serveur' });
//   }
// });

// // Obtenir les détails d’un utilisateur
// router.get('/:id', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id, {
//       attributes: ['id', 'pseudo', 'role', 'createdAt', 'updatedAt']
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'Utilisateur non trouvé' });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error('Erreur lors de la récupération de l’utilisateur :', error);
//     res.status(500).json({ error: 'Erreur interne du serveur' });
//   }
// });

// // Obtenir les réservations d’un utilisateur
// router.get('/:id/reservations', authenticateToken, async (req, res) => {
//   try {
//     const reservations = await Reservation.findAll({
//       where: { userId: req.params.id },
//       include: [
//         { model: Terrain, attributes: ['nom'] }
//       ]
//     });

//     if (reservations.length === 0) {
//       return res.status(404).json({ error: 'Aucune réservation trouvée pour cet utilisateur' });
//     }

//     res.status(200).json(reservations);
//   } catch (error) {
//     console.error('Erreur lors de la récupération des réservations de l’utilisateur :', error);
//     res.status(500).json({ error: 'Erreur interne du serveur' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Reservation, Terrain } = require('../models');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Endpoint pour s'authentifier
router.post('/login', async (req, res) => {
  const { pseudo, password } = req.body;

  try {
    console.log('Tentative de connexion pour : ', pseudo);

    const user = await User.findOne({ where: { pseudo } });
    if (!user) {
      console.error('Utilisateur non trouvé');
      return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.error('Mot de passe invalide');
      return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Utilisateur authentifié : ', user.pseudo);

    const halResponse = {
      jwt: token,
      _links: {
        self: { href: '/users/login' }
      }
    };

    res.status(201).json(halResponse);
  } catch (error) {
    console.error('Erreur interne : ', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les détails d’un utilisateur
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'pseudo', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const halResponse = {
      id: user.id,
      pseudo: user.pseudo,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      _links: {
        self: { href: `/users/${user.id}` },
        reservations: { href: `/users/${user.id}/reservations` }
      }
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de la récupération de l’utilisateur :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir les réservations d’un utilisateur
router.get('/:id/reservations', authenticateToken, async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.params.id },
      include: [
        { model: Terrain, attributes: ['id', 'nom'] }
      ]
    });

    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Aucune réservation trouvée pour cet utilisateur' });
    }

    const halResponse = {
      _links: {
        self: { href: `/users/${req.params.id}/reservations` },
        user: { href: `/users/${req.params.id}` }
      },
      _embedded: {
        reservations: reservations.map(reservation => ({
          id: reservation.id,
          dateReservation: reservation.dateReservation,
          terrain: reservation.Terrain ? reservation.Terrain.nom : null,
          _links: {
            self: { href: `/reservations/${reservation.id}` },
            terrain: reservation.Terrain
              ? { href: `/terrains/${reservation.Terrain.id}` }
              : null
          }
        }))
      }
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations de l’utilisateur :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
