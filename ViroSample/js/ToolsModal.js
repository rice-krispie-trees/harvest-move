import React from "react"
import { View, Text, Modal, TouchableHighlight, ScrollView } from "react-native"
import { Button, Card } from "react-native-elements"

const hoeImg = require("./res/hoe.png")

export default function ToolsModal(props) {
  return (
    <View>
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={props.parentState}
      >
        <ScrollView>
          <View>
            <Text>Level Up Your Tools Below!</Text>
            <Card
              image={hoeImg}
              imageStyle={{ width: 200, height: 200 }}
            >
              <Text>Level 2 Farming Hoe:</Text>
              <Text>{`\u2022 Reduces Crop Death Sensitivity By 1 day`}</Text>
              <Button title="Level 2 - 300 kolions"/>
            </Card>
            <Card
              image={hoeImg}
              imageStyle={{ width: 200, height: 200 }}
            >
              <Text>Level 3 Farming Hoe:</Text>
              <Text>{`\u2022 Reduces Crop Death Sensitivity By 2 days`}</Text>
              <Button title="Level 3 - 600 kolions"/>
            </Card>
            <Button
              title="Go Back To Market"
              type="outline"
              raised={true}
              onPress={() => props.parentToggle(null)}
            />
          </View>
        </ScrollView>
      </Modal>
    </View>
  )
}
