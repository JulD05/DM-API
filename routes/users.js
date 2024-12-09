const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

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

    res.status(201).json({ jwt: token });
  } catch (error) {
    console.error('Erreur interne : ', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
