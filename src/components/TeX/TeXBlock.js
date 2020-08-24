import katex from 'katex'
import React from 'react'

const KaTexOutput = ({ content, onClick }) => {
	const container = React.useRef(null)
	const prevProps = usePrevious(content)

	React.useEffect(() => {
		if (prevProps !== content) {
			update()
		}
	})

	function usePrevious(value) {
		const ref = React.useRef(null)
		React.useEffect(() => {
			ref.current = value
		})
		return ref.current
	}

	function update() {
		katex.render(
			content,
			container.current,
			{ displayMode: true },
		)
	}

	return <div ref={container} onClick={onClick} />
}

class TeXBlock extends React.Component {
	constructor(props) {
		super(props)
		this.state = { editMode: false }
		this.textareaRef = React.createRef()

		this.onClick = () => {
			if (this.state.editMode) {
				return
			}

			this.setState({
				editMode: true,
				texValue: this.getValue(),
			}, () => {
				this.startEdit()
			})
		}

		this.onValueChange = (evt) => {
			const { value } = evt.target
			let invalid = false
			try {
				katex.__parse(value)
			} catch (e) {
				invalid = true
			} finally {
				this.setState({
					invalidTeX: invalid,
					texValue: value,
				})
			}
		}

		this.save = () => {
			const entityKey = this.props.block.getEntityAt(0)
			const newContentState = this.props.contentState.mergeEntityData(
				entityKey,
				{ content: this.state.texValue },
			)
			this.setState({
				invalidTeX: false,
				editMode: false,
				texValue: null,
			}, this.finishEdit.bind(this, newContentState))
		}

		this.remove = () => {
			this.props.blockProps.onRemove(this.props.block.getKey())
		}
		this.startEdit = () => {
			this.props.blockProps.onStartEdit(this.props.block.getKey())
		}
		this.finishEdit = (newContentState) => {
			this.props.blockProps.onFinishTeXEdit(
				this.props.block.getKey(),
				newContentState,
			)
		}
	}

	getValue() {
		return this.props.contentState
			.getEntity(this.props.block.getEntityAt(0))
			.getData().content
	}

	render() {
		let texContent = null
		if (this.state.editMode) {
			if (this.state.invalidTeX) {
				texContent = ''
			} else {
				texContent = this.state.texValue
			}
		} else {
			texContent = this.getValue()
		}

		let className = 'TeXEditor-tex'
		if (this.state.editMode) {
			className += ' TeXEditor-activeTeX'
		}

		let editPanel = null
		if (this.state.editMode) {
			let buttonClass = 'TeXEditor-saveButton'
			if (this.state.invalidTeX) {
				buttonClass += ' TeXEditor-invalidButton'
			}

			editPanel = (
				<div className="TeXEditor-panel">
					<textarea
						className="TeXEditor-texValue"
						onChange={this.onValueChange}
						ref={this.textareaRef.current}
						value={this.state.texValue}
					/>
					<div className="TeXEditor-buttons">
						<button
							className={buttonClass}
							disabled={this.state.invalidTeX}
							onClick={this.save}
							type="button"
						>
							{this.state.invalidTeX ? 'Invalid TeX' : 'Done'}
						</button>
						<button
							className="TeXEditor-removeButton"
							onClick={this.remove}
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
				<KaTexOutput content={texContent} onClick={this.onClick} />
				{editPanel}
			</div>
		)
	}
}

export default TeXBlock
