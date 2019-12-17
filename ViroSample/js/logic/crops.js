export const testCrop = {
	name: "testCrop",
	waterCountPerDay: 1,
	harvestTime: 1,
	sproutTime: 2,
	sensitivity: 1.5,
	value: 50
}

export const corn = {
	sproutTime: 2,
	harvestTime: 2,
	name: "corn",
	waterCountPerDay: 1,
	sensitivity: 3,
	value: 100,
	seedCost: 50,
	img: require("../res/crops/corn.png")
}

export const potato = {
	sproutTime: 1,
	harvestTime: 6,
	name: "potato",
	waterCountPerDay: 0.5,
	sensitivity: 1.5,
	value: 300,
	seedCost: 100,
	img: require("../res/crops/potato.png")
}

export const cabbage = {
	sproutTime: 3,
	harvestTime: 6,
	name: "cabbage",
	waterCountPerDay: 2,
	sensitivity: 1.5,
	value: 500,
	seedCost: 150,
	img: require("../res/crops/cabbage.png")
}

export const strawberry = {
	sproutTime: 2,
	harvestTime: 2,
	name: "strawberry",
	waterCountPerDay: 2,
	sensitivity: 3,
	value: 600,
	seedCost: 200,
	img: require("../res/crops/strawberry.png")
}

export const wheat = {
	sproutTime: 4,
	harvestTime: 4,
	name: "wheat",
	waterCountPerDay: 1,
	sensitivity: 5,
	value: 1000,
	seedCost: 500,
	img: require("../res/crops/wheat.png")
}

export default {
	// testCrop,
	corn,
	wheat,
	strawberry,
	cabbage,
	potato
}
