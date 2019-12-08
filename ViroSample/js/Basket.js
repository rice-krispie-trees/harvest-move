import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { FirebaseWrapper } from "../firebase/firebase";
import { Card, Button } from "react-native-elements"
import { Actions } from "react-native-router-flux";

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
        <Card
          title="WHEAT"
          image={require('./res/crops/wheat.png')}
          containerStyle={styles.card}
          imageStyle={styles.img}>
          <Text>{`\u2022 Quantity: 1`}</Text>
          <Button
            onPress={() => Actions.market()}
            buttonStyle={styles.button}
            title="SELL WHEAT IN MARKET"
          />
        </Card>
        <Card
          title="CORN"
          image={require('./res/crops/corn.png')}
          containerStyle={styles.card}
          imageStyle={styles.img}>
          <Text>{`\u2022 Quantity: 3`}</Text>
          <Button
            onPress={() => Actions.market()}
            buttonStyle={styles.button}
            title="SELL CORN IN MARKET"
          />
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
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  card: {
    width: 299,
    height: 250,
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
    alignSelf: "flex-start"
  }
})
