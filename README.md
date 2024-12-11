# DM-API

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

10. Utilisez Postman (ou curl) pour tester l'API

