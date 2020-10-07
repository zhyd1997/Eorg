import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'

type ExampleTypes = {
	target: string,
	text: string,
}

const Example: React.FC<ExampleTypes> = ({ target, text }) => (
	<span>
		<UncontrolledTooltip placement="right" target={target}>
			{text}
		</UncontrolledTooltip>
	</span>
)

export default Example
