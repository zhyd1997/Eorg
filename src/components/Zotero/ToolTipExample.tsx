import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'

const Example = ({ target, text }: any) => (
	<span>
		<UncontrolledTooltip placement="right" target={target}>
			{text}
		</UncontrolledTooltip>
	</span>
)

export default Example
