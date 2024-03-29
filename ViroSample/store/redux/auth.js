import { FirebaseWrapper } from "../../firebase/firebase"

export const SIGNUP_REQUEST = "SIGNUP_REQUEST"
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS"
export const SIGNUP_FAILURE = "SIGNUP_FAILURE"
export const LOGIN_REQUEST = "LOGIN_REQUEST"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_FAILURE = "LOGIN_FAILURE"
export const LOGOUT_REQUEST = "LOGOUT_REQUEST"
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS"
export const LOGOUT_FAILURE = "LOGOUT_FAILURE"
export const VERIFY_REQUEST = "VERIFY_REQUEST"
export const VERIFY_SUCCESS = "VERIFY_SUCCESS"

const requestSignup = () => {
	return {
		type: SIGNUP_REQUEST
	}
}

const receiveSignup = user => {
	return {
		type: SIGNUP_SUCCESS,
		user
	}
}

const signupError = () => {
	return {
		type: SIGNUP_FAILURE
	}
}

const requestLogin = () => {
	return {
		type: LOGIN_REQUEST
	}
}

const receiveLogin = user => {
	return {
		type: LOGIN_SUCCESS,
		user
	}
}

const loginError = () => {
	return {
		type: LOGIN_FAILURE
	}
}

const requestLogout = () => {
	return {
		type: LOGOUT_REQUEST
	}
}

const receiveLogout = () => {
	return {
		type: LOGOUT_SUCCESS
	}
}

const logoutError = () => {
	return {
		type: LOGOUT_FAILURE
	}
}

const verifyRequest = () => {
	return {
		type: VERIFY_REQUEST
	}
}

const verifySuccess = () => {
	return {
		type: VERIFY_SUCCESS
	}
}

export const signupUser = (email, password) => async dispatch => {
	try {
		dispatch(requestSignup())
		await FirebaseWrapper.GetInstance().FirebaseCreateNewUser(
			email,
			password,
			user => dispatch(receiveSignup(user))
		)
	} catch (error) {
		console.log("signupUser failed", error)
		dispatch(signupError())
	}
}

export const loginUser = (email, password) => async dispatch => {
	try {
		dispatch(requestLogin())
		await FirebaseWrapper.GetInstance().FirebaseLoginUser(
			email,
			password,
			user => dispatch(receiveLogin(user))
		)
	} catch (error) {
		console.log("loginUser failed", error)
		dispatch(loginError())
	}
}

export const logoutUser = () => async dispatch => {
	try {
		dispatch(requestLogout())
		await FirebaseWrapper.GetInstance().FirebaseLogoutUser(() =>
			dispatch(receiveLogout())
		)
	} catch (error) {
		console.log("logoutUser failed", error)
		dispatch(logoutError())
	}
}

export const verifyAuth = () => async dispatch => {
	try {
		dispatch(verifyRequest())
		await FirebaseWrapper.GetInstance().FirebaseVerifyAuth(user => {
			if (user !== null) {
				dispatch(receiveLogin(user))
			}
			dispatch(verifySuccess())
		})
	} catch (error) {
		console.log("verifyAuth failed", error)
	}
}

const authState = {
	isSigningUp: false,
	isLoggingIn: false,
	isLoggingOut: false,
	isVerifying: false,
	signupError: false,
	loginError: false,
	logoutError: false,
	isAuthenticated: false,
	user: {}
}

export default (state = authState, action) => {
	switch (action.type) {
		case SIGNUP_REQUEST:
			return { ...state, isSigningUp: true, signupError: false }
		case SIGNUP_SUCCESS:
			return {
				...state,
				isSigningUp: false,
				isAuthenticated: true,
				user: action.user
			}
		case SIGNUP_FAILURE:
			return {
				...state,
				isSigningUp: false,
				isAuthenticated: false,
				signupError: true
			}
		case LOGIN_REQUEST:
			return { ...state, isLoggingIn: true, loginError: false }
		case LOGIN_SUCCESS:
			return {
				...state,
				isLoggingIn: false,
				isAuthenticated: true,
				user: action.user
			}
		case LOGIN_FAILURE:
			return {
				...state,
				isLoggingIn: false,
				isAuthenticated: false,
				loginError: true
			}
		case LOGOUT_REQUEST:
			return {
				...state,
				isLoggingOut: true,
				logoutError: false
			}
		case LOGOUT_SUCCESS:
			return {
				...state,
				isLoggingOut: false,
				isAuthenticated: false,
				user: {}
			}
		case LOGOUT_FAILURE:
			return {
				...state,
				isLoggingOut: false,
				logoutError: true
			}
		case VERIFY_REQUEST:
			return {
				...state,
				isVerifying: true,
				verifyingError: false
			}
		case VERIFY_SUCCESS:
			return {
				...state,
				isVerifying: false
			}
		default:
			return state
	}
}
