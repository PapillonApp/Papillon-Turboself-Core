const baseURL = 'https://api-rest-prod.incb.fr/api/'

function capitalize(string) {
	let words = string.split(" ")
	var result = ""
	words.forEach((word) => {
		result += word.charAt(0).toUpperCase() + word.toLowerCase().slice(1) + ' '
	})
	return result;
}

class Session {
	constructor() {
		this._token = null;
		this.isLoggedIn = false;
		
		this.userId = null;
		this.etabId = null;
	}
	
	async login(username, password) {
		var res = await fetch(baseURL + 'v1/auth/login', {method: "POST",headers: {"Content-Type": "application/json",},body: JSON.stringify({username: username,password: password})})
		var data = await res.json()
		if (data.access_token !== undefined) {
			this._token = data.access_token
			this.userId = data.userId
			this.etabId = data.hoteId
			this.isLoggedIn = true
			return {error: false,errorMessage: '', data:{token: data.access_token, userId: data.userId, etabId: data.hoteId}}
		} else {
			return {error: false,errorMessage: 'Invalid credentials', data:{}}
		}
		
	}
	
	async getBalance() {
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v2/hotes/' + this.etabId + '/accueil', {method: "GET",headers: {"Authorization": "Bearer " + this._token}})
			var data = await res.json()
			var array = []
			data.historiques.forEach((hist)=>{
				var val = 0
				if (hist.credit != undefined) {
					val = hist.credit/100
				} else {
					val = (hist.debit/100)*-1
				}
				array.push({id: hist.id, name: hist.detail, date: hist.date, cost: val})
			})
			return {
				id: data.comptesHote[0].id,
				balance: data.comptesHote[0].montant,
				estimatedBalance: data.comptesHote[0].montantEstime,
				estimatedFor: data.comptesHote[0].montantEstimeMsg.replace('Montant estimé au ', '').replaceAll('/','.').replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1'),
				history: array
			}
		} else {
			return {}
		}
	}
	
	async getUserInfo() {
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v1/hotes/' + this.etabId, {method: "GET",headers: {"Authorization": "Bearer " + this._token}})
			var data = await res.json()
			return {
				user:{
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
				},
				etab: {
					id: data.etab.id,
					code2p5: data.etab.code2p5,
					name: capitalize(data.etab.nom),
					adress:{
						line1: capitalize(data.etab.adr1),
						line2: capitalize(data.etab.adr2),
						postalCode: data.etab.cp,
						city: capitalize(data.etab.ville)
					},
					contact: {
						phone: data.etab.tel.match(/.{1,2}/g).join(' '),
						mail: data.etab.configuration.email,
						website: data.etab.configuration.url,
					},
					currency: data.etab.currencySymbol,
					server:{
						turboselfVersion: data.etab.versionTS,
						ip: data.etab.pcServeur
					},
					firstSync: data.etab.datePremSynchro,
					lastSync: data.etab.dateDernSynchro,
					meal: {
						cost: data.prixDej/100
					},
					minTransaction: data.etab.configuration.montantCreditMini/100
				}
			}
		} else {
			return {}
		}
	}
	
	async getBooking(date = new Date()) {
		while (date.getDay() != 1) {
			date.setDate(date.getDate() -1)
		}
		let strDate = ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v1/reservations/hotes/' + this.etabId + '/semaines?date=' + strDate, {method: "GET",headers: {"Authorization": "Bearer " + this._token}})
			var data = await res.json()
			var array = []
			var weekId = 0
			if (data.rsvWebDto[0] != undefined) {
				data.rsvWebDto[0].jours.forEach((day) => {
					var booked = false
					if (day.dayReserv == 1) {booked = true}
					array.push({
						id: day.id,
						dayNumber: day.dayOfWeek,
						booked: booked,
						lastSyncBooked: day.reservDernSynchro,
						canEdit: day.autorise,
						label: capitalize(day.dayLabel).replace('. ', ''),
						date: ("0" + (date.getDate() + (day.dayOfWeek - 1))).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()})
				})
				weekId = data.rsvWebDto[0].id
			}
			
			return {weekId:weekId,days: array}
		} else {
			return {}
		}
	}
	
	async setBooking(weekId, dayNumber, booked) {
		if (this.isLoggedIn) {
			var bookedId = 0
			if (booked == true) {
				bookedId = 1
			}
			var res = await fetch(baseURL + 'v2/hotes/' + this.etabId + '/reservations-jours', {method: "POST",headers: {"Content-Type": "application/json","Authorization": "Bearer " + this._token},body: JSON.stringify({dayOfWeek:dayNumber,dayReserv:bookedId,web:{id:weekId}})})
			var data = await res.json()
			console.log(data)
			if(data.statusCode != undefined) {
				return false
			}
			return true
		} else {
			return false
		}
	}
	
	async getHitory() {
		if (this.isLoggedIn) {
			var res = await fetch(baseURL + 'v1/hotes/' + this.etabId, {method: "GET",headers: {"Authorization": "Bearer " + this._token}})
			var data = await res.json()
			return {
				user:{
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
				},
				etab: {
					id: data.etab.id,
					code2p5: data.etab.code2p5,
					name: capitalize(data.etab.nom),
					adress:{
						line1: capitalize(data.etab.adr1),
						line2: capitalize(data.etab.adr2),
						postalCode: data.etab.cp,
						city: capitalize(data.etab.ville)
					},
					contact: {
						phone: data.etab.tel.match(/.{1,2}/g).join(' '),
						mail: data.etab.configuration.email,
						website: data.etab.configuration.url,
					},
					currency: data.etab.currencySymbol,
					server:{
						turboselfVersion: data.etab.versionTS,
						ip: data.etab.pcServeur
					},
					firstSync: data.etab.datePremSynchro,
					lastSync: data.etab.dateDernSynchro,
					meal: {
						cost: data.prixDej/100
					},
					minTransaction: data.etab.configuration.montantCreditMini/100
				}
			}
		} else {
			return {}
		}
	}
}

module.exports = Session
