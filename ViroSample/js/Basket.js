import React, { Component } from "react";
import { StyleSheet, View, Button, Text, Image } from "react-native";
import { FirebaseWrapper } from "../firebase/firebase";
import { Card } from "react-native-elements"

export default class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plots: []
    };

  }

  async componentDidMount() {
    await FirebaseWrapper.GetInstance().getAllUserPlots(
      plots => this.setState({ plots })
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontWeight: 'bold' }}>Your basket currently has:</Text>
        <Text>{`\u2022 Item #1: Wheat`}</Text>
        <Card
          image={require('./res/wheat.jpg')}
          containerStyle={styles.card}
          imageStyle={styles.img}>
          <Text style={styles.text}>Wheat</Text>
        </Card>
        {/* {this.state.plots && this.state.plots.map(plot => {
          if (plot.d.alive) return <Text key={plot.d.id}>This crop is: {plot.d.crop}</Text>
        })} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 5,
    backgroundColor: "rgba(255,255,255,1)"
  },
  button: {
    shadowColor: "grey",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.14,
    shadowRadius: 1,
  },
  card: {
    width: 299,
    height: 150,
    backgroundColor: "rgba(255,255,255,1)",
    borderColor: "grey",
    borderWidth: 0.1,
    overflow: "hidden",
    marginTop: 15,
    borderRadius: 3
  },
  img: {
    width: 299,
    height: 112,
    marginTop: 3,
    borderRadius: 3
  },
  text: {
    alignSelf: "left"
  }
})
