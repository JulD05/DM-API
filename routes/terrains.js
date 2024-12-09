const express = require('express');
const router = express.Router();
const { Terrain } = require('../models');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const terrains = await Terrain.findAll();
    res.status(200).json(terrains);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des terrains' });
  }
});

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

    res.status(200).json({ message: 'Terrain mis à jour avec succès', terrain });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du terrain' });
  }
});

module.exports = router;
