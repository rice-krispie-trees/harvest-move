import { expect } from "chai"
import { update } from "./"

const hour = 60 * 60 * 1000

const day1at1pm = 1
const day1at9pm = 8 * hour
const day2at7am = day1at9pm + 10 * hour
const day2at8am = day2at7am + hour
const day2at8pm = day2at8am + 12 * hour
const day3at12am = day2at8pm + 4 * hour
const day3at2am = day2at8pm + 6 * hour
const day3at8pm = day2at8pm + 24 * hour
const day3at9pm = day3at8pm + hour

const corn = {
	waterCountPerDay: 1,
	harvestTime: 1,
	sproutTime: 2,
	sensitivity: 1.5
}

const makeEmptyPlot = () => ({
	datePlanted: null,
	wateredDate: null,
	crop: null,
	watered: false,
	ripe: false,
	sprouted: false,
	waterCount: 0,
	alive: false
})

const makeCornPlot = datePlanted => ({
	datePlanted,
	wateredDate: null,
	crop: corn,
	watered: false,
	ripe: false,
	sprouted: false,
	alive: true,
	waterCount: 0
})

const makeWateredCornPlot = datePlanted => ({
	datePlanted,
	crop: corn,
	wateredDate: datePlanted,
	watered: true,
	ripe: false,
	sprouted: false,
	alive: true,
	waterCount: 1
})

function water(plot) {
	plot.watered = true
	plot.waterCount++
	return plot
}

describe("update function", () => {
	it("correctly identifies whether crop is alive or not", () => {
		expect(update(makeCornPlot(day1at1pm), day1at9pm).alive).to.be.equal(true)
		expect(update(makeCornPlot(day1at1pm), day3at12am).alive).to.be.equal(true)
		expect(update(makeCornPlot(day1at1pm), day3at2am).alive).to.be.equal(false)
	})

	it("correctly updates 'watered' flag", () => {
		expect(
			update(makeWateredCornPlot(day1at1pm), day1at9pm).watered
		).to.be.equal(true)
		expect(
			update(makeWateredCornPlot(day1at1pm), day2at8am).watered
		).to.be.equal(true)
		expect(
			update(makeWateredCornPlot(day1at1pm), day2at8pm).watered
		).to.be.equal(false)
	})

	it("correctly sprouts", () => {
		expect(
			update(makeWateredCornPlot(day1at1pm), day2at8pm).sprouted
		).to.be.equal(false)
		expect(
			update(
				water(update(makeWateredCornPlot(day1at1pm), day2at8pm)),
				day3at12am
			).sprouted
		).to.be.equal(true)
	})

	it("correctly ripens", () => {
		expect(
			update(
				water(update(makeWateredCornPlot(day1at1pm), day2at8pm)),
				day3at8pm
			).ripe
		).to.be.equal(false)
		expect(
			update(
				water(
					update(
						water(update(makeWateredCornPlot(day1at1pm), day2at8pm)),
						day3at8pm
					)
				),
				day3at9pm
			).ripe
		).to.be.equal(false)
	})
})
