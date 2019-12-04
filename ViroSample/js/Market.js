import React, { Component } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Card, ListItem, Button, Icon } from 'react-native-elements'


const Market = () => {
	return (
    <View>
      <Card
        title='SEEDS'
        image={require('./res/wheat.jpg')}>
        <Button
          icon={<Icon name='code' color='#ffffff' />}
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='BUY NOW' />
      </Card>
    </View>
  )
}

var styles = StyleSheet.create({
	helloWorldTextStyle: {
		fontFamily: "Arial",
		fontSize: 15,
		color: "#ffffff",
		textAlignVertical: "center",
		textAlign: "center",
	}
})

module.exports = Market
