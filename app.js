const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('./openapi.yaml');
const schema = require('./graphql/schema');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();


const usersRouter = require('./routes/users');
const terrainsRouter = require('./routes/terrains');
const reservationsRouter = require('./routes/reservations');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/users', usersRouter);
app.use('/terrains', terrainsRouter);
app.use('/reservations', reservationsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Route GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true // Active l'interface GraphiQL pour tester les requêtes
}));

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
  console.log('Documentation disponible sur http://localhost:3000/api-docs');
});