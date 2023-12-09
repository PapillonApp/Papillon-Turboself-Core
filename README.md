# Module Papillon
## Papillon-Turboself-Core

**Ce module permet la connexion entre l'application Papillon et Turboself.**

## Informations

Le module est exporté vers NPM, il doit donc respecter les règles de codage de NPM et n'enfreindre aucune règle spécifique de ce service ni de Papillon.

### Roadmap
- [x] Structure
  - [X] Connection au compte
  - [x] Communication avec API
- [ ] Fonctionnalitées du module
  - [x] Information sur le compte
  - [ ] Recherche d'étatblissements
  - [x] Informations sur l'établissement attaché au compte
  - [x] Informations sur les réservations
  - [x] Ajout/Suppression d'une réservation
  - [x] Historique de transactions
  - [ ] Information sur le solde
  - [ ] Recupération du QR code
- [ ] Integration dans papillon
  - [ ] Ajout de la connection au compte Turboself
  - [ ] Informations sur le compte
  - [ ] Informations sur l'établissement
  - [ ] Informations sur les réservations
  - [ ] Ajout/Suppression d'une réservation
  - [ ] Historique de transactions
  - [ ] Recupération du QR code
  - [ ] Information sur le solde

### Structure

Le module est structuré de la manière suivante :
- `src/fetch` : Contient les fonctions de récupération des données de l'API d'EcoleDirecte
- `src/session.js` : Contient les fonctions de gestion de la session
- `src/auth.js` : Contient les fonctions d'authentification
- `src/errors.js` : Contient les erreurs pouvant être retournées par le module. *Les erreurs doivent suivre la même structure pour chaque module.*
  
## Utilisation

### Connexion par idenfitiants
```javascript
const TurboSelf = require('papillon-turboself-core')
let ts = new TurboSelf();

ts.login('username', 'password').then(async(e) => {
  let info = await ts.getUserInfo()
  let balance = await ts.getBalance()
	let book = await ts.getBooking()
  success = await ts.setBooking(book.weekId, book.days[0].dayNumber, false)
	console.log(success)
})
```

> **Warning**
> Si le token donné est invalide, le module ne pourra pas en générer un nouveau (par manque d'identifiants) et donnera une erreur de token invalide/expiré

## Documentation
Voir le fichier `DOCUMENTATION.md`
