import * as firebase from "firebase"
import "firebase/firestore"
import {
	GeoCollectionReference,
	GeoFirestore,
	GeoQuery,
	GeoQuerySnapshot
} from "geofirestore"

export class FirebaseWrapper {
	constructor() {
		this.initialized = false
		this._firebaseInstance = null
		this._firebaseWrapperInstance = null
		this._firestore = null
	}

	Initialize(config) {
		if (!this.initialized) {
			this._firebaseInstance = firebase.initializeApp(config)
			this._firestore = firebase.firestore()
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

	async CreateNewDocument(collectionPath, doc) {
		try {
			const ref = this._firestore.collection(collectionPath).doc()
			const timestamp = firebase.firestore.Timestamp.now().toDate()
			return await ref.set({ ...doc, createdAt: timestamp, id: ref.id })
		} catch (error) {
			console.log("something went wrong", error)
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

	async createPlot(
		collectionPath,
		name,
		plotLatitude,
		plotLongitude,
		callback
	) {
		try {
			const geofirestore = new GeoFirestore(this._firestore)
			const geocollection = geofirestore.collection(collectionPath)
			const coordinates = new firebase.firestore.GeoPoint(
				plotLatitude,
				plotLongitude
			)
			const newDoc = await geocollection.add({
				name,
				coordinates,
				datePlanted: null,
				ripe: false,
				sprouted: false,
				waterCount: 0,
				wateredDate: null,
				alive: false
			})
			await newDoc.get().then(doc => callback(doc.data()))
		} catch (error) {
			console.log("create plot failed", error)
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

	async SetupCollectionListener(collectionPath, callback) {
		try {
			await this._firestore
				.collection(collectionPath)
				// .orderBy("createdAt", "desc")
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
}
