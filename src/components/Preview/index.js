import React from 'react'
import { convertToRaw } from 'draft-js'
import Toolbar from './Toolbar'
import Loading from '../Loading'
import baseUrl from '../baseUrl/baseUrl'

const allTeX = []

class Preview extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			content: [],
			message: '',
			messageContent: '',
			isLoading: false,
			previewStyle: 'preview',
			messageStyle: 'error-message',
			disabled: false,
			biblatex: [],
			bib: {},
		}
	}

	displayError = (messageContent) => {
		this.setState({
			message: messageContent,
			messageStyle: 'error-message error-message-active',
		})
		setTimeout(
			() => {
				this.setState({ messageStyle: 'tips-fade' })
			},
			3000,
		)
	}

	convertToTeX = () => {
		const editorContentRaw = convertToRaw(this.props.contentState)
		allTeX.length = 0

		const { blocks, entityMap } = editorContentRaw
		const Math = []
		const citations = []

		// Blocks Processing
		if (Object.keys(entityMap).length) {
			for (let i = 0; i < Object.keys(entityMap).length; i += 1) { // Iterating <entityMap> ...
				if (entityMap[i].type === 'TOKEN') {
					Math.push(Object.values(entityMap)[i].data.content)
				} else if (entityMap[i].type === 'TABLE') {
					// TODO table

					Math.push('sorry, but the table feature has not finished !!!')
				} else if (entityMap[i].type === 'CITATION') {
					const { key } = entityMap[i].data

					this.state.biblatex.filter((item) => {
						const title = item[key]
						if (title !== undefined) {
							citations.push(`\\cite{${title}}`)
						}
						return null
					})
				}
			}
		}

		let count = 0

		/**
		 * TODO optimization
		 *  -- Oops!!!
		 *  O(n^2) algorithm
		 */

		for (let k = 0; k < blocks.length; k += 1) { // Iterating <blocks> ...
			let TeX = ''
			const { inlineStyleRanges, entityRanges } = blocks[k]

			const ranges = []

			inlineStyleRanges.forEach((item) => {
				ranges.push(item)
			})
			entityRanges.forEach((item) => {
				ranges.push(item)
			})

			ranges.sort((a, b) => a.offset - b.offset)

			/**
			 * ** text split algorithm **
			 * split with inlineStyledText offset and its length
			 */

			let position = 0
			let index = 0 // citations[Index]
			// let { text } = blocks[k]
			const { type } = blocks[k]

			switch (type) {
			case 'unstyled':
				if (ranges.length !== 0) {
					for (let i = 0; i < ranges.length; i += 1) {
						// 1. find the offset and length of styled text.
						const { offset, length, style } = ranges[i]
						// 2. slice and concat.
						const plaintext = blocks[k].text.slice(position, offset)
						let styledText = ''

						if (style === undefined) {
							// cite item
							styledText = citations[index]
							index += 1
						} else {
							// inline style
							styledText = `${texMap[style]}{${blocks[k].text.slice(offset, offset + length)}}`
						}
						const finalText = plaintext.concat(styledText)
						// 3. append to TeX.
						TeX += finalText
						position = offset + length
						if (i === ranges.length - 1) {
							TeX += blocks[k].text.slice(position)
						}
					}
				} else {
					TeX += blocks[k].text
				}
				break
			case 'atomic':
				blocks[k].text = Math[count]
				TeX += blocks[k].text
				count += 1

				break
			default:
				TeX += `${texMap[type]}{${blocks[k].text}}`
			}

			allTeX.push(TeX)
		}
	}

	storeCitations = (callback) => {
		// const currentContent = this.state.editorState.getCurrentContent()
		const editorContentRaw = convertToRaw(this.props.contentState)
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
				} else {
					callback()
				}
			}
		}
	}

	postData = () => {
		const TOKEN = `Bearer ${this.props.store.token}`
		fetch(`${baseUrl}draftJS`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: TOKEN,
			},
			body: JSON.stringify(this.state.content),
		})
			.then((res) => res.json())
			.then(() => {
				this.previewPDF(this.props.store)
				this.setState({
					isLoading: false,
					previewStyle: 'preview',
					disabled: false,
				})
			})
	}

	postBib = () => {
		const TOKEN = `Bearer ${this.props.store.token}`
		return fetch(`${baseUrl}draftJS/tex`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: TOKEN,
			},
			body: JSON.stringify(this.state.bib),
		})
			.then((res) => res.json())
	}

	previewPDF = () => {
		const token = `Bearer ${this.props.store.token}`
		fetch(`${baseUrl}draftJS/pdf`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/pdf',
				Authorization: token,
			},
		})
			.then((res) => {
				res.blob()
					.then((data) => {
						const fileURL = URL.createObjectURL(data)
						const pdf = document.getElementById('pdf')
						pdf.src = fileURL
						// window.open(fileURL)
					})
			})
	}

	loadPDF = () => {
		const convertAndPost = () => {
			this.convertToTeX()
			this.setState({
				content: allTeX,
			}, () => {
				/**
				 * TODO load pdf
				 *  if and only if
				 *      - [x] this.state.data is not empty
				 *      - [ ] and not equal to prevState.data
				 */

				if (this.props.contentState.hasText()) {
					if (Object.keys(this.state.bib).length !== 0 && this.state.bib.constructor === Object) {
						this.postBib(this.props.store, this.state.bib)
							.then(() => {
								this.postData(this.props.store, this.state.content)
							})
					} else {
						this.postData(this.props.store, this.state.content)
					}
				} else {
					this.setState({
						messageContent: 'Nothing you wrote',
					}, () => {
						this.displayError(this.state.messageContent)
					})
				}
			})
		}
		this.setState({
			isLoading: true,
			previewStyle: 'preview loading',
			disabled: true,
		}, () => {
			this.storeCitations(convertAndPost)
		})
	}

	preview = () => {
		if (this.props.login) {
			this.loadPDF()
		} else {
			this.setState({
				messageContent: 'You need to login first!',
			}, () => {
				this.displayError(this.state.messageContent)
			})
		}
	}

	render() {
		const ErrorMessage = () => <p className={this.state.messageStyle}>{this.state.message}</p>
		return (
			<div className={this.state.previewStyle}>
				<ErrorMessage />
				<Toolbar
					login={this.props.login}
					store={this.props.store}
					disabled={this.state.disabled}
					onClick={this.preview}
				/>
				<iframe
					id="pdf"
					title="hello"
				/>
				<Loading isLoading={this.state.isLoading} />
			</div>
		)
	}
}

const texMap = {
	'header-one': '\\section',
	'header-two': '\\subsection',
	'header-three': '\\subsubsection',
	BOLD: '\\textbf',
	ITALIC: '\\textit',
	UNDERLINE: '\\underline',
	CODE: '\\texttt',
}

export default Preview
