import React from "react"
import { View, Text, Modal, TouchableHighlight } from "react-native"
import { Market } from "./Market"

export default class SeedsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }
    this.viewToggle = this.viewToggle.bind(this)
  }

  viewToggle() {
    this.props.parentToggle()
    this.setState({visible: false})
  }

  render() {
  return (
    <View>
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.visible}
      >
        <View>
          <Text>Seed Modal Is Open!</Text>

          <TouchableHighlight onPress={this.viewToggle}>
            <Text>Close Modal</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    </View>
  )
  }
}
