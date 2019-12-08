import React from "react"
import { View, Text, Modal, ScrollView } from "react-native"
import { Button, Image, Card } from "react-native-elements"
import { corn, potato, cabbage, strawberry, wheat } from "./logic/crops"

export default function SeedsModal(props) {
  const crops = [corn, potato, cabbage, strawberry, wheat]
  //console.error(crops)
  return (
    <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={props.parentState}
        >
          <ScrollView>
          <View>
            <Text>Select Seeds to Buy!</Text>
            {
            crops.map(crop => {
              return (
                <Card
                  key={crop.name}
                  image={crop.img}
                  imageStyle={{ width: 200, height: 200 }}
                  title={crop.name.toUpperCase()}
                >
                  <Text>{`\u2022 Total Growth Time: ${crop.sproutTime + crop.harvestTime} days`}</Text>
                  <Text>{`\u2022 Waters Per Day: x${crop.waterCountPerDay}`}</Text>
                  <Text>{`\u2022 Death Sensitivity: ${crop.sensitivity}`}</Text>
                  <Button title={`${crop.value} kolions`}/>
                </Card>
              )
            })}
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
