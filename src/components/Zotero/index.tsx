import React from 'react'
import { CharacterMetadata, ContentState } from 'draft-js'
import Example from './ToolTipExample'

type PropType = {
	contentState: ContentState,
	entityKey: string,
	offsetkey: string,
}

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
			(character: CharacterMetadata) => {
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

export const TokenSpan: React.FC<PropType> = (props) => {
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
