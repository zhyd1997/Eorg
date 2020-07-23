import React from 'react';
import {Editor, EditorState, getDefaultKeyBinding, RichUtils, convertToRaw} from 'draft-js';
import './RichTextEditor.css';
import '../../node_modules/draft-js/dist/Draft.css';
import highlightCallBack from './Highlight'

class RichTextEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {editorState: EditorState.createEmpty()};
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
			this.onChange(newState);
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

			let allTeX = [], offset = 0, length = 0, someTeX = editorContentRaw.blocks

			for (let k = 0; k < someTeX.length; k++) {
				let TeX = ''
				let oSort = [], someTeXInlineStyleSort = [];

				for (let i = 0; i < someTeX[k].inlineStyleRanges.length; i++) {
					let o = someTeX[k].inlineStyleRanges[i].offset;
					oSort.push(o);
				}
				oSort.sort((a, b) => a - b);

				for (let i = 0; i < oSort.length; i++) {
					for (let item in someTeX[k].inlineStyleRanges) {
						if (someTeX[k].inlineStyleRanges[item].offset === oSort[i]) {
							someTeXInlineStyleSort.push(someTeX[k].inlineStyleRanges[item]);
						}
					}
				}

				if (someTeX[k].inlineStyleRanges.length === 0) {
					if (someTeX[k].type === 'unstyled') {
						TeX += someTeX[k].text
					} else {
						TeX += texMap[someTeX[k].type] + '{' + someTeX[k].text + '}'
					}
					TeX += '<br />'
				} else {

					for (let i = 0; i < someTeXInlineStyleSort.length; i++) {
						let x = oSort[i];
						let p = someTeXInlineStyleSort[i].length;
						let q = someTeXInlineStyleSort[i].style;

						if (i === 0) {
							TeX += someTeX[k].text.slice(0, x)
						} else {
							TeX += someTeX[k].text.slice(offset + length, x)
						}
						TeX += texMap[q] + '{' + someTeX[k].text.slice(x, x + p) + '}'

						if (i === someTeXInlineStyleSort.length - 1) {
							TeX += someTeX[k].text.slice(x + p) + '<br/>'
						}
						offset = x;
						length = p
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
			<div>
				<button onClick={convertToTeX}>Display</button>
				<div className="RichEditor-root">
					<BlockStyleControls
						editorState={editorState}
						onToggle={this.toggleBlockType}
					/>
					<InlineStyleControls
						editorState={editorState}
						onToggle={this.toggleInlineStyle}
					/>
					<div className={className} onClick={this.focus}>
						<Editor
							blockStyleFn={getBlockStyle}
							customStyleMap={styleMap}
							editorState={editorState}
							handleKeyCommand={this.handleKeyCommand}
							keyBindingFn={this.mapKeyToEditorCommand}
							onChange={this.onChange}
							placeholder="Tell a story..."
							ref={this.editorRef}
							spellCheck={true}
						/>
					</div>
				</div>
				<div id='tex' />
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
	constructor() {
		super();
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