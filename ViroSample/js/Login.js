import React, { Component } from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { connect } from "react-redux"
import { Actions } from "react-native-router-flux"
import { loginUser, logoutUser, signupUser } from "../store/redux/auth"
import { Input } from "react-native-elements"

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email: "",
			password: ""
		}
		this.handleEmailChange = this.handleEmailChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
		this.handleLogout = this.handleLogout.bind(this)
		this.handleSignup = this.handleSignup.bind(this)
	}

	handleEmailChange = ({ target }) => {
		this.setState({ email: target.value })
	}

	handlePasswordChange = ({ target }) => {
		this.setState({ password: target.value })
	}

	handleLogin = () => {
		const { dispatch } = this.props
		const { email, password } = this.state
		dispatch(loginUser(email, password))
		this.setState({ email: "", password: "" })
	}

	handleLogout = () => {
		const { dispatch } = this.props
		dispatch(logoutUser())
	}

	handleSignup = () => {
		const { dispatch } = this.props
		const { email, password } = this.state
		dispatch(signupUser(email, password))
		this.setState({ email: "", password: "" })
	}

	render() {
		const { loginError, logoutError, signupError, isAuthenticated } = this.props
		if (isAuthenticated) {
			return (
				<View>
					<Button title="Start Farming" onPress={() => Actions.home()} />
					<Button title="Logout" onPress={() => this.handleLogout()} />
					{logoutError && (
						<Text>Couldn't Logout at this time, please try again</Text>
					)}
				</View>
			)
		} else {
			return (
				<View>
					<Input
						onChange={this.handleEmailChange}
						onChangeText={text => this.setState({ email: text })}
						placeholder="email"
						value={this.state.email}
					/>
					<Input
						onChange={this.handlePasswordChange}
						onChangeText={text => this.setState({ password: text })}
						placeholder="password"
						value={this.state.password}
						secureTextEntry={true}
					/>
					{loginError && <Text>Incorrect email or password</Text>}
					{signupError && (
						<Text>Couldn't create user at this time, please try again</Text>
					)}
					<Button
						style={styles.button}
						title="Login"
						onPress={() => this.handleLogin()}
					/>
					<Button
						style={styles.button}
						title="Signup"
						onPress={() => this.handleSignup()}
					/>
				</View>
			)
		}
	}
}

const styles = StyleSheet.create({
	button: {
		position: "absolute",
		bottom: 0
	}
})

const mapStateToProps = state => {
	return {
		isSigningUp: state.auth.isSigningUp,
		isLoggingIn: state.auth.isLoggingIn,
		isLoggingOut: state.auth.isLoggingOut,
		signupError: state.auth.signupError,
		loginError: state.auth.loginError,
		logoutError: state.auth.logoutError,
		isAuthenticated: state.auth.isAuthenticated
	}
}
export default connect(mapStateToProps)(Login)
