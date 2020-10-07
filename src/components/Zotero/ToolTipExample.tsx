import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'

type PropTypes = {
	target: string,
	text: string,
}

const Example: React.FC<PropTypes> = ({ target, text }) => (
	<span>
		<UncontrolledTooltip placement="right" target={target}>
			{text}
		</UncontrolledTooltip>
	</span>
)

export default Example
