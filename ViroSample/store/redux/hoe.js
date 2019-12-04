export const HOE_TOGGLED = "HOE_TOGGLED"

export const toggleHoe = () => ({ type: HOE_TOGGLED })

export const initialState = true

export default (state = initialState, action) => {
	switch (action.type) {
		case HOE_TOGGLED:
			return !state
		default:
			return state
	}
}
