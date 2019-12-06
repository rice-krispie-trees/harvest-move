import React from "react"
import { View, Text, Modal, TouchableHighlight } from "react-native"




export default function ToolsModal(props) {
  return (
    <View>
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={props.parentState}
      >
        <View>
          <Text>Tools Modal Is Open!</Text>

          <Button
            title="Close Modal"
            type="outline"
            raised={true}
            onPress={() => props.parentToggle(null)}
          />
        </View>
      </Modal>
    </View>
  )
}
