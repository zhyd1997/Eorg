import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'

export default function Example({
	target,
	text,
}: any) {
	return (
		<span>
			<UncontrolledTooltip placement="right" target={target}>
				{text}
			</UncontrolledTooltip>
		</span>
	)
}
