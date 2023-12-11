# Documentation
## Sommaire
- Installation
- Gestion des erreurs
- Fonctions
	- login()
	- getUserInfo()
	- getHome()
	- getBooking()
	- setBooking()
	- getHistory()
	- getBalance()
	- canBookEvening()
	- getEtabInfo()


## Installation
With NPM :
<br>`npm install papillon-turboself-core`
## Gestion des erreurs
Chaque réponse retourner de ce package retourne la même forme de réponse.
```json
{
  error: false, //BOOL : Y'a t'il une erreur
  errorMessage: '', //STRING : Raison de l'erreur (vide si il y a pas d'erreur)
  data: {
	...
  }
}
```
## Fonctions
### login()
**Description:**<br>
Permet de se connecter au service MyTurboself
<br><br>**Paramètres:**<br>
```javascript
login(username, password)
```
**Exemple:**<br>
```javascript
const TurboSelf = require('papillon-turboself-core')
let ts = new TurboSelf();

async function main() {
	let result = await ts.login('username@mail.com', 'Password1234')
	console.log(result)
}

main()
```
**Retour:**<br>
```json
{
  error: false,
  errorMessage: '',
  data: {
    token: 'XXXXXXXXXXXX...',
    userId: XXXXXXX,
    etabId: XXXXXX
  }
}
```

### getUserInfo()
**Description:**<br>
Obtient les informations de l'utilisateur connecté
<br><br>**Paramètres:**<br>
```javascript
getUserInfo()
```
**Exemple:**<br>
```javascript
const TurboSelf = require('papillon-turboself-core')
let ts = new TurboSelf();

async function main() {
	await ts.login('username@mail.com', 'Password1234')
	let result = ts.getUserInfo()
	console.log(result)
}

main()
```
**Retour:**<br>
```json
{
  error: false,
  errorMessage: '',
  data: {
    id: XXXXXX,
    origId: XXXXX,
    type: 0,
    lastName: 'Doe',
    firstName: 'Jonh',
    class: 'CE1',
    method: 'Argent',
    quality: 'TICKET',
    authorization: {
		pay: true,
		book: true,
		cafeteria: false
	},
    lastSync: '20XX-XX-XXTXX:XX:XX.XXXZ',
    disabled: false,
    isPasswordSecure: true,
    cardData: null
  }
}
```

### getHome()
**Description:**<br>
Obtient l'écran d'acceuil de l'utilisateur connecté
<br><br>**Paramètres:**<br>
```javascript
getHome()
```
**Exemple:**<br>
```javascript
const TurboSelf = require('papillon-turboself-core')
let ts = new TurboSelf();

async function main() {
	await ts.login('username@mail.com', 'Password1234')
	let result = ts.getHome()
	console.log(result)
}

main()
```
**Retour:**<br>
```json
{
  error: false,
  errorMessage: '',
  data: {
    userInfo: {
      id: 'XXXXXXXXXX',
      balance: -10.5,
      estimatedBalance: -150.10,
      estimatedFor: '20XX-XX-XX'
    },
    history: [
      {
        id: XXXXXXXXX,
        name: 'Self',
        date: '20XX-XX-XXTXX:XX:XX.000Z',
        cost: -40.8
      },
      ...
	]
  }
}
```

### getBooking()
**Description:**<br>
Obtient les réservations d'une semaine de l'utilisateur connecté
<br><br>**Paramètres:**<br>
```javascript
getBooking(date = new Date())
```
**Exemple:**<br>
```javascript
const TurboSelf = require('papillon-turboself-core')
let ts = new TurboSelf();

async function main() {
	await ts.login('username@mail.com', 'Password1234')
	let result = ts.getBooking()
	console.log(result)
}

main()
```
**Retour:**<br>
```json
{
  error: false,
  errorMessage: '',
  data: {
    weekId: 'XXXXXXXXXXX',
    days: [
      {
        id: 'XXXXXXXXXXX',
        dayNumber: 1, //(1: Lundi, 5: Vendredi)
        booked: true,
        lastSyncBooked: 1,
        canEdit: false,
        label: 'Lundi 11 Déc.',
        date: '11-12-2023'
      },
      ...
    ]
  }
}
```

### setBooking()
**Description:**<br>
Défini une réservation de l'utilisateur connecté
<br><br>**Paramètres:**<br>
```javascript
setBooking(weekId : Int, dayNumber : Int, booked : Bool)
```
**Exemple:**<br>
```javascript
const TurboSelf = require('papillon-turboself-core')
let ts = new TurboSelf();

async function main() {
	await ts.login('username@mail.com', 'Password1234')
	let result = ts.setBooking(XXXXXXXXXXX, 3 (Mercredi), false)
	console.log(result)
}

main()
```
**Retour:**<br>
```json
{
  error: false,
  errorMessage: '',
  data: {
	id: 'XXXXXXXXXXX',
	dayNumber: 3,
	booked: false
  }
}
```