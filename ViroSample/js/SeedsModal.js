import React from "react"
import { View, Text, Modal, ScrollView, StyleSheet } from "react-native"
import { Button, Image, Card } from "react-native-elements"
import { connect } from "react-redux"

import { corn, potato, cabbage, strawberry, wheat } from "./logic/crops"
import { buySeeds } from "../store/redux/inventory"

export default connect(
	state => ({ user: state.inventory }),
	dispatch => ({ buySeeds: crop => () => dispatch(buySeeds(crop)) })
)(props => {
	const crops = [corn, potato, cabbage, strawberry, wheat]
	return (
		<View>
			<Modal
				animationType={"slide"}
				transparent={false}
				visible={props.visible}
			>
				<View style={styles.topbar}>
					<Text>{`Wallet: ${props.user.kolions} Kolions`}</Text>
				</View>
				<ScrollView>
					<View>
						<Text>Select Seeds to Buy!</Text>
						{crops.map(crop => {
							return (
								<Card
									key={crop.name}
									image={crop.img}
									imageStyle={{ width: 200, height: 200 }}
									title={crop.name.toUpperCase()}
								>
									<Text>{`\u2022 Total Growth Time: ${crop.sproutTime +
										crop.harvestTime} days`}</Text>
									<Text>{`\u2022 Waters Per Day: x${crop.waterCountPerDay}`}</Text>
									<Text>{`\u2022 Death Sensitivity: ${crop.sensitivity}`}</Text>
									<Text>{`\u2022 You currently own ${
										props.user.seeds[crop.name]
									} of these seeds.`}</Text>
									<Button
										title={`${crop.seedCost} kolions`}
										onPress={props.buySeeds(crop)}
									/>
								</Card>
							)
						})}
						<Button
							title="Go Back To Market"
							type="outline"
							raised={true}
							onPress={props.parentToggle}
						/>
					</View>
				</ScrollView>
			</Modal>
		</View>
	)
})

const styles = StyleSheet.create({
	topbar: {
		backgroundColor: "#F8C752"
	}
})
