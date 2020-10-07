import React from 'react'
import Example from './ToolTipExample'

const styles = {
	immutable: {
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		padding: '2px 0',
		cursor: 'pointer',
	},
}

export function getEntityStrategy(mutability: string) {
// @ts-expect-error ts-migrate(7006)
// FIXME: Parameter 'contentBlock' implicitly has an 'any' t...
//  Remove this comment to see the full error message
	return function anonymous(contentBlock, callback, contentState) {
		contentBlock.findEntityRanges(
			// @ts-expect-error ts-migrate(7006)
			// FIXME: Parameter 'character' implicitly has an 'any' type...
			//  Remove this comment to see the full error message
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

function getDecoratedStyle(mutability: string) {
	switch (mutability) {
		case 'IMMUTABLE': return styles.immutable
		default: return null
	}
}

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
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
					// TODO
					// @ts-ignore
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
