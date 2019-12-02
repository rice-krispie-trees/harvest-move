export const SEED_TYPE_PICKED = "SEED_TYPE_PICKED"

export const seedTypePicked = seed => ({ type: SEED_TYPE_PICKED, seed })

export const initialState = "corn"

export default (state = initialState, action) => {
	switch (action.type) {
		case SEED_TYPE_PICKED:
			return action.seed
		default:
			return state
	}
}
