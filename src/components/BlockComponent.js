import React from 'react'
import TeXBlock from './TeX/TeXBlock'
import Table from './Table/Table'

const BlockComponent = (props) => {
	const entity = props.contentState.getEntity(
		props.block.getEntityAt(0),
	)
	const type = entity.getType()

	let media
	if (type === 'TOKEN') {
		media = (
			<TeXBlock
				blockProps={props.blockProps}
				block={props.block}
				contentState={props.contentState}
			/>
		)
	} else if (type === 'table') {
		media = (
			<Table props={props} />
		)
	}

	return media
}

export default BlockComponent
