# Module Papillon
## Papillon-Turboself-Core

**Ce module permet la connexion entre l'application Papillon et Turboself.**

## ℹ️ Informations

Le module est exporté vers NPM, il doit donc respecter les règles de codage de NPM et n'enfreindre aucune règle spécifique de ce service ni de Papillon.

### ⌛️ Roadmap
- [x] Structure
  - [X] Connection au compte
  - [x] Communication avec API
- [X] Fonctionnalités du module
  - [x] Connexion au compte
  - [x] Information sur l'utilisateur
  - [x] Obtention de l'accueil
  - [x] Obtention des réservations de la semaine
  - [x] Définir des réservations de la semaine
  - [x] Obtenir l'historique complet de transaction
  - [x] Obtenir les informations du solde
  - [x] Obtenir les informations de réservation du soir
  - [x] Obtenir les informations de l'établissement
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

## 🔧 Utilisation

### Connexion par idenfitiants
```javascript
const TurboSelf = require('papillon-turboself-core')
let ts = new TurboSelf();

async function main() {
  let result = await ts.login('username@mail.com', 'Password1234')
  console.log(result)
}

main()
```

> **⚠️ Attention**
> Certaines fonctions peuvent ne pas bien fonctionner en fonction de votre établissement et des autorisations fournis par votre établissement. L'échantillon d'établissement ayant permis la création de ce module est bien trop faible pour faire une promesse de fonctionnement.

## 📖 Documentation
Voir le fichier `DOCUMENTATION.md`
