# Module Papillon
## Papillon-Turboself-Core

**Ce module permet la connexion entre l'application Papillon et Turboself.**

## Informations

Le module est exporté vers NPM, il doit donc respecter les règles de codage de NPM et n'enfreindre aucune règle spécifique de ce service ni de Papillon.

### Fonction
[x] Connection au compte

### Structure

Le module est structuré de la manière suivante :
- `src/fetch` : Contient les fonctions de récupération des données de l'API d'EcoleDirecte
- `src/session.js` : Contient les fonctions de gestion de la session
- `src/auth.js` : Contient les fonctions d'authentification
- `src/errors.js` : Contient les erreurs pouvant être retournées par le module. *Les erreurs doivent suivre la même structure pour chaque module.*
  
## Utilisation

### Connexion par idenfitiants
```javascript
const ED = require("papillon-ed-core");
let ed = new ED();

ed.auth.login("username", "password").then(() => {
    let token = ed._token;
    let prenom = ed.student.prenom

    ed.homeworks.fetch().then(homeworks => {
        //Traitement des devoirs
    })
})
.catch(err => { //en cas d'erreur à la connexion
    console.log(err)
})
```

> **Warning**
> Si le token donné est invalide, le module ne pourra pas en générer un nouveau (par manque d'identifiants) et donnera une erreur de token invalide/expiré

## Documentation
Voir le fichier `DOCUMENTATION.md`
