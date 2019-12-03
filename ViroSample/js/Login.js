import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { loginUser } from "../store/redux/auth";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange = ({ target }) => {
    this.setState({ email: target.value });
  };

  handlePasswordChange = ({ target }) => {
    this.setState({ password: target.value });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { email, password } = this.state;
    dispatch(loginUser(email, password));
  };

  render() {
    const { loginError, isAuthenticated } = this.props;
    if (isAuthenticated) {
      return (
        <View>
          <Button title="Start Farming" onPress={() => Actions.home()} />
        </View>
      );
    } else {
      return (
        <View>
          <Text>Welcome to HarvestMove</Text>
          <View>
            <TextInput
              onChange={this.handleEmailChange}
              onChangeText={text => this.setState({ email: text })}
              placeholder="email"
              value={this.state.email}
            />
            <TextInput
              onChange={this.handlePasswordChange}
              onChangeText={text => this.setState({ password: text })}
              placeholder="password"
              value={this.state.password}
            />
            {loginError && <Text>Incorrect email or password</Text>}
            <Button
              style={styles.button}
              title="Sign In"
              onPress={() => this.handleSubmit()}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 0
  }
});

const mapStateToProps = state => {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    loginError: state.auth.loginError,
    isAuthenticated: state.auth.isAuthenticated
  };
};
export default connect(mapStateToProps)(Login);
