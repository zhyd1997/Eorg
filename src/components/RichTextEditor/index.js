import React from 'react'
import {
	Editor, EditorState, getDefaultKeyBinding, RichUtils,
} from 'draft-js'
import './index.css'
import 'draft-js/dist/Draft.css'
import { Map } from 'immutable'
import BlockComponent from '../BlockComponent'
import removeTeXBlock from '../BlockComponent/TeX/modifiers/removeTeXBlock'
import insertTeXBlock from '../BlockComponent/TeX/modifiers/insertTeXBlock'
import createTable from '../BlockComponent/Table/modifiers/createTable'
import ModalTable from '../BlockComponent/Table/ModalTable'
import convertToTeX, { allTeX } from '../convertContent/convert'
import { postData, previewPDF } from '../previewPDF/preview'
import Download from '../DownloadFile/Download'
import LoadingSpinner from '../Loading'
import '../BlockComponent/TeX/TeXEditor.css'
import '../BlockComponent/Table/Table.css'

/**
 * Editor Template and KaTeX support are all referenced to Draft.js official example.
 */

class RichTextEditor extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editorState: EditorState.createEmpty(),
			liveCustomBlockEdits: Map(),
			data: {},
			message: '',
			isLoading: false,
			previewStyle: 'preview',
			messageStyle: '',
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
		this.onChange(
			RichUtils.toggleBlockType(
				this.state.editorState,
				blockType,
			),
		)
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

		const loadPDF = () => {
			convertToTeX(contentState)
			this.setState({
				data: allTeX,
			}, () => {
				/**
				 * TODO load pdf
				 *  if and only if
				 *      - [x] this.state.data is not empty
				 *      - [ ] and not equal to prevState.data
				 */

				if (this.state.data[0].length !== 0) { // its initial value is [''], which is a empty string
					this.setState({
						isLoading: true,
						previewStyle: 'preview loading',
					}, () => {
						document.getElementById('tex-btn')
							.setAttribute('disabled', '')
						document.getElementById('pdf-btn')
							.setAttribute('disabled', '')
						postData(this.props.store, this.state.data)
						setTimeout(() => {
							previewPDF(this.props.store)
							this.setState({
								isLoading: false,
								previewStyle: 'preview',
							}, () => {
								document.getElementById('tex-btn')
									.removeAttribute('disabled')
								document.getElementById('pdf-btn')
									.removeAttribute('disabled')
							})
						}, 30000)
					})
				} else {
					this.setState({
						message: 'Nothing you wrote',
						messageStyle: 'error-message',
					})
					setTimeout(
						() => {
							this.setState({ messageStyle: 'fade' })
						},
						3000,
					)
				}
			})
		}

		const preview = () => {
			if (this.props.login) {
				loadPDF()
			} else {
				this.setState({
					message: 'You need to login first!',
					messageStyle: 'error-message',
				})
				setTimeout(
					() => {
						this.setState({ messageStyle: 'fade' })
					},
					3000,
				)
			}
		}

		const ErrorMessage = () => <p className={this.state.messageStyle}>{this.state.message}</p>

		const Loading = () => {
			if (this.state.isLoading) {
				return <LoadingSpinner />
			}
			return ''
		}

		return (
			<>
				<ErrorMessage />
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
							<div className="RichEditor-controls TeXEditor-insert">
								<button
									onClick={this.insertTeX}
									className="math RichEditor-styleButton"
									type="button"
								>
									Math
								</button>
								<ModalTable
									onClick={this.createTable}
									buttonLabel="Table"
								/>
								<button
									onClick={preview}
									className="save"
									type="button"
								>
									preview
								</button>
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
								placeholder="Tell a story..."
								readOnly={this.state.liveCustomBlockEdits.count()}
								ref={this.editorRef}
								spellCheck
							/>
						</div>
					</div>
					<div className={this.state.previewStyle}>
						{
							this.props.login ? <Download store={this.props.store} /> : ''
						}
						<iframe
							id="pdf"
							title="hello"
						/>
						<Loading />
					</div>
				</div>
			</>
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
