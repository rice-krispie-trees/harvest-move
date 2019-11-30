import { expect } from "chai"
import { update } from "./"

const hour = 60 * 60 * 1000

const day1at1pm = 0
const day1at9pm = 8 * hour
const day2at7am = day1at9pm + 10 * hour
const day2at8am = day2at7am + hour
const day2at8pm = day2at8am + 12 * hour
const day3at8am = day2at8pm + 12 * hour

const corn = {
	waterCountPerDay: 1,
	harvestTime: 1,
	sproutTime: 2,
	sensitivity: 1.5
}

const makeEmptyPlot = () => ({
	datePlanted: null,
	crop: null,
	watered: false,
	ripe: false,
	sprouted: false,
	alive: false
})

const makeCornPlot = (datePlanted) => ({
	datePlanted,
	crop: corn,
	watered: false,
	ripe: false,
	sprouted: false,
	alive: false
})


describe("update function", ()=> {
	it("correctly identifies whether crop is alive or not" ()=> {
		expect(update(makeCornPlot(day1at1pm), ))
	})
})
