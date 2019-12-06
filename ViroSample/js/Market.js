import React, { Component } from "react"
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { Card, ListItem, Button, Icon } from "react-native-elements"

import SeedsModal from "./SeedsModal"

class Market extends Component {
  constructor() {
    super()
    this.state = {
      seedModalVisibile: false
    }
    this.toggleSeedModal = this.toggleSeedModal.bind(this)
  }

  toggleSeedModal() {
    this.setState({ seedModalVisibile: !this.state.seedModalVisibile })
  }

  render() {
    return (
      <View>
        <ScrollView>
          <Card title="SELL NOW" image={require("./res/sell_crops.png")}>
            <Button
              // icon={<Icon name="code" color="#ffffff" />}
              buttonStyle={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0
              }}
              title="SELECT CROPS TO SELL"
            />
          </Card>
          <Card title="SEEDS" image={require("./res/seed_pack.png")}>
            <Button
              // icon={<Icon name="code" color="#ffffff" />}
              buttonStyle={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0
              }}
              title="BUY NOW"
              onPress={this.toggleSeedModal}
            />
          </Card>
          {this.state.seedModalVisibile ? <SeedsModal parentToggle={this.toggleSeedModal}/> : null}
          <Card title="TOOLS" image={require("./res/hoe.png")}>
            <Button
              // icon={<Icon name="code" color="#ffffff" />}
              buttonStyle={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0
              }}
              title="BUY NOW"
            />
          </Card>
          <Card title="PROTECTION" image={require("./res/umbrella.png")}>
            <Button
              // icon={<Icon name="code" color="#ffffff" />}
              buttonStyle={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0
              }}
              title="BUY NOW"
            />
          </Card>
        </ScrollView>
      </View>
    )
  }
}

// var styles = StyleSheet.create({
//   img: {
//     height: 100
//   }
// });

module.exports = Market
