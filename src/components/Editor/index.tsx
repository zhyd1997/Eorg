import React, { useState, useEffect, useRef } from 'react'
import {
	Editor, EditorState, getDefaultKeyBinding, RichUtils,
	CompositeDecorator, Modifier, ContentState, ContentBlock,
} from 'draft-js'
import './index.css'
import 'draft-js/dist/Draft.css'
import { Map } from 'immutable'
import BlockComponent from './BlockComponent'
import insertCustomBlock from './BlockComponent/modifiers/insertCustomBlock'
import removeCustomBlock from './BlockComponent/modifiers/removeCustomBlock'
import ModalTable from './BlockComponent/Table/ModalTable'
import Preview from '../Preview'
import { getEntityStrategy, TokenSpan } from '../Zotero'
import ModalExample from '../Zotero/ModalExample'
import './BlockComponent/TeX/TeXEditor.css'
import './BlockComponent/Table/Table.css'
import './BlockComponent/Image/imageBlockStyle.css'
import {
	InlineStyleControls, BlockStyleControls, styleMap, getBlockStyle,
} from './utils'

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

type PropTypes = {
	login: boolean,
	store: {
		token: string,
	},
}

const RichTextEditor = ({ login, store }: PropTypes) => {
	const decorator = new CompositeDecorator([
		{
			strategy: getEntityStrategy('IMMUTABLE'),
			component: TokenSpan,
		},
	])

	const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator))
	const [liveCustomBlockEdits, setLiveCustomBlockEdits] = useState(Map())

	const editorRef = useRef<HTMLElement>(null!)

	function focusEditor(): void {
		editorRef.current.focus()
	}

	useEffect(() => {
		focusEditor()
	}, [])

	function onChange(editorStateChanged: EditorState): void {
		setEditorState(editorStateChanged)
	}

	function removeBlock(blockKey: string): void {
		setLiveCustomBlockEdits(liveCustomBlockEdits.remove(blockKey))
		setEditorState(removeCustomBlock(editorState, blockKey))
	}

	function insertTeX(): void {
		setLiveCustomBlockEdits(Map())
		setEditorState(insertCustomBlock(editorState, 'TOKEN', { content: '\\sin{x^2} + \\cos{x^2} = 1' }))
	}

	function insertImage(): void {
		setLiveCustomBlockEdits(Map())
		setEditorState(insertCustomBlock(editorState, 'IMAGE', { path: 'logo192.png', caption: 'This is a caption' }))
	}

	function insertTable(): void {
		setEditorState(insertCustomBlock(editorState, 'TABLE'))
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
					onFinishEdit: (blockKey: string, newContentState: ContentState) => {
						setLiveCustomBlockEdits(liveCustomBlockEdits.remove(blockKey))
						setEditorState(
							EditorState.push(editorState, newContentState, 'change-block-data'),
						)
					},
					onRemove: (blockKey: string) => removeBlock(blockKey),
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
