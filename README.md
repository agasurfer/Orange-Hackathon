🚨 Hackathon Orange - Build For a Better World 🚨

Description

Ce projet a été développé lors d'un hackathon de 5 jours proposé par Orange avec pour objectif de créer une application sociale de protection des personnes âgées. L'application utilise le stockage local pour simuler un backend, ainsi que des services API tels que l'API de localisation d'Orange et Google Maps pour recueillir des positions géographiques. L'application surveille les déplacements pour alerter les personnes de contact si la position reste stable pendant une période donnée.
Objectif du Projet

L'application se concentre sur la sécurité des personnes âgées en surveillant leurs positions à intervalles réguliers. En cas de stagnation de la position pendant une période déterminée, l'application envoie une alerte à 3 contacts enregistrés. 🚨

PS: Le code a été un peu modifié pour supprimer quelques données sensibles mais la structure reste la même.

🛠️ Fonctionnalités principales

📍 Suivi des positions : Collecte des positions géographiques via l'API de localisation d'Orange ou Google Maps.

💾 Stockage local des positions : Utilisation du local storage pour simuler un backend, stockant uniquement les 4 
dernières positions par souci de confidentialité.

⚠️ Alerte automatique : Envoie une alerte aux 3 contacts en cas de stagnation des positions après 4 checks successifs.

🚀 Technologies Utilisées

HTML5 : Structure de base du site web.
CSS : Styling de l'interface utilisateur.
JavaScript : Logique d'interaction et de manipulation des données.
Local Storage : Stockage local pour gérer les données (simule un backend).
API d'Orange : API de localisation pour récupérer les positions géographiques.
Google Maps API : API pour afficher et interagir avec les positions sur une carte.

🌐 Architecture du Projet

Collecte de positions :
        Les positions géographiques sont collectées via l'API d'Orange ou Google Maps.
        Stockage local des 4 dernières positions pour des raisons de confidentialité.

⚠️ Alerte :
        Si une position reste inchangée pendant 4 checks successifs, une alerte est envoyée aux 3 contacts enregistrés.
