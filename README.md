# DM-API

## Décomposition des données en ressources
1. MCD réalisé avec looping - mcd.loo

2. Dictionnaire des données - api-conception.ods

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/JulD05/DM-API.git

2. Accédez au répertoire du projet
    ```bash
    cd DM-API

3. Installez les dépendances :
    ```bash
    npm install

4. Configurez la base de données dans un fichier .env:
    -Créez un fichier .env à la racine du projet
    -Ajoutez les informations suivantes selon la configuration: 
    ```bash
    DB_USERNAME=root
    DB_PASSWORD=votre_mot_de_passe
    DB_DATABASE=api_reservations
    DB_HOST=127.0.0.1
    DB_DIALECT=mysql
    JWT_SECRET=votre_secret
    
5. Initialisez Sequelize:
    ```bash
    npx sequelize-cli init

6. Créez la base de données

7. Appliquez les migrations
Pour créer les tables utiles en base, j'ai réalisé au préalable les migrations. 
    ```bash
    npx sequelize-cli db:migrate

8. Ajoutez les seeders
Pour obtenir des données en résultat, j'ai réalisé des seeders avec un jeu de données de test au préalable. Cette commmande permettra d'ajouté le jeu de données.
    ```bash
    npx sequelize-cli db:seed:all

9. Lancez le serveur
    ```bash
    node app.js

## Tester l'API
Utilisez CURL (ou Postman) pour tester l'API.
1. Authentification
Route: POST /users/login
    ```bash
    curl -X POST http://localhost:3000/users/login \
    -H "Content-Type: application/json" \
    -d '{
    "pseudo": "admybad",
    "password": "astrongpassword"
    }'

2. Obtenir les détails d'un utilisateur
Route: GET /users/:id
    ```bash
    curl -X GET http://localhost:3000/users/1 \
    -H "Authorization: Bearer <votre_jwt>"

3. Obtenir les réservations d'un utilisateur
Route: GET /users/:id/reservations
    ```bash
    curl -X GET http://localhost:3000/users/1/reservations \
    -H "Authorization: Bearer <votre_jwt>"

4. Liste des terrains
Route: GET /terrains
    ```bash
    curl -X GET http://localhost:3000/terrains \
    -H "Authorization: Bearer <votre_jwt>"

5. Obtenir les détails d'un terrain
Route: GET /terrains/:id
    ```bash
    curl -X GET http://localhost:3000/terrains/1 \
    -H "Authorization: Bearer <votre_jwt>"

6. Modifier la disponibilité d'un terrain
Route: PUT /terrains/:id
    ```bash
    curl -X PUT http://localhost:3000/terrains/1 \
    -H "Authorization: Bearer <votre_jwt>" \
    -H "Content-Type: application/json" \
    -d '{
      "disponible": false,
      "raisonIndisponibilite": "Maintenance"
    }'

7. Créer une réservation
Route: POST /reservations
    ```bash
    curl -X POST http://localhost:3000/reservations \
    -H "Authorization: Bearer <votre_jwt>" \
    -H "Content-Type: application/json" \
    -d '{
      "terrainId": 1,
      "dateReservation": "2024-11-27T10:00:00Z"
    }'

8. Liste des réservations
Route: GET /reservations
    ```bash
    curl -X GET http://localhost:3000/reservations \
    -H "Authorization: Bearer <votre_jwt>"

9. Obtenir les détails d'une réservation
Route: GET /reservations/:id
    ```bash
    curl -X GET http://localhost:3000/reservations/1 \
    -H "Authorization: Bearer <votre_jwt>"

10. Modifier une réservation
Route: PUT /reservations/:id
    ```bash
    curl -X PUT http://localhost:3000/reservations/1 \
    -H "Authorization: Bearer <votre_jwt>" \
    -H "Content-Type: application/json" \
    -d '{
    "terrainId": 2,
    "dateReservation": "2024-11-27T15:45:00Z"
    }'

11. Supprimer une réservation
Route: DELETE /reservations/:id
    ```bash
    curl -X DELETE http://localhost:3000/reservations/1 \
    -H "Authorization: Bearer <votre_jwt>"

12. Requête pour les créneaux disponibles avec Postman (GraphQL)
Route: POST http://localhost:3000/graphql
Header:
    | Colonne 1     | Colonne 2           |
    |---------------|---------------------|
    | Content-Type  | application/json    |
    | Authorization | Bearer <votre_token>|

Body en JSON:
    ```bash
    {
        "query": "query { availableSlots(date: \"2024-11-27\", terrain: \"A\") { time isAvailable } }"
    }

