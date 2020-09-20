import React from 'react'
import Example from './ToolTipExample'

export function getEntityStrategy(mutability) {
	return function anonymous(contentBlock, callback, contentState) {
		contentBlock.findEntityRanges(
			(character) => {
				const entityKey = character.getEntity()
				if (entityKey === null) {
					return false
				}
				return contentState.getEntity(entityKey).getMutability() === mutability
			},
			callback,
		)
	}
}

function getDecoratedStyle(mutability) {
	switch (mutability) {
	case 'IMMUTABLE': return styles.immutable
	default: return null
	}
}

export const TokenSpan = (props) => {
	const style = getDecoratedStyle(
		props.contentState.getEntity(props.entityKey).getMutability(),
	)

	const text = props.contentState.getEntity(props.entityKey).getData().value

	return (
		<span>
			<sup>
				<cite
					data-offset-key={props.offsetkey}
					style={style}
					id={`Popover-${props.entityKey}`}
				>
					{props.children}
				</cite>
			</sup>
			<Example target={`Popover-${props.entityKey}`} text={text} />
		</span>
	)
}

const styles = {
	immutable: {
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		padding: '2px 0',
		cursor: 'pointer',
	},
}
