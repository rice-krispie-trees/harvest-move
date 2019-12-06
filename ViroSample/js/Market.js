import React, { Component } from "react"
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { Card, ListItem, Button, Icon } from "react-native-elements"

import { SeedsModal, SellCropsModal, ToolsModal, ProtectionModal } from "../js"

class Market extends Component {
  constructor() {
    super()
    this.state = {
      modalTypeVisibile: null,
      visible: true
    }
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleModal(modalType) {
    this.setState({ modalTypeVisibile: modalType })
  }

  render() {
    return (
      <View>
        <ScrollView>
          <Card title="SELL NOW" image={require("./res/sell_crops.png")}>
            <Button
              // icon={<Icon name="code" color="#ffffff" />}
              buttonStyle={styles.button}
              title="SELECT CROPS TO SELL"
              onPress={() => this.toggleModal("sell")}
            />
          </Card>

          <Card title="SEEDS" image={require("./res/seed_pack.png")}>
            <Button
              // icon={<Icon name="code" color="#ffffff" />}
              buttonStyle={styles.button}
              title="BUY NOW"
              onPress={() => this.toggleModal("seeds")}
            />
          </Card>

          <Card title="TOOLS" image={require("./res/hoe.png")}>
            <Button
              // icon={<Icon name="code" color="#ffffff" />}
              buttonStyle={styles.button}
              title="BUY NOW"
              onPress={() => this.toggleModal("tools")}
            />
          </Card>

          <Card title="PROTECTION" image={require("./res/umbrella.png")}>
            <Button
              // icon={<Icon name="code" color="#ffffff" />}
              buttonStyle={styles.button}
              title="BUY NOW"
              onPress={() => this.toggleModal("protection")}
            />
          </Card>
        </ScrollView>

        {this.state.modalTypeVisibile === "sell" ? (
          <SellCropsModal
            parentToggle={this.toggleModal}
            parentState={this.state.visible}
          />
        ) : null}
        {this.state.modalTypeVisibile === "seeds" ? (
          <SeedsModal
            parentToggle={this.toggleModal}
            parentState={this.state.visible}
          />
        ) : null}
        {this.state.modalTypeVisibile === "tools" ? (
          <ToolsModal
            parentToggle={this.toggleModal}
            parentState={this.state.visible}
          />
        ) : null}
        {this.state.modalTypeVisibile === "protection" ? (
          <ProtectionModal
            parentToggle={this.toggleModal}
            parentState={this.state.visible}
          />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  }
})

module.exports = Market
