import React from 'react'
import Block from './blockTypes'
import TeXBlock from './TeX'
import TableBlock from './Table'

const BlockComponent = ({ contentState, block, blockProps }: Block) => {
	const entity = contentState.getEntity(
		block.getEntityAt(0),
	)
	const type: string = entity.getType()

	let media
	if (type === 'TOKEN') {
		media = (
			<TeXBlock
				blockProps={blockProps}
				block={block}
				contentState={contentState}
			/>
		)
	} else if (type === 'TABLE') {
		media = (
			<TableBlock
				blockProps={blockProps}
				block={block}
				contentState={contentState}
			/>
		)
	}

	return media
}

export default BlockComponent
