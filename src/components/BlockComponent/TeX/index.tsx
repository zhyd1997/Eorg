import katex from 'katex'
import React from 'react'
import { ContentState } from 'draft-js'
import Block from '../blockTypes'

type PropTypes = {
	content: string,
	onClick: () => void,
}

const KaTexOutput: React.FC<PropTypes> = ({ content, onClick }) => {
	const container = React.useRef<HTMLElement>(null!)

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'value' implicitly has an 'any' type.
	function usePrevious(value) {
		const ref = React.useRef(null)
		React.useEffect(() => {
			ref.current = value
		})
		return ref.current
	}
	const prevProps = usePrevious(content)

	function update() {
		katex.render(
			content,
			container.current,
			{ displayMode: true },
		)
	}

	React.useEffect(() => {
		if (prevProps !== content) {
			update()
		}
	})
	// eslint-disable-next-line max-len
	// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
	return <span ref={container} onClick={onClick} />
}

const TeXBlock: React.FC<Block> = ({ block, contentState, blockProps }) => {
	const [editMode, setEditMode] = React.useState(false)
	const [texValue, setTexValue] = React.useState('')
	const [invalidTeX, setInvalidTeX] = React.useState(false)
	const textareaRef = React.useRef(null)

	function getValue(): string {
		return contentState.getEntity(block.getEntityAt(0)).getData().content
	}

	// @ts-ignore
	function onValueChange(evt): void {
		const { value } = evt.target
		let invalid = false
		try {
			// @ts-ignore
			// eslint-disable-next-line no-underscore-dangle
			katex.__parse(value)
		} catch (e) {
			invalid = true
		} finally {
			setInvalidTeX(invalid)
			setTexValue(value)
		}
	}

	function remove(): void {
		blockProps.onRemove(block.getKey())
	}

	function startEdit(): void {
		blockProps.onStartEdit(block.getKey())
	}

	function finishEdit(newContentState: ContentState): void {
		blockProps.onFinishTeXEdit(
			block.getKey(),
			newContentState,
		)
	}

	function onClick(): void {
		if (editMode) {
			return
		}
		setEditMode(true)
		setTexValue(getValue())
		startEdit()
	}

	function save(): void {
		const entityKey = block.getEntityAt(0)
		const newContentState = contentState.mergeEntityData(
			entityKey,
			{ content: texValue },
		)
		setInvalidTeX(false)
		setEditMode(false)
		setTexValue('')
		finishEdit(newContentState)
	}

	let texContent: string
	if (editMode) {
		if (invalidTeX) {
			texContent = ''
		} else {
			texContent = texValue
		}
	} else {
		texContent = getValue()
	}

	let className = 'TeXEditor-tex'
	if (editMode) {
		className += ' TeXEditor-activeTeX'
	}

	let editPanel = null
	if (editMode) {
		let buttonClass = 'TeXEditor-saveButton'
		if (invalidTeX) {
			buttonClass += ' TeXEditor-invalidButton'
		}

		editPanel = (
			<div className="TeXEditor-panel">
				<textarea
					className="TeXEditor-texValue"
					onChange={onValueChange}
					ref={textareaRef.current}
					value={texValue}
				/>
				<div className="TeXEditor-buttons">
					<button
						className={buttonClass}
						disabled={invalidTeX}
						onClick={save}
						type="button"
					>
						{invalidTeX ? 'Invalid TeX' : 'Done'}
					</button>
					<button
						className="TeXEditor-removeButton"
						onClick={remove}
						type="button"
					>
						Remove
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className={className}>
			<KaTexOutput content={texContent} onClick={onClick} />
			{editPanel}
		</div>
	)
}

export default TeXBlock
