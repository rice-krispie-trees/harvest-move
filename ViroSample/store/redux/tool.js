export const CHANGE_TOOL = "CHANGE_TOOL"

export const selectedTool = tool => ({ type: CHANGE_TOOL, tool })

export const initialState = "Hoe"

export default (state = initialState, action) => {
	switch (action.type) {
		case CHANGE_TOOL:
			return action.tool
		default:
			return state
	}
}
