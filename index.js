const baseURL = 'https://api-rest-prod.incb.fr/api/'

function capitalize(string) {
	let words = string.split(" ")
	var result = ""
	words.forEach((word) => {
		result += word.charAt(0).toUpperCase() + word.toLowerCase().slice(1) + ' '
	})
	return result.slice(0, -1);
}

function makeReturnJSON(err, errMessage, data) {
	return {error: err, errorMessage: errMessage, data: data}
}

function NullIfNotExist(value) {
	if (value == undefined) {
		return null
	}
	return value
}

class Session {
	constructor() {
		this._token = null;
		this.isLoggedIn = false;

		this.userId = null;
		this.etabId = null;
	}


	async login(username, password) {
		var res = await fetch(baseURL + 'v1/auth/login',
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({username: username, password: password})
			})
		var data = await res.json()

		if (data.access_token !== undefined) {
			this._token = data.access_token
			this.userId = data.userId
			this.etabId = data.hoteId
			this.isLoggedIn = true
			return makeReturnJSON(false, '', {token: data.access_token, userId: data.userId, etabId: data.hoteId})
		} else {
			if (data.message == 'Unauthorized') {
				return makeReturnJSON(true, 'Username or password is not in good format', {})
			}
			if (data.message == 'Accès interdit') {
				return makeReturnJSON(true, 'Your username or password as invalid', {})
			}
			return makeReturnJSON(true, 'Unkown error', {})
		}

	}

	async getUserInfo() {
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v1/hotes/' + this.etabId, {
				method: "GET",
				headers: {"Authorization": "Bearer " + this._token}
			})
			var data = await res.json()
			return makeReturnJSON(false, '', {
				id: data.id,
				origId: data.idOrig,
				type: data.type,
				lastName: capitalize(data.nom),
				firstName: capitalize(data.prenom),
				class: data.division,
				method: data.mode,
				quality: data.qualite,
				authorization: {
					pay: data.droitPaiement,
					book: data.droitReservation,
					cafeteria: data.droitCafeteria
				},
				lastSync: data.dateDernSynchro,
				disabled: data.desactive,
				isPasswordSecure: data.mdpPrive,
				cardData: data.carteCodee
			})
		} else {
			return makeReturnJSON(true, 'You\'re not logged in !', {})
		}
	}

	async getHome() {
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v2/hotes/' + this.etabId + '/accueil', {
				method: "GET",
				headers: {"Authorization": "Bearer " + this._token}
			})
			var data = await res.json()
			var array = []
			data.historiques.forEach((hist) => {
				var val = 0
				if (hist.credit != undefined) {
					val = hist.credit / 100
				} else {
					val = (hist.debit / 100) * -1
				}
				array.push({id: hist.id, name: hist.detail, date: hist.date, cost: val})
			})
			return makeReturnJSON(false, '', {
				userInfo: {
					id: data.comptesHote[0]?.id ?? null,
					balance: data.comptesHote[0]?.montant / 100 ?? 0,
					estimatedBalance: data.comptesHote[0]?.montantEstime / 100 ?? 0,
					estimatedFor: data.comptesHote[0]?.montantEstimeMsg.replace('Montant estimé au ', '').replaceAll('/', '.').replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1') ?? '00-00-0000',
				},
				history: array
			})
		} else {
			return makeReturnJSON(true, 'You\'re not logged in !', {})
		}
	}

	async getBooking(date = new Date()) {
		if (date.getDay() == 6 || date.getDay() == 0) {
			while (date.getDay() != 1) {
				date.setDate(date.getDate() + 1)
			}
		} else {
			while (date.getDay() != 1) {
				date.setDate(date.getDate() - 1)
			}
		}
		let strDate = ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v1/reservations/hotes/' + this.etabId + '/semaines?date=' + strDate, {
				method: "GET",
				headers: {"Authorization": "Bearer " + this._token}
			})
			var data = await res.json()
			var array = []
			var weekId = 0
			if (data.rsvWebDto[0] != undefined) {
				data.rsvWebDto[0].jours.forEach((day) => {
					var booked = false
					if (day.dayReserv == 1) {
						booked = true
					}
					array.push({
						id: day.id,
						dayNumber: day.dayOfWeek,
						booked: booked,
						lastSyncBooked: day.reservDernSynchro,
						canEdit: day.autorise,
						label: capitalize(day.dayLabel).replace('. ', ''),
						date: ("0" + (date.getDate() + (day.dayOfWeek - 1))).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()
					})
				})
				weekId = data.rsvWebDto[0].id
			}

			return makeReturnJSON(false, '', {weekId: weekId, days: array})
		} else {
			return makeReturnJSON(true, 'You\'re not logged in !', {})
		}
	}

	async setBooking(weekId, dayNumber, booked) {
		if (this.isLoggedIn) {
			var bookedId = 0
			if (booked == true) {
				bookedId = 1
			}
			var res = await fetch(baseURL + 'v2/hotes/' + this.etabId + '/reservations-jours', {
				method: "POST",
				headers: {"Content-Type": "application/json", "Authorization": "Bearer " + this._token},
				body: JSON.stringify({dayOfWeek: dayNumber, dayReserv: bookedId, web: {id: weekId}})
			})
			var data = await res.json()
			if (data.statusCode != undefined) {
				return makeReturnJSON(true, data.message, {})
			}
			return makeReturnJSON(false, '', {
				id: null,
				dayNumber: data.dayOfWeek,
				booked: booked
			})
		} else {
			return makeReturnJSON(true, 'You\'re not logged in !', {})
		}
	}

	async getHistory() {
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v1/historiques/hotes/' + this.etabId, {
				method: "GET",
				headers: {"Authorization": "Bearer " + this._token}
			})
			var data = await res.json()
			var array = []
			data.forEach((hist) => {
				var val = 0
				if (hist.credit != undefined) {
					val = hist.credit / 100
				} else {
					val = (hist.debit / 100) * -1
				}
				array.push({id: hist.id, name: hist.detail, cost: val, date: hist.date})
			})
			return makeReturnJSON(false, '', array)
		} else {
			return makeReturnJSON(true, 'You\'re not logged in !', [])
		}
	}

	async getBalance() {
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v1/comptes/hotes/' + this.etabId + '/3', {
				method: "GET",
				headers: {"Authorization": "Bearer " + this._token}
			})
			var data = await res.json()
			return makeReturnJSON(false, '', {
				id: data[0]?.id ?? null,
				balance: data[0]?.montant / 100 ?? 0,
				estimatedBalance: data[0]?.montantEstime / 100 ?? 0,
				estimatedFor: data[0]?.montantEstimeMsg.replace('Montant estimé au ', '').replaceAll('/', '.').replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1') ?? '00-00-0000',
			})
		} else {
			return makeReturnJSON(true, 'You\'re not logged in !', [])
		}
	}

	async canBookEvening() {
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v1/hotes/' + this.etabId + '/resa-soir', {
				method: "GET",
				headers: {"Authorization": "Bearer " + this._token}
			})
			var data = await res.text()
			if (data == 'false') {
				return makeReturnJSON(false, '', false)
			} else {
				return makeReturnJSON(false, '', true)
			}
		} else {
			return makeReturnJSON(true, 'You\'re not logged in !', null)
		}
	}

	async getEtabInfo() {
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v1/hotes/' + this.etabId, {
				method: "GET",
				headers: {"Authorization": "Bearer " + this._token}
			})
			var data = await res.json()
			return makeReturnJSON(false, '', {
				id: data.etab.id,
				TSid: data.etab.idTurboself,
				code2p5: data.etab.code2p5,
				name: capitalize(data.etab.nom),
				version: data.etab.versionTS,
				disabled: data.etab.desactive,
				symbol: data.etab.currencySymbol,
				prixDej: data.prixDej / 100,
				minCreditAdd: data.etab.configuration.montantCreditMini / 100,
				address: {
					line1: capitalize(data.etab.adr1),
					line2: capitalize(data.etab.adr2),
					postalCode: data.etab.cp,
					city: capitalize(data.etab.ville),
				},
				contact: {
					url: data.etab.configuration.url,
					email: data.etab.configuration.email,
					tel: data.etab.tel,
				},
				sync: {
					first: data.etab.datePremSynchro,
					last: data.etab.dateDernSynchro
				}
			})
		} else {
			return makeReturnJSON(true, 'You\'re not logged in !', {})
		}
	}
}

module.exports = Session
