# Module Papillon
## Papillon-Turboself-Core

**Ce module permet la connexion entre l'application Papillon et Turboself.**

## Informations

Le module est exporté vers NPM, il doit donc respecter les règles de codage de NPM et n'enfreindre aucune règle spécifique de ce service ni de Papillon.

### Roadmap
- [x] Structure
  - [X] Connection au compte
  - [x] Communication avec API
- [ ] Fonctionnalités du module
  - [x] Information sur le compte
  - [ ] Recherche d'établissements
  - [x] Informations sur l'établissement attaché au compte
  - [x] Informations sur les réservations
  - [x] Ajout/Suppression d'une réservation
  - [x] Historique de transactions
  - [ ] Information sur le solde
  - [ ] Récupération du QR code
- [ ] Integration dans Papillon
  - [ ] Ajout de la connection au compte Turboself
  - [ ] Informations sur le compte
  - [ ] Informations sur l'établissement
  - [ ] Informations sur les réservations
  - [ ] Ajout/Suppression d'une réservation
  - [ ] Historique de transactions
  - [ ] Récupération du QR code
  - [ ] Ajout du QR dans dans Apple Carte (Wallet)
  - [ ] Ajout du QR dans dans Google Wallet
  - [ ] Ajout du QR dans dans Samsung Wallet
  - [ ] Information sur le solde

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
