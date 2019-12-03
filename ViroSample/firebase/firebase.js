import * as firebase from "firebase"
import "firebase/firestore"
import "firebase/auth"
import firebasePath from "../firebase_path"
import { GeoFirestore } from "geofirestore"
import { hasDied, hasDried, hasRipened, hasSprouted } from "../js/logic"

// const getNewDocId = async collectionPath => {
//   const docIdRef = await firebase
//     .firestore()
//     .collection("Counters")
//     .doc(collectionPath);
//   const newDocIdRef = await docIdRef.update({
//     counter: firebase.firestore.FieldValue.increment(1)
//   });
//   return newDocIdRef;
// };

export class FirebaseWrapper {
	constructor() {
		this.initialized = false
		this._firebaseInstance = null
		this._firebaseWrapperInstance = null
		this._firestore = null
		this._auth = null
	}

	Initialize(config) {
		if (!this.initialized) {
			this._firebaseInstance = firebase.initializeApp(config)
			this._firestore = firebase.firestore()
			this._auth = firebase.auth()
			this.initialized = true
		} else {
			console.log("already initialized")
		}
	}

	static GetInstance() {
		if (null == this._firebaseWrapperInstance) {
			this._firebaseWrapperInstance = new FirebaseWrapper()
		}
		return this._firebaseWrapperInstance
	}

	async FirebaseLoginUser(email, password, callback) {
		try {
			this._auth
				.signInWithEmailAndPassword(email, password)
				.then(user => callback(user))
		} catch (error) {
			console.log("FirebaseLoginUser failed", error)
		}
	}

	async FirebaseLogoutUser(callback) {
		try {
			this._auth.signOut().then(callback)
		} catch (error) {
			console.log("FirebaseLogoutUser failed", error)
		}
	}

	async FirebaseVerifyAuth(callback) {
		try {
			this._auth.onAuthStateChanged(user => callback(user))
		} catch (error) {
			console.log("FirebaseVerifyAuth failed", error)
		}
	}

	async CreateNewDocument(collectionPath, doc) {
		try {
			const ref = this._firestore.collection(collectionPath).doc()
			const timestamp = firebase.firestore.Timestamp.now().toDate()
			return await ref.set({ ...doc, createdAt: timestamp, id: ref.id })
		} catch (error) {
			console.log("something went wrong", error)
		}
	}

	async getAndUpdatePlots(userLatitude, userLongitude, callback) {
		try {
			const geofirestore = new GeoFirestore(this._firestore)
			const geocollection = geofirestore.collection(firebasePath)
			const coordinates = new firebase.firestore.GeoPoint(
				userLatitude,
				userLongitude
			)
			geofirestore.runTransaction(async transaction => {
				const query = geocollection.near({
					center: coordinates,
					radius: 10
				})
				const results = await query.get()
				const container = []
				results.forEach(plotDoc => {
					plot = plotDoc.data()
					if (hasDied(plot)) {
						transaction.update(plotDoc, { "d.alive": false })
					} else {
						if (hasDried(plot)) {
							transaction.update(plotDoc, { "d.watered": false })
						}
						if (hasRipened(plot)) {
							transaction.update(plotDoc, { "d.ripe": true })
						} else if (hasSprouted(plot)) {
							transaction.update(plotDoc, { "d.sprouted": true })
						}
					}
					container.push(plotDoc.data())
				})
				return callback(container)
			})
		} catch (error) {
			console.log("get nearby plots failed", error)
		}
	}

	async createUser(collectionPath, doc) {
		try {
			const ref = this._firestore.collection(collectionPath).doc(doc.user.uid)
			return await ref.set({
				email: doc.user.email,
				profile_picture: doc.additionalUserInfo.profile.picture,
				first_name: doc.additionalUserInfo.profile.given_name,
				last_name: doc.additionalUserInfo.profile.last_name,
				events: []
			})
		} catch (error) {
			console.log("create user failed", error)
		}
	}

	async createPlot(collectionPath, plotLatitude, plotLongitude, callback) {
		try {
			//   const docId = getNewDocId(collectionPath);
			const geofirestore = new GeoFirestore(this._firestore)
			const geocollection = geofirestore.collection(collectionPath)
			const coordinates = new firebase.firestore.GeoPoint(
				plotLatitude,
				plotLongitude
			)
			const newDoc = await geocollection.add({
				coordinates,
				crop: null,
				datePlanted: null,
				ripe: false,
				sprouted: false,
				waterCount: 0,
				wateredDate: null,
				watered: false,
				alive: false
			})
			await newDoc.update({ id: newDoc.id })
			await newDoc.get().then(doc => callback(doc.data()))
		} catch (error) {
			console.log("create plot failed", error)
		}
	}

	async SetupCollectionListener(collectionPath, callback) {
		try {
			await this._firestore
				.collection(collectionPath)
				.onSnapshot(querySnapshot => {
					let container = []
					querySnapshot.forEach(doc => {
						container.push(doc.data())
					})
					return callback(container)
				})
		} catch (error) {
			console.log("you didnt listen", error)
		}
	}
	async getNearbyPlots(
		collectionPath,
		userLatitude,
		userLongitude,
		radius,
		limit,
		callback
	) {
		try {
			const geofirestore = new GeoFirestore(this._firestore)
			const geocollection = geofirestore.collection(collectionPath)
			const coordinates = new firebase.firestore.GeoPoint(
				userLatitude,
				userLongitude
			)
			const query = geocollection.near({
				center: coordinates,
				radius,
				limit
			})
			await query.get().then(snapshot => {
				let container = []
				snapshot.forEach(doc => {
					container.push(doc.data())
				})
				return callback(container)
			})
		} catch (error) {
			console.log("get nearby plots failed", error)
		}
	}

	async seedPlot(plotId, seed, callback) {
		try {
			const batch = this._firestore.batch()
			const plotRef = this._firestore.collection(firebasePath).doc(plotId)
			await batch.update(plotRef, {
				"d.datePlanted": new Date(),
				"d.alive": true,
				"d.crop": seed
			})
			const seedRef = this._firestore.collection("SeedBasket").doc(seed)
			await batch.update(seedRef, {
				count: firebase.firestore.FieldValue.increment(-1)
			})
			await batch.commit().then(async () => {
				await plotRef.get().then(doc => callback(doc.data().d))
			})
		} catch (error) {
			console.log("seedPlot failed", error)
		}
	}

	async waterPlot(plotId, callback) {
		try {
			const ref = this._firestore.collection(firebasePath).doc(plotId)
			await ref.update({
				"d.waterCount": firebase.firestore.FieldValue.increment(1),
				"d.wateredDate": new Date(),
				"d.watered": true
			})
			await ref.get().then(doc => callback(doc.data().d))
		} catch (error) {
			console.log("waterPlot failed", error)
		}
	}

	async pickCrop(plotId, crop, callback) {
		try {
			const batch = this._firestore.batch()
			const plotRef = this._firestore.collection(firebasePath).doc(plotId)
			await batch.update(plotRef, {
				"d.datePlanted": null,
				"d.ripe": false,
				"d.sprouted": false,
				"d.waterCount": 0,
				"d.wateredDate": null,
				"d.alive": false,
				"d.crop": null
			})
			const cropRef = this._firestore.collection("CropBasket").doc(crop)
			await batch.update(cropRef, {
				count: firebase.firestore.FieldValue.increment(1)
			})
			await batch.commit().then(async () => {
				await plotRef.get().then(doc => callback(doc.data().d))
			})
		} catch (error) {
			console.log("pickCrop failed", error)
		}
	}
}
