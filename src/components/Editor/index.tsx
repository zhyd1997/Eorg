import React from 'react'
import {
	Editor, EditorState, getDefaultKeyBinding, RichUtils,
	CompositeDecorator, Modifier, ContentState, ContentBlock,
} from 'draft-js'
import './index.css'
import 'draft-js/dist/Draft.css'
import { Map } from 'immutable'
import BlockComponent from './BlockComponent'
import removeTeXBlock from './BlockComponent/TeX/modifiers/removeTeXBlock'
import insertTeXBlock from './BlockComponent/TeX/modifiers/insertTeXBlock'
import insertImageBlock from './BlockComponent/Image/modifiers/insertImageBlock'
import removeImageBlock from './BlockComponent/Image/modifiers/removeImageBlock'
import createTable from './BlockComponent/Table/modifiers/createTable'
import ModalTable from './BlockComponent/Table/ModalTable'
import Preview from '../Preview'
import { getEntityStrategy, TokenSpan } from '../Zotero'
import ModalExample from '../Zotero/ModalExample'
import './BlockComponent/TeX/TeXEditor.css'
import './BlockComponent/Table/Table.css'
import './BlockComponent/Image/imageBlockStyle.css'

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

type StyleButtonTypes = {
	onToggle: (style: string) => void,
	style: string,
	active: boolean,
	label: string,
}

type StyleControlsTypes = {
	editorState: EditorState,
	onToggle: (style: string) => void,
}

type RichTextEditorTypes = {
	login: boolean,
	store: {
		token: string,
	},
}

const StyleButton: React.FC<StyleButtonTypes> = ({
	onToggle, style, active, label,
}) => {
// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
	function onToggleStyle(e): void {
		e.preventDefault()
		onToggle(style)
	}
	let className = 'RichEditor-styleButton'
	if (active) {
		className += ' RichEditor-activeButton'
	}

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<span className={className} onMouseDown={onToggleStyle}>
			{label}
		</span>
	)
}

const INLINE_STYLES = [
	{ label: 'Bold', style: 'BOLD' },
	{ label: 'Italic', style: 'ITALIC' },
	{ label: 'Underline', style: 'UNDERLINE' },
	{ label: 'Monospace', style: 'CODE' },
]

const InlineStyleControls: React.FC<StyleControlsTypes> = ({ editorState, onToggle }) => {
	const currentStyle = editorState.getCurrentInlineStyle()

	return (
		<div className="RichEditor-controls">
			{INLINE_STYLES.map((type) => (
				<StyleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={onToggle}
					style={type.style}
				/>
			))}
		</div>
	)
}

const BLOCK_TYPES = [
	{ label: 'H1', style: 'header-one' },
	{ label: 'H2', style: 'header-two' },
	{ label: 'H3', style: 'header-three' },
	{ label: 'Math', style: 'math' },
	{ label: 'Image', style: 'image-block' },
	// {label: 'H4', style: 'header-four'},
	// {label: 'H5', style: 'header-five'},
	// {label: 'H6', style: 'header-six'},
	// {label: 'Blockquote', style: 'blockquote'},
	{ label: 'UL', style: 'unordered-list-item' },
	// {label: 'OL', style: 'ordered-list-item'},
	// {label: 'Code Block', style: 'code-block'},
]

const BlockStyleControls = (props: StyleControlsTypes) => {
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

// Custom overrides for "code" style.
const styleMap = {
	CODE: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
		fontSize: 16,
		padding: 2,
	},
}

function getBlockStyle(block: ContentBlock): null | string {
	switch (block.getType()) {
		case 'blockquote':
			return 'RichEditor-blockquote'
		default:
			return null
	}
}

const RichTextEditor: React.FC<RichTextEditorTypes> = ({ login, store }) => {
	const decorator = new CompositeDecorator([
		{
			strategy: getEntityStrategy('IMMUTABLE'),
			component: TokenSpan,
		},
	])

	const [editorState, setEditorState] = React.useState(EditorState.createEmpty(decorator))
	const [liveCustomBlockEdits, setLiveCustomBlockEdits] = React.useState(Map())

	const editorRef = React.useRef<HTMLElement>(null!)

	function focusEditor(): void {
		editorRef.current.focus()
	}

	React.useEffect(() => {
		focusEditor()
	}, [])

	function onChange(editorStateChanged: EditorState): void {
		setEditorState(editorStateChanged)
	}

	function removeTeX(blockKey: string): void {
		setLiveCustomBlockEdits(liveCustomBlockEdits.remove(blockKey))
		setEditorState(removeTeXBlock(editorState, blockKey))
	}

	function insertTeX(): void {
		setLiveCustomBlockEdits(Map())
		setEditorState(insertTeXBlock(editorState))
	}

	function insertImage(): void {
		setLiveCustomBlockEdits(Map())
		setEditorState(insertImageBlock(editorState))
	}

	function removeImage(blockKey: string): void {
		setLiveCustomBlockEdits(liveCustomBlockEdits.remove(blockKey))
		setEditorState(removeImageBlock(editorState, blockKey))
	}

	function insertTable(): void {
		setEditorState(createTable(editorState))
	}

	function insertCite(fetchText: any[], targetValue: number): void {
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
			undefined,
			entityKey,
		)

		setEditorState(EditorState.push(editorState, textWithEntity, 'insert-characters'))
	}

	function blockRenderer(block: ContentBlock): any | null {
		if (block.getType() === 'atomic') {
			return {
				component: BlockComponent,
				editable: false,
				props: {
					onStartEdit: (blockKey: string) => {
						setLiveCustomBlockEdits(liveCustomBlockEdits.set(blockKey, true))
					},
					onFinishTeXEdit: (blockKey: string, newContentState: ContentState) => {
						setLiveCustomBlockEdits(liveCustomBlockEdits.remove(blockKey))
						setEditorState(EditorState.createWithContent(newContentState))
					},
					onFinishTableEdit: (blockKey: string) => {
						setLiveCustomBlockEdits(liveCustomBlockEdits.remove(blockKey))
					},
					onRemove: (blockKey: string) => removeTeX(blockKey),
					onRemoveImage: (blockKey: string) => removeImage(blockKey),
				},
			}
		}
		return null
	}

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'command' implicitly has an 'any' type.
	function handleKeyCommand(command, editorStateChanged): boolean {
		const newState = RichUtils.handleKeyCommand(editorStateChanged, command)
		if (newState) {
			onChange(newState)
			return true
		}
		return false
	}

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
	function mapKeyToEditorCommand(e) {
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

	function toggleBlockType(blockType: string) {
		if (blockType === 'math') {
			return insertTeX()
		}

		if (blockType === 'image-block') {
			return insertImage()
		}

		onChange(
			RichUtils.toggleBlockType(
				editorState,
				blockType,
			),
		)
		return null
	}

	function toggleInlineStyle(inlineStyle: string): void {
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
					{ /* @ts-ignore */ }
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

export default RichTextEditor
