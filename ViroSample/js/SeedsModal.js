import React from "react"
import { View, Text, Modal, TouchableHighlight } from "react-native"

export default function SeedsModal(props) {

  return (
    <View>
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={props.parentState}
      >
        <View>
          <Text>Seed Modal Is Open!</Text>

          <TouchableHighlight onPress={() => props.parentToggle(null)}>
            <Text>Close Modal</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    </View>
  )
}
