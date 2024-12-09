const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('./openapi.yaml');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Démarrage du serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
  console.log('Documentation disponible sur http://localhost:3000/api-docs');
});