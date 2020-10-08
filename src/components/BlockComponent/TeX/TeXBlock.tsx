import React from 'react'

const KaTexOutput = ({
	content,
	onClick,
}: any) => {
	const container = React.useRef<HTMLElement>(null!)
	const prevProps = usePrevious(content)

	React.useEffect(() => {
		if (prevProps !== content) {
			update()
		}
	})

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'value' implicitly has an 'any' type.
	function usePrevious(value) {
		const ref = React.useRef(null)
		React.useEffect(() => {
			ref.current = value
		})
		return ref.current
	}

	function update() {
		// @ts-ignore
		katex.render(
			content,
			container.current,
			{ displayMode: true },
		)
	}

	return <span ref={container} onClick={onClick} />
}

type TeXBlockState = any

class TeXBlock extends React.Component<{}, TeXBlockState> {
	constructor(props: {}) {
		super(props)
		this.state = { editMode: false }
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'textareaRef' does not exist on type 'TeX... Remove this comment to see the full error message
		this.textareaRef = React.createRef()

		// @ts-expect-error ts-migrate(2339) FIXME: Property 'onClick' does not exist on type 'TeXBloc... Remove this comment to see the full error message
		this.onClick = () => {
			if (this.state.editMode) {
				return
			}

			this.setState({
				editMode: true,
				texValue: this.getValue(),
			}, () => {
				// @ts-expect-error ts-migrate(2339) FIXME: Property 'startEdit' does not exist on type 'TeXBl... Remove this comment to see the full error message
				this.startEdit()
			})
		}

		// @ts-expect-error ts-migrate(2339) FIXME: Property 'onValueChange' does not exist on type 'T... Remove this comment to see the full error message
		this.onValueChange = (evt) => {
			const { value } = evt.target
			let invalid = false
			try {
				// @ts-ignore
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

		// @ts-expect-error ts-migrate(2339) FIXME: Property 'save' does not exist on type 'TeXBlock'.
		this.save = () => {
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'block' does not exist on type 'Readonly<... Remove this comment to see the full error message
			const entityKey = this.props.block.getEntityAt(0)
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'contentState' does not exist on type 'Re... Remove this comment to see the full error message
			const newContentState = this.props.contentState.mergeEntityData(
				entityKey,
				{ content: this.state.texValue },
			)
			this.setState({
				invalidTeX: false,
				editMode: false,
				texValue: null,
				// @ts-expect-error ts-migrate(2339) FIXME: Property 'finishEdit' does not exist on type 'TeXB... Remove this comment to see the full error message
			}, this.finishEdit.bind(this, newContentState))
		}

		// @ts-expect-error ts-migrate(2339) FIXME: Property 'remove' does not exist on type 'TeXBlock... Remove this comment to see the full error message
		this.remove = () => {
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'blockProps' does not exist on type 'Read... Remove this comment to see the full error message
			this.props.blockProps.onRemove(this.props.block.getKey())
		}
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'startEdit' does not exist on type 'TeXBl... Remove this comment to see the full error message
		this.startEdit = () => {
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'blockProps' does not exist on type 'Read... Remove this comment to see the full error message
			this.props.blockProps.onStartEdit(this.props.block.getKey())
		}
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'finishEdit' does not exist on type 'TeXB... Remove this comment to see the full error message
		this.finishEdit = (newContentState) => {
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'blockProps' does not exist on type 'Read... Remove this comment to see the full error message
			this.props.blockProps.onFinishTeXEdit(
				// @ts-expect-error ts-migrate(2339) FIXME: Property 'block' does not exist on type 'Readonly<... Remove this comment to see the full error message
				this.props.block.getKey(),
				newContentState,
			)
		}
	}

	getValue() {
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'contentState' does not exist on type 'Re... Remove this comment to see the full error message
		return this.props.contentState
		// @ts-expect-error ts-migrate(2339) FIXME: Property 'block' does not exist on type 'Readonly<... Remove this comment to see the full error message
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
						// @ts-expect-error ts-migrate(2339) FIXME: Property 'onValueChange' does not exist on type 'T... Remove this comment to see the full error message
						onChange={this.onValueChange}
						// @ts-expect-error ts-migrate(2339) FIXME: Property 'textareaRef' does not exist on type 'TeX... Remove this comment to see the full error message
						ref={this.textareaRef.current}
						value={this.state.texValue}
					/>
					<div className="TeXEditor-buttons">
						<button
							className={buttonClass}
							disabled={this.state.invalidTeX}
							// @ts-expect-error ts-migrate(2339) FIXME: Property 'save' does not exist on type 'TeXBlock'.
							onClick={this.save}
							type="button"
						>
							{this.state.invalidTeX ? 'Invalid TeX' : 'Done'}
						</button>
						<button
							className="TeXEditor-removeButton"
							// @ts-expect-error ts-migrate(2339) FIXME: Property 'remove' does not exist on type 'TeXBlock... Remove this comment to see the full error message
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
				{/* @ts-expect-error ts-migrate(2339) FIXME: Property 'onClick' does not exist on type 'TeXBloc... Remove this comment to see the full error message */}
				<KaTexOutput content={texContent} onClick={this.onClick} />
				{editPanel}
			</div>
		)
	}
}

export default TeXBlock
