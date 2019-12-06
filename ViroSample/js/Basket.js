import React, { Component } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import { FirebaseWrapper } from "../firebase/firebase";

export default class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };

  }

  async componentDidMount() {
    await FirebaseWrapper.GetInstance().SetupCollectionListener(
      "users",
      users => this.setState({ users })
    );
  }

  render() {
    let x = this.state.users[0]
    return (
      <View style={styles.container}>
        <Text style={{ fontWeight: 'bold' }}>Your basket includes:</Text>
        <Text>{`\u2022 Item #1 Ex.`}</Text>
        <Text>{`\u2022 Item #2 Ex.`}</Text>
        {/* {this.state.users.map(user => {
          if (user.email) {
            return (<Text>HAS EMAIL</Text>)
          }
        })}; */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "space-around",
    alignItems: "center"
  }
  // button: {
  //   marginBottom: 30,
  //   width: 20,
  //   alignItems: 'center',
  //   backgroundColor: '#2196F3'
  // }
  // buttonText: {
  //   textAlign: 'center',
  //   padding: 20,
  //   color: 'white'
  // }
})
