const millisecondsPerHour = 1000 * 60 * 60
const millisecondsPerDay = millisecondsPerHour * 24

const WATER_SLACK = 0.9

export function midnightsBetween(date1, date2) {
	const date1AsDays = Math.floor(date1 / millisecondsPerDay)
	const date2AsDays = Math.floor(date2 / millisecondsPerDay)
	return Math.abs(date2AsDays - date1AsDays)
}

export function update(plot, now = new Date()) {
	// console.log("planted?:", !!plot.datePlanted)
	if (plot.datePlanted) {
		const daysSincePlanted = (now - plot.datePlanted) / millisecondsPerDay
		let daysSinceWatered
		if (plot.wateredDate)
			daysSinceWatered = (now - plot.wateredDate) / millisecondsPerDay
		const daysWithoutWater = daysSinceWatered || daysSincePlanted
		// console.log("days without water:", daysWithoutWater)
		// console.log("sensitivity:", plot.crop.sensitivity)
		if (daysWithoutWater > plot.crop.sensitivity) {
			plot.alive = false
		} else {
			if (daysWithoutWater * plot.crop.waterCountPerDay > WATER_SLACK)
				plot.watered = false
			if (plot.sprouted && !plot.ripe) {
				const watersToRipen = plot.crop.waterCountPerDay * plot.crop.harvestTime
				if (plot.waterCount >= watersToRipen) plot.ripe = true
			} else if (!plot.sprouted) {
				const watersToSprout = plot.crop.waterCountPerDay * plot.crop.sproutTime
				if (plot.waterCount >= watersToSprout) plot.sprouted = true
			}
		}
	}
	return plot
}
