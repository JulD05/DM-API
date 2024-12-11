// const express = require('express');
// const router = express.Router();
// const { Terrain } = require('../models');
// const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');


// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const terrains = await Terrain.findAll();
//     res.status(200).json(terrains);
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur lors de la récupération des terrains' });
//   }
// });

// router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
//   try {
//     const { disponible, raisonIndisponibilite } = req.body;
//     const terrain = await Terrain.findByPk(req.params.id);

//     if (!terrain) {
//       return res.status(404).json({ error: 'Terrain non trouvé' });
//     }

//     terrain.disponible = disponible;
//     terrain.raisonIndisponibilite = disponible ? null : raisonIndisponibilite;
//     await terrain.save();

//     res.status(200).json({ message: 'Terrain mis à jour avec succès', terrain });
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur lors de la mise à jour du terrain' });
//   }
// });

// router.get('/:id', authenticateToken, async (req, res) => {
//   try {
//     const terrain = await Terrain.findByPk(req.params.id, {
//       attributes: ['id', 'nom', 'disponible', 'raisonIndisponibilite', 'createdAt', 'updatedAt']
//     });

//     if (!terrain) {
//       return res.status(404).json({ error: 'Terrain non trouvé' });
//     }

//     res.status(200).json(terrain);
//   } catch (error) {
//     console.error('Erreur lors de la récupération du terrain :', error);
//     res.status(500).json({ error: 'Erreur interne du serveur' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { Terrain } = require('../models');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

// Obtenir la liste des terrains
router.get('/', authenticateToken, async (req, res) => {
  try {
    const terrains = await Terrain.findAll();

    const halResponse = {
      _links: {
        self: { href: '/terrains' }
      },
      _embedded: {
        terrains: terrains.map(terrain => ({
          id: terrain.id,
          nom: terrain.nom,
          disponible: terrain.disponible,
          raisonIndisponibilite: terrain.raisonIndisponibilite,
          _links: {
            self: { href: `/terrains/${terrain.id}` }
          }
        }))
      }
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de la récupération des terrains :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Modifier la disponibilité d'un terrain
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { disponible, raisonIndisponibilite } = req.body;
    const terrain = await Terrain.findByPk(req.params.id);

    if (!terrain) {
      return res.status(404).json({ error: 'Terrain non trouvé' });
    }

    terrain.disponible = disponible;
    terrain.raisonIndisponibilite = disponible ? null : raisonIndisponibilite;
    await terrain.save();

    const halResponse = {
      message: 'Terrain mis à jour avec succès',
      _links: {
        self: { href: `/terrains/${terrain.id}` }
      },
      terrain: {
        id: terrain.id,
        nom: terrain.nom,
        disponible: terrain.disponible,
        raisonIndisponibilite: terrain.raisonIndisponibilite
      }
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du terrain :', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du terrain' });
  }
});

// Obtenir les détails d'un terrain
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const terrain = await Terrain.findByPk(req.params.id, {
      attributes: ['id', 'nom', 'disponible', 'raisonIndisponibilite', 'createdAt', 'updatedAt']
    });

    if (!terrain) {
      return res.status(404).json({ error: 'Terrain non trouvé' });
    }

    const halResponse = {
      id: terrain.id,
      nom: terrain.nom,
      disponible: terrain.disponible,
      raisonIndisponibilite: terrain.raisonIndisponibilite,
      createdAt: terrain.createdAt,
      updatedAt: terrain.updatedAt,
      _links: {
        self: { href: `/terrains/${terrain.id}` }
      }
    };

    res.status(200).json(halResponse);
  } catch (error) {
    console.error('Erreur lors de la récupération du terrain :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
