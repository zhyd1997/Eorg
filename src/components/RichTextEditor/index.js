import React from 'react'
import {
	Editor, EditorState, getDefaultKeyBinding, RichUtils,
	CompositeDecorator, Modifier, convertToRaw,
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

class RichTextEditor extends React.Component {
	constructor(props) {
		super(props)

		const decorator = new CompositeDecorator([
			{
				strategy: getEntityStrategy('IMMUTABLE'),
				component: TokenSpan,
			},
		])

		this.state = {
			editorState: EditorState.createEmpty(decorator),
			liveCustomBlockEdits: Map(),
			fetchText: [],
			targetValue: 0,
			isLoading: false,
			isClick: false,
			biblatex: [],
			bib: {},
		}

		this.editorRef = React.createRef()
		this.focus = () => this.editorRef.current.focus()
		this.onChange = (editorState) => this.setState({ editorState })

		this.handleKeyCommand = this.handleKeyCommand.bind(this)
		this.mapKeyToEditorCommand = this.mapKeyToEditorCommand.bind(this)
		this.toggleBlockType = this.toggleBlockType.bind(this)
		this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
	}

	blockRenderer = (block) => {
		if (block.getType() === 'atomic') {
			return {
				component: BlockComponent,
				editable: false,
				props: {
					onStartEdit: (blockKey) => {
						const { liveCustomBlockEdits } = this.state
						this.setState({ liveCustomBlockEdits: liveCustomBlockEdits.set(blockKey, true) })
					},
					onFinishTeXEdit: (blockKey, newContentState) => {
						const { liveCustomBlockEdits } = this.state
						this.setState({
							liveCustomBlockEdits: liveCustomBlockEdits.remove(blockKey),
							editorState: EditorState.createWithContent(newContentState),
						})
					},
					onFinishTableEdit: (blockKey) => {
						const { liveCustomBlockEdits } = this.state
						this.setState({ liveCustomBlockEdits: liveCustomBlockEdits.remove(blockKey) })
					},
					onRemove: (blockKey) => this.removeTeX(blockKey),
				},
			}
		}
		return null
	};

	onChange = (editorState) => this.setState({ editorState });

	removeTeX = (blockKey) => {
		const { editorState, liveCustomBlockEdits } = this.state
		this.setState({
			liveCustomBlockEdits: liveCustomBlockEdits.remove(blockKey),
			editorState: removeTeXBlock(editorState, blockKey),
		})
	};

	insertTeX = () => {
		this.setState((prevState) => ({
			liveCustomBlockEdits: Map(),
			editorState: insertTeXBlock(prevState.editorState),
		}))
	};

	createTable = () => {
		this.setState((prevState) => ({
			editorState: createTable(prevState.editorState),
		}))
	}

	handleClick = (evt) => {
		if (evt.target.tagName === 'TD') {
			const value = evt.target.getAttribute('data-cite')
			this.setState({
				targetValue: value,
				isClick: true,
			})
		}
		return null
	}

	fetchZ = () => {
		this.setState({
			isLoading: true,
		})
		fetch('https://api.zotero.org/users/6882019/items', {
			method: 'GET',
			headers: {
				'Zotero-API-Version': '3',
				'Zotero-API-Key': 'UpZgNhfbGzWgHmeWPMg6y10r',
			},
		})
			.then((res) => {
				res.json()
					.then((data) => {
						/**
						 * [
						 *      {
						 *          key: KEY-1,
						 *          parsedDate: DATE-1,
						 *          title: TITLE-1
						 *      },
						 *      {
						 *          key: KEY-2,
						 *          parsedDate: DATE-2,
						 *          title: TITLE-2
						 *      },
						 *      {
						 *          key: KEY-3,
						 *          parsedDate: DATE-3,
						 *          title: TITLE-3
						 *      },
						 * ]
						 *
						 */
						const metadata = []

						data.map((i) => {
							const tempObj = Object.create({})

							tempObj.key = i.key
							tempObj.creatorSummary = i.meta.creatorSummary
							tempObj.parsedDate = i.meta.parsedDate
							tempObj.title = i.data.title

							metadata.push(tempObj)

							return metadata
						})

						this.setState({
							fetchText: metadata,
							isLoading: false,
						})
					})
			})
	}

	logState = () => {
		this.insertCite(this.state.editorState)
		this.setState({
			isClick: false,
		})
	}

	insertCite = (editorState) => {
		const currentContent = editorState.getCurrentContent()
		const selection = editorState.getSelection()
		const entityKey = currentContent
			.createEntity(
				'CITATION',
				'IMMUTABLE',
				{
					key: `${this.state.fetchText[this.state.targetValue - 1].key}`,
					value: `${this.state.fetchText[this.state.targetValue - 1].title}`,
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

		this.setState({
			editorState: EditorState.push(editorState, textWithEntity, 'insert-characters'),
		})
	}

	storeCitations = (callback) => {
		const currentContent = this.state.editorState.getCurrentContent()
		const editorContentRaw = convertToRaw(currentContent)
		const { entityMap } = editorContentRaw

		if (Object.keys(entityMap).length === 0 && entityMap.constructor === Object) {
			this.setState({
				biblatex: [],
				bib: {},
			}, () => {
				callback()
			})
		} else {
			const tempArray = []
			const tempBib = Object.create({})

			for (let i = 0; i < Object.keys(entityMap).length; i += 1) {
				if (entityMap[i].type === 'CITATION') {
					const { key } = entityMap[i].data
					fetch(`https://api.zotero.org/users/6882019/items/${key}/?format=biblatex`, {
						method: 'GET',
						headers: {
							'Zotero-API-Version': '3',
							'Zotero-API-Key': 'UpZgNhfbGzWgHmeWPMg6y10r',
						},
					}).then((res) => {
						res.text()
							.then((data) => {
								const searchTerm = '{'
								const searchTerm2 = ','
								const indexOfFirst = data.indexOf(searchTerm)
								const indexOfFirst2 = data.indexOf(searchTerm2)
								const temp = Object.create({})
								const value = data.substr(indexOfFirst + 1, indexOfFirst2 - indexOfFirst - 1)

								temp[key] = value

								if (tempArray.findIndex((item) => item[key] === value) === -1) {
									tempArray.push(temp)
								}
								tempBib[key] = data
								if (i === Object.keys(entityMap).length - 1) {
									if (tempArray.length !== 0) {
										this.setState({
											biblatex: tempArray,
											bib: tempBib,
										}, () => {
											callback()
										})
									}
								}
							})
					})
				}
			}
		}
	}

	handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command)
		if (newState) {
			this.onChange(newState)
			return true
		}
		return false
	}

	mapKeyToEditorCommand(e) {
		if (e.keyCode === 9 /* TAB */) {
			const newEditorState = RichUtils.onTab(
				e,
				this.state.editorState,
				4, /* maxDepth */
			)
			if (newEditorState !== this.state.editorState) {
				this.onChange(newEditorState)
			}
			return
		}
		// eslint-disable-next-line consistent-return
		return getDefaultKeyBinding(e)
	}

	toggleBlockType(blockType) {
		if (blockType === 'math') {
			return this.insertTeX()
		}

		this.onChange(
			RichUtils.toggleBlockType(
				this.state.editorState,
				blockType,
			),
		)
		return null
	}

	toggleInlineStyle(inlineStyle) {
		this.onChange(
			RichUtils.toggleInlineStyle(
				this.state.editorState,
				inlineStyle,
			),
		)
	}

	render() {
		const { editorState } = this.state

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
							onToggle={this.toggleBlockType}
						/>
						<InlineStyleControls
							editorState={editorState}
							onToggle={this.toggleInlineStyle}
						/>
						<div className="RichEditor-controls">
							<ModalTable
								onClick={this.createTable}
								buttonLabel="Table"
							/>
							<ModalExample
								cite={this.logState}
								fetchZ={this.fetchZ}
								fetchText={this.state.fetchText}
								buttonLabel="Cite"
								handleClickT={this.handleClick}
								isLoading={this.state.isLoading}
								isClicked={this.state.isClick}
							/>
						</div>
					</div>
					{/* eslint-disable-next-line max-len */}
					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
					<div className={className} onClick={this.focus}>
						<Editor
							blockRendererFn={this.blockRenderer}
							blockStyleFn={getBlockStyle}
							customStyleMap={styleMap}
							editorState={editorState}
							handleKeyCommand={this.handleKeyCommand}
							keyBindingFn={this.mapKeyToEditorCommand}
							onChange={this.onChange}
							placeholder="Content only supports a single style..."
							readOnly={this.state.liveCustomBlockEdits.count()}
							ref={this.editorRef}
							spellCheck
						/>
					</div>
				</div>
				<Preview
					login={this.props.login}
					store={this.props.store}
					bib={this.state.bib}
					biblatex={this.state.biblatex}
					storeCitations={this.storeCitations}
					contentState={contentState}
				/>
			</div>
		)
	}
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
	// {label: 'UL', style: 'unordered-list-item'},
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
