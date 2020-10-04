import React from 'react'
import {
	Editor, EditorState, getDefaultKeyBinding, RichUtils,
	CompositeDecorator, Modifier,
} from 'draft-js'
import './index.css'
import 'draft-js/dist/Draft.css'
import { Map } from 'immutable'
import BlockComponent from '../BlockComponent'
import removeTeXBlock from '../BlockComponent/TeX/modifiers/removeTeXBlock'
import insertTeXBlock from '../BlockComponent/TeX/modifiers/insertTeXBlock'
import createTable from '../BlockComponent/Table/modifiers/createTable'
import ModalTable from '../BlockComponent/Table/ModalTable'
import Preview from '../Preview'
import { getEntityStrategy, TokenSpan } from '../Zotero'
import ModalExample from '../Zotero/ModalExample'
import '../BlockComponent/TeX/TeXEditor.css'
import '../BlockComponent/Table/Table.css'

/**
 * Editor Template and KaTeX support are all referenced to Draft.js official example.
 *
 * https://github.com/facebook/draft-js/issues/852#issuecomment-383858848
 *
 * Change citations data text:
 * [x] 1. Number will be incremented by click.
 * [x] 2. it will be decremented when deleted.
 * [x] 3. tooltip will be display corresponded to different entityKey.
 *
 */

function RichTextEditor({ login, store }) {
	const decorator = new CompositeDecorator([
		{
			strategy: getEntityStrategy('IMMUTABLE'),
			component: TokenSpan,
		},
	])

	const [editorState, setEditorState] = React.useState(EditorState.createEmpty(decorator))
	const [liveCustomBlockEdits, setLiveCustomBlockEdits] = React.useState(Map())

	const editorRef = React.useRef(null)

	const focusEditor = () => {
		editorRef.current.focus()
	}

	React.useEffect(() => {
		focusEditor()
	}, [])

	const onChange = (editorStateChanged) => setEditorState(editorStateChanged)

	const blockRenderer = (block) => {
		if (block.getType() === 'atomic') {
			return {
				component: BlockComponent,
				editable: false,
				props: {
					onStartEdit: (blockKey) => {
						setLiveCustomBlockEdits(liveCustomBlockEdits.set(blockKey, true))
					},
					onFinishTeXEdit: (blockKey, newContentState) => {
						setLiveCustomBlockEdits(liveCustomBlockEdits.remove(blockKey))
						setEditorState(EditorState.createWithContent(newContentState))
					},
					onFinishTableEdit: (blockKey) => {
						setLiveCustomBlockEdits(liveCustomBlockEdits.remove(blockKey))
					},
					onRemove: (blockKey) => removeTeX(blockKey),
				},
			}
		}
		return null
	}

	const removeTeX = (blockKey) => {
		setLiveCustomBlockEdits(liveCustomBlockEdits.remove(blockKey))
		setEditorState(removeTeXBlock(editorState, blockKey))
	}

	const insertTeX = () => {
		setLiveCustomBlockEdits(Map())
		setEditorState(insertTeXBlock(editorState))
	}

	const insertTable = () => {
		setEditorState(createTable(editorState))
	}

	const insertCite = (fetchText, targetValue) => {
		const currentContent = editorState.getCurrentContent()
		const selection = editorState.getSelection()
		const entityKey = currentContent
			.createEntity(
				'CITATION',
				'IMMUTABLE',
				{
					key: `${fetchText[targetValue - 1].key}`,
					value: `${fetchText[targetValue - 1].title}`,
				},
			)
			.getLastCreatedEntityKey()

		const textWithEntity = Modifier.insertText(
			currentContent,
			selection,
			' ',
			null,
			entityKey,
		)

		setEditorState(EditorState.push(editorState, textWithEntity, 'insert-characters'))
	}

	const handleKeyCommand = (command, editorStateChanged) => {
		const newState = RichUtils.handleKeyCommand(editorStateChanged, command)
		if (newState) {
			onChange(newState)
			return true
		}
		return false
	}

	const mapKeyToEditorCommand = (e) => {
		if (e.keyCode === 9 /* TAB */) {
			const newEditorState = RichUtils.onTab(
				e,
				editorState,
				4, /* maxDepth */
			)
			if (newEditorState !== editorState) {
				onChange(newEditorState)
			}
			return
		}
		// eslint-disable-next-line consistent-return
		return getDefaultKeyBinding(e)
	}

	const toggleBlockType = (blockType) => {
		if (blockType === 'math') {
			return insertTeX()
		}

		onChange(
			RichUtils.toggleBlockType(
				editorState,
				blockType,
			),
		)
		return null
	}

	const toggleInlineStyle = (inlineStyle) => {
		onChange(
			RichUtils.toggleInlineStyle(
				editorState,
				inlineStyle,
			),
		)
	}

	// If the user changes block type before entering any text, we can
	// either style the placeholder or hide it. Let's just hide it now.
	let className = 'RichEditor-editor'
	const contentState = editorState.getCurrentContent()
	if (!contentState.hasText()) {
		if (contentState.getBlockMap().first().getType() !== 'unstyled') {
			className += ' RichEditor-hidePlaceholder'
		}
	}

	return (
		<div className="double-column">
			<div className="RichEditor-root">
				<div className="Menu">
					<BlockStyleControls
						editorState={editorState}
						onToggle={toggleBlockType}
					/>
					<InlineStyleControls
						editorState={editorState}
						onToggle={toggleInlineStyle}
					/>
					<div className="RichEditor-controls">
						<ModalTable
							onClick={insertTable}
							buttonLabel="Table"
						/>
						<ModalExample
							insertCite={insertCite}
							buttonLabel="Cite"
						/>
					</div>
				</div>
				{/* eslint-disable-next-line max-len */}
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
				<div className={className} onClick={focusEditor}>
					<Editor
						blockRendererFn={blockRenderer}
						blockStyleFn={getBlockStyle}
						customStyleMap={styleMap}
						editorState={editorState}
						handleKeyCommand={handleKeyCommand}
						keyBindingFn={mapKeyToEditorCommand}
						onChange={onChange}
						placeholder="Content only supports a single style..."
						readOnly={liveCustomBlockEdits.count()}
						ref={editorRef}
						spellCheck
					/>
				</div>
			</div>
			<Preview
				login={login}
				store={store}
				contentState={contentState}
			/>
		</div>
	)
}

// Custom overrides for "code" style.
const styleMap = {
	CODE: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
		fontSize: 16,
		padding: 2,
	},
}

function getBlockStyle(block) {
	switch (block.getType()) {
	case 'blockquote':
		return 'RichEditor-blockquote'
	default:
		return null
	}
}

const StyleButton = (props) => {
	const onToggle = (e) => {
		e.preventDefault()
		props.onToggle(props.style)
	}
	let className = 'RichEditor-styleButton'
	if (props.active) {
		className += ' RichEditor-activeButton'
	}

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<span className={className} onMouseDown={onToggle}>
			{props.label}
		</span>
	)
}

const BLOCK_TYPES = [
	{ label: 'H1', style: 'header-one' },
	{ label: 'H2', style: 'header-two' },
	{ label: 'H3', style: 'header-three' },
	{ label: 'Math', style: 'math' },
	// {label: 'H4', style: 'header-four'},
	// {label: 'H5', style: 'header-five'},
	// {label: 'H6', style: 'header-six'},
	// {label: 'Blockquote', style: 'blockquote'},
	{ label: 'UL', style: 'unordered-list-item' },
	// {label: 'OL', style: 'ordered-list-item'},
	// {label: 'Code Block', style: 'code-block'},
]

const BlockStyleControls = (props) => {
	const { editorState } = props
	const selection = editorState.getSelection()
	const blockType = editorState
		.getCurrentContent()
		.getBlockForKey(selection.getStartKey())
		.getType()

	return (
		<div className="RichEditor-controls">
			{BLOCK_TYPES.map((type) => (
				<StyleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	)
}

const INLINE_STYLES = [
	{ label: 'Bold', style: 'BOLD' },
	{ label: 'Italic', style: 'ITALIC' },
	{ label: 'Underline', style: 'UNDERLINE' },
	{ label: 'Monospace', style: 'CODE' },
]

const InlineStyleControls = (props) => {
	const currentStyle = props.editorState.getCurrentInlineStyle()

	return (
		<div className="RichEditor-controls">
			{INLINE_STYLES.map((type) => (
				<StyleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	)
}

export default RichTextEditor
