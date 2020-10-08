import React from 'react'
import TeXBlock from './TeX/TeXBlock'
import TableBlock from './Table/TableBlock'

const BlockComponent = (props: any) => {
	const entity = props.contentState.getEntity(
		props.block.getEntityAt(0),
	)
	const type: string = entity.getType()

	let media
	if (type === 'TOKEN') {
		media = (
			<TeXBlock
				// @ts-expect-error ts-migrate(2322)
				// FIXME: Property 'blockProps' does not exist on type 'Intr...
				//  Remove this comment to see the full error message
				blockProps={props.blockProps}
				block={props.block}
				contentState={props.contentState}
			/>
		)
	} else if (type === 'TABLE') {
		media = (
			<TableBlock
				blockProps={props.blockProps}
				block={props.block}
				contentState={props.contentState}
			/>
		)
	}

	return media
}

export default BlockComponent
