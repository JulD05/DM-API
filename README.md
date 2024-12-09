# DM-API

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/JulD05/DM-API.git

2. Accédez au répertoire du projet

3. Installez les dépendances :
    ```bash
    npm install

4. Configurez la base de données dans un fichier .env:
    -Créez un fichier .env à la racine du projet
    -Ajoutez les informations suivantes selon la configuration:
        ```bash
        DB_USERNAME=root
        DB_PASSWORD=votre_mot_de_passe
        DB_DATABASE=badminton_reservations
        DB_HOST=127.0.0.1
        DB_DIALECT=mysql
    
5. Initialisez Sequelize:
    ```bash
    npx sequelize-cli init

6. Créez la base de données

7. Appliquez les migrations
    ```bash
    npx sequelize-cli db:migrate