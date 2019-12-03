import crops from "./crops"

const millisecondsPerHour = 1000 * 60 * 60
const millisecondsPerDay = millisecondsPerHour * 24
const WATER_SLACK = 0.9

export function midnightsBetween(date1, date2) {
	const date1AsDays = Math.floor(date1 / millisecondsPerDay)
	const date2AsDays = Math.floor(date2 / millisecondsPerDay)
	return Math.abs(date2AsDays - date1AsDays)
}

export function update(plot, now = new Date()) {
	const crop = crops[plot.crop]
	plot = { ...plot }
	if (plot.datePlanted) {
		const daysSincePlanted = (now - plot.datePlanted) / millisecondsPerDay
		let daysSinceWatered
		if (plot.wateredDate)
			daysSinceWatered = (now - plot.wateredDate) / millisecondsPerDay
		const daysWithoutWater = daysSinceWatered || daysSincePlanted
		// console.log("days without water:", daysWithoutWater)
		// console.log("sensitivity:", plot.crop.sensitivity)
		if (daysWithoutWater > crop.sensitivity) {
			plot.alive = false
		} else {
			if (daysWithoutWater * crop.waterCountPerDay > WATER_SLACK)
				plot.watered = false
			if (plot.sprouted && !plot.ripe) {
				const watersToRipen = crop.waterCountPerDay * crop.harvestTime
				if (plot.waterCount >= watersToRipen) plot.ripe = true
			} else if (!plot.sprouted) {
				const watersToSprout = crop.waterCountPerDay * crop.sproutTime
				if (plot.waterCount >= watersToSprout) plot.sprouted = true
			}
		}
	}
	return plot
}

export function hasDied(plot) {
	return plot.alive && !update(plot).alive
}

export function hasSprouted(plot) {
	const updatedPlot = update(plot)
	return (
		!plot.sprouted &&
		updatedPlot.sprouted &&
		updatedPlot.alive &&
		!updatedPlot.ripe
	)
}

export function hasRipened(plot) {
	const updatedPlot = update(plot)
	return !plot.ripe && updatedPlot.ripe && updatedPlot.alive
}

export function hasDried(plot) {
	const updatedPlot = update(plot)
	return updatedPlot.alive && plot.watered && !updatedPlot.watered
}

export function hasChanged(plot) {
	return (
		hasDied(plot) || hasSprouted(plot) || hasRipened(plot) || hasDried(plot)
	)
}
