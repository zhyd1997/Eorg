import React from 'react'
import Example from './ToolTipExample'

const styles = {
	immutable: {
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		padding: '2px 0',
		cursor: 'pointer',
	},
}

export function getEntityStrategy(mutability: any) {
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

// @ts-expect-error ts-migrate(7006)
// FIXME: Parameter 'mutability' implicitly has an 'any' typ...
//  Remove this comment to see the full error message
function getDecoratedStyle(mutability) {
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
					// @ts-expect-error ts-migrate(2322)
					// FIXME: Type 'null' is not assignable to type 'CSSProperti...
					//  Remove this comment to see the full error message
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
