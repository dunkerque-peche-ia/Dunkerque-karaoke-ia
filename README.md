# Karaoke IA Finder (Bray-Dunes & Gravelines)

Cette application est un moteur de recherche intelligent de soirées karaoké pour les villes de **Bray-Dunes**, **Gravelines** et alentours (Dunkerque). Elle utilise une interface moderne néon et propose un chatbot IA connecté facultativement à l'API Gemini.

## Fonctionnalités

1. **Assistant IA (Chatbot)** :
   - Fonctionne par défaut via un algorithme d'analyse sémantique local.
   - Peut se connecter à l'API officielle Google Gemini (1.5 Flash) si une clé API est fournie dans l'interface.
2. **Carte Interactive** :
   - Cartographie des événements via Leaflet.js (thème sombre).
3. **Filtres de Soirées** :
   - Filtrage instantané par ville et par date.
4. **Formulaire d'ajout** :
   - Possibilité de soumettre de nouvelles soirées karaoké (sauvegardées en local).

## Installation et Lancement

Ouvrez simplement le fichier `index.html` dans n'importe quel navigateur web moderne. Vous pouvez également lancer un serveur de développement local :

```bash
# Exemple avec Python
python -m http.server 8000
```
