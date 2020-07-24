import React from 'react';
import {Editor, EditorState, getDefaultKeyBinding, RichUtils, convertToRaw} from 'draft-js';
import './RichTextEditor.css';
import '../../node_modules/draft-js/dist/Draft.css';
import highlightCallBack from './Highlight'
import {Map} from "immutable";
import TeXBlock from "./TeX/TeXBlock";
import {removeTeXBlock} from "./TeX/modifiers/removeTeXBlock";
import {insertTeXBlock} from "./TeX/modifiers/insertTeXBlock";
import './TeX/TeXEditor.css'

/**
 * Editor Template and KaTeX support are all referenced to Draft.js official example.
 */

class RichTextEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty(),
			liveTeXEdits: Map(),
		};

		this.editorRef = React.createRef();
		this.focus = () => this.editorRef.current.focus();
		this.onChange = (editorState) => this.setState({editorState});

		this.handleKeyCommand = this._handleKeyCommand.bind(this);
		this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
		this.toggleBlockType = this._toggleBlockType.bind(this);
		this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
	}

	_handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this._onChange(newState);
			return true;
		}
		return false;
	}

	_mapKeyToEditorCommand(e) {
		if (e.keyCode === 9 /* TAB */) {
			const newEditorState = RichUtils.onTab(
				e,
				this.state.editorState,
				4, /* maxDepth */
			);
			if (newEditorState !== this.state.editorState) {
				this.onChange(newEditorState);
			}
			return;
		}
		return getDefaultKeyBinding(e);
	}

	_toggleBlockType(blockType) {
		this.onChange(
			RichUtils.toggleBlockType(
				this.state.editorState,
				blockType
			)
		);
	}

	_toggleInlineStyle(inlineStyle) {
		this.onChange(
			RichUtils.toggleInlineStyle(
				this.state.editorState,
				inlineStyle
			)
		);
	}

	_blockRenderer = (block) => {
		if (block.getType() === 'atomic') {
			return {
				component: TeXBlock,
				editable: false,
				props: {
					onStartEdit: (blockKey) => {
						const {liveTeXEdits} = this.state;
						this.setState({liveTeXEdits: liveTeXEdits.set(blockKey, true)});
					},
					onFinishEdit: (blockKey, newContentState) => {
						const {liveTeXEdits} = this.state;
						this.setState({
							liveTeXEdits: liveTeXEdits.remove(blockKey),
							editorState: EditorState.createWithContent(newContentState),
						});
					},
					onRemove: (blockKey) => this._removeTeX(blockKey),
				},
			};
		}
		return null;
	};

	_onChange = (editorState) => this.setState({editorState});

	_removeTeX = (blockKey) => {
		const {editorState, liveTeXEdits} = this.state;
		this.setState({
			liveTeXEdits: liveTeXEdits.remove(blockKey),
			editorState: removeTeXBlock(editorState, blockKey),
		});
	};

	_insertTeX = () => {
		this.setState({
			liveTeXEdits: Map(),
			editorState: insertTeXBlock(this.state.editorState),
		});
	};

	render() {
		const {editorState} = this.state;

		// If the user changes block type before entering any text, we can
		// either style the placeholder or hide it. Let's just hide it now.
		let className = 'RichEditor-editor';
		let contentState = editorState.getCurrentContent();
		if (!contentState.hasText()) {
			if (contentState.getBlockMap().first().getType() !== 'unstyled') {
				className += ' RichEditor-hidePlaceholder';
			}
		}

		const convertToTeX = () => {
			const editorContentRaw = convertToRaw(contentState);
			console.log(editorContentRaw)

			let allTeX = [], offset = 0, length = 0, someTeX = editorContentRaw.blocks
			let Math = [], someMath = editorContentRaw.entityMap

			if (Object.keys(someMath).length) {
				for (let i = 0; i < Object.keys(someMath).length; i++) {
					Math.push(Object.values(someMath)[i].data.content)
				}
			}

			let count = 0
			for (let k = 0; k < someTeX.length; k++) {
				let TeX = ''
				let styledStartOffset = [], someTeXInlineStyleSort = [];

				for (let i = 0; i < someTeX[k].inlineStyleRanges.length; i++) {
					let o = someTeX[k].inlineStyleRanges[i].offset;
					styledStartOffset.push(o);
				}

				styledStartOffset.sort((a, b) => a - b);

				for (let i = 0; i < styledStartOffset.length; i++) {
					for (let item in someTeX[k].inlineStyleRanges) {
						if (someTeX[k].inlineStyleRanges[item].offset === styledStartOffset[i]) {
							someTeXInlineStyleSort.push(someTeX[k].inlineStyleRanges[item]);
						}
					}
				}

				/**
				 * ** text split algorithm **
				 * split with inlineStyledText offset and its length
				 */

				if (someTeX[k].inlineStyleRanges.length === 0) {
					if (someTeX[k].type === 'unstyled') {
						TeX += someTeX[k].text
					} else if (someTeX[k].type === 'atomic') {
						someTeX[k].text = Math[count]
						TeX += someTeX[k].text
						count++
					} else {
						TeX += texMap[someTeX[k].type] + '{' + someTeX[k].text + '}'
					}
					TeX += '<br />'
				} else {
					for (let i = 0; i < someTeXInlineStyleSort.length; i++) {
						let startOffset = styledStartOffset[i];
						let styledTextLength = someTeXInlineStyleSort[i].length;
						let textStyle = someTeXInlineStyleSort[i].style;

						if (i === 0) {
							TeX += someTeX[k].text.slice(0, startOffset)
						} else {
							TeX += someTeX[k].text.slice(offset + length, startOffset)
						}
						TeX += texMap[textStyle] + '{' + someTeX[k].text.slice(startOffset, startOffset + styledTextLength) + '}'

						if (i === someTeXInlineStyleSort.length - 1) {
							TeX += someTeX[k].text.slice(startOffset + styledTextLength) + '<br/>'
						}
						offset = startOffset;
						length = styledTextLength
					}
				}

				allTeX.push(TeX)
			}

			displayTeX(allTeX)
		}

		const displayTeX = (tex) => {
			let listHTML = '<pre><code class="latex">';
			for (let i = 0; i < tex.length; i++) {
				let note = tex[i];
				listHTML += note;
			}
			listHTML += '</code></pre>';
			document.getElementById('tex').innerHTML = listHTML;
			highlightCallBack()
		}

		return (
			<div className='two'>
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
					<button
						onClick={this._insertTeX}
						className="TeXEditor-insert math"
					>
						{'Math'}
					</button>
						<button
							onClick={convertToTeX}
							className='TeXEditor-insert display'
						>
							{'Display'}
						</button>
				</div>
					<div className={className} onClick={this.focus}>
						<Editor
							blockRendererFn={this._blockRenderer}
							blockStyleFn={getBlockStyle}
							customStyleMap={styleMap}
							editorState={editorState}
							handleKeyCommand={this.handleKeyCommand}
							keyBindingFn={this.mapKeyToEditorCommand}
							onChange={this.onChange}
							placeholder="Tell a story..."
							readOnly={this.state.liveTeXEdits.count()}
							ref={this.editorRef}
							spellCheck={true}
						/>
					</div>
				</div>
				<div id='tex'>
					<p className='compiled'>{'% LaTeX code will appear below...'}</p>
				</div>
			</div>
		);
	}
}

const texMap = {
	'header-one': '\\section',
	'header-two': '\\subsection',
	'header-three': '\\subsubsection',
	'BOLD': '\\textbf',
	'ITALIC': '\\textit',
	'UNDERLINE': '\\underline',
	'CODE': '\\texttt'
};

// Custom overrides for "code" style.
const styleMap = {
	CODE: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
		fontSize: 16,
		padding: 2,
	},
};

function getBlockStyle(block) {
	switch (block.getType()) {
		case 'blockquote':
			return 'RichEditor-blockquote';
		default:
			return null;
	}
}

class StyleButton extends React.Component {
	constructor(props) {
		super(props);
		this.onToggle = (e) => {
			e.preventDefault();
			this.props.onToggle(this.props.style);
		};
	}

	render() {
		let className = 'RichEditor-styleButton';
		if (this.props.active) {
			className += ' RichEditor-activeButton';
		}

		return (
			<span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
		);
	}
}

const BLOCK_TYPES = [
	{label: 'H1', style: 'header-one'},
	{label: 'H2', style: 'header-two'},
	{label: 'H3', style: 'header-three'},
	// {label: 'H4', style: 'header-four'},
	// {label: 'H5', style: 'header-five'},
	// {label: 'H6', style: 'header-six'},
	// {label: 'Blockquote', style: 'blockquote'},
	// {label: 'UL', style: 'unordered-list-item'},
	// {label: 'OL', style: 'ordered-list-item'},
	// {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
	const {editorState} = props;
	const selection = editorState.getSelection();
	const blockType = editorState
		.getCurrentContent()
		.getBlockForKey(selection.getStartKey())
		.getType();

	return (
		<div className="RichEditor-controls">
			{BLOCK_TYPES.map((type) =>
				<StyleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			)}
		</div>
	);
};

const INLINE_STYLES = [
	{label: 'Bold', style: 'BOLD'},
	{label: 'Italic', style: 'ITALIC'},
	{label: 'Underline', style: 'UNDERLINE'},
	{label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
	const currentStyle = props.editorState.getCurrentInlineStyle();

	return (
		<div className="RichEditor-controls">
			{INLINE_STYLES.map((type) =>
				<StyleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			)}
		</div>
	);
};

export default RichTextEditor;