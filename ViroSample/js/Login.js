import React from "react"
import { View, Text, Button } from "react-native"
//import { GoogleSignin } from "react-native-google-signin"
import * as firebase from "firebase"

export default class Login extends React.Component {
	constructor(props) {
		super(props)
		this.googleLogin = this.googleLogin.bind(this)
	}

	// googleLogin() {
	// 	console.log("Hello World")
	// }

	async googleLogin() {
		try {
			// Add any configuration settings here:
			await GoogleSignin.configure()

			const data = await GoogleSignin.signIn()

			// create a new firebase credential with the token
			const credential = firebase.auth.GoogleAuthProvider.credential(
				data.idToken,
				data.accessToken
			)
			// login with credential
			const currentUser = await firebase.auth().signInWithCredential(credential)

			console.info(JSON.stringify(currentUser.toJSON()))
		} catch (e) {
			// console.error(e)
			console.log("google login has fucked up!", e)
		}
	}

	render() {
		return (
			<View>
				<Text>Behold, our login page.</Text>
				<View>
					{/* <Button
						title="Sign in with Google"
						onPress={this.googleLogin}
					></Button> */}
				</View>
			</View>
		)
	}
}
