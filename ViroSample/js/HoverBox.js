import React from "react"
import { ViroBox } from "react-viro"
import { HOVER_BOX_SIDE } from "./constants"

export default function HoverBox(props) {
	return (
		<ViroBox
			height={HOVER_BOX_SIDE}
			width={HOVER_BOX_SIDE}
			length={HOVER_BOX_SIDE}
			position={props.position}
		/>
	)
}
