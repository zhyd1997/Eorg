import React from 'react'
import { convertToRaw } from 'draft-js'
import Toolbar from './Toolbar'
import Loading from '../Loading'
import { baseUrl, zoteroUrl } from '../baseUrl'

const allTeX: any = []

const texMap = {
	'header-one': '\\section',
	'header-two': '\\subsection',
	'header-three': '\\subsubsection',
	'unordered-list-item': '\\item',
	BOLD: '\\textbf',
	ITALIC: '\\textit',
	UNDERLINE: '\\underline',
	CODE: '\\texttt',
}

type State = any

class Preview extends React.Component<{}, State> {
	constructor(props: {}) {
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

	// @ts-expect-error ts-migrate(7006)
	// FIXME: Parameter 'messageContent' implicitly has an 'any'...
	//  Remove this comment to see the full error message
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
		// @ts-expect-error ts-migrate(2339)
		// FIXME: Property 'contentState' does not exist on type 'Re...
		//  Remove this comment to see the full error message
		const editorContentRaw = convertToRaw(this.props.contentState)
		allTeX.length = 0

		const { blocks, entityMap } = editorContentRaw
		const Math = []
		// @ts-expect-error ts-migrate(7034)
		// FIXME: Variable 'citations' implicitly has type 'any[]' i...
		//  Remove this comment to see the full error message
		const citations = []

		const ul = []
		const ulStart = []
		const ulEnd = []
		// @ts-expect-error ts-migrate(7034)
		// FIXME: Variable 'ulIndex' implicitly has type 'any[]' in ...
		//  Remove this comment to see the full error message
		const ulIndex = []
		// @ts-expect-error ts-migrate(7034)
		// FIXME: Variable 'ulDepth' implicitly has type 'any[]' in ...
		//  Remove this comment to see the full error message
		const ulDepth = []
		const ulJumpIndex = []
		const ulJumpDepth = []

		// find ul index

		for (let i = 0; i < blocks.length; i += 1) {
			if (blocks[i].type === 'unordered-list-item') {
				const tempO = Object.create({})

				tempO.index = i
				tempO.depth = blocks[i].depth

				ul.push(tempO)
			}
		}

		for (let i = 0; i < ul.length - 1; i += 1) {
			if (i === 0) {
				ulStart.push(ul[0])
			}
			if (ul[i + 1].index - ul[i].index === 1) {
				if (ul[i + 1].depth > ul[i].depth) {
					ulStart.push(ul[i + 1])
				} else if (ul[i + 1].depth < ul[i].depth) {
					ulEnd.push(ul[i])
				}
			}
			if (i + 1 === ul.length - 1) {
				ulEnd.push(ul[i + 1])
			}
			if (ul[i + 1].index - ul[i].index !== 1) { // look here
				ulEnd.push(ul[i])
				ulStart.push(ul[i + 1])
			}
		}

		ul.forEach((item) => {
			ulIndex.push(item.index)
		})

		ul.forEach((item) => {
			ulDepth.push(item.depth)
		})

		for (let i = 1; i < ulIndex.length; i += 1) {
			// @ts-expect-error ts-migrate(7005)
			// FIXME: Variable 'ulIndex' implicitly has an 'any[]' type.
			if (ulIndex[i] - ulIndex[i - 1] !== 1) {
				// @ts-expect-error ts-migrate(7005)
				// FIXME: Variable 'ulIndex' implicitly has an 'any[]' type.
				ulJumpIndex.push(ulIndex[i - 1])
			}
		}

		for (let i = 1; i < ulDepth.length; i += 1) {
			// @ts-expect-error ts-migrate(7005)
			// FIXME: Variable 'ulDepth' implicitly has an 'any[]' type.
			if (ulDepth[i] - ulDepth[i - 1] !== 1) {
				// @ts-expect-error ts-migrate(7005)
				// FIXME: Variable 'ulDepth' implicitly has an 'any[]' type.
				ulJumpDepth.push(ulDepth[i - 1])
			}
		}

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

					// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'item' implicitly has an 'any' type.
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

			// @ts-expect-error ts-migrate(7034)
			// FIXME: Variable 'ranges' implicitly has type 'any[]' in s...
			//  Remove this comment to see the full error message
			const ranges = []

			inlineStyleRanges.forEach((item) => {
				ranges.push(item)
			})
			entityRanges.forEach((item) => {
				ranges.push(item)
			})

			// @ts-expect-error ts-migrate(7005) FIXME: Variable 'ranges' implicitly has an 'any[]' type.
			ranges.sort((a, b) => a.offset - b.offset)

			/**
			 * ** text split algorithm **
			 * split with inlineStyledText offset and its length
			 */

			let position = 0
			let index = 0 // citations[Index]
			const { type } = blocks[k]

			switch (type) {
				case 'unstyled':
					if (ranges.length !== 0) {
						for (let i = 0; i < ranges.length; i += 1) {
						// 1. find the offset and length of styled text.
							// @ts-expect-error ts-migrate(7005)
							// FIXME: Variable 'ranges' implicitly has an 'any[]' type.
							const { offset, length, style } = ranges[i]
							// 2. slice and concat.
							const plaintext = blocks[k].text.slice(position, offset)
							let styledText = ''

							if (style === undefined) {
							// cite item
								// @ts-expect-error ts-migrate(7005)
								// FIXME: Variable 'citations' implicitly has an 'any[]' typ...
								//  Remove this comment to see the full error message
								styledText = citations[index]
								index += 1
							} else {
							// inline style
								// @ts-expect-error ts-migrate(7053)
								// FIXME: Element implicitly has an 'any' type because expre...
								//  Remove this comment to see the full error message
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
					TeX += '\\begin{equation}'
					TeX += blocks[k].text
					TeX += '\\end{equation}'
					count += 1

					break
				case 'unordered-list-item': // TODO added indentation (depth)
					ulStart.filter((item) => {
						if (item.index === k) {
							TeX += '\\begin{itemize}'
						}
						return null
					})
					TeX += `${texMap[type]} ${blocks[k].text}` // has a space between them.
					if (ulJumpIndex.indexOf(k) !== -1) {
						for (let i = 0; i < blocks[k].depth - 1; i += 1) {
							TeX += '\\end{itemize}'
						}
					}
					if (ulJumpDepth.indexOf(k) !== -1) {
						for (let i = 0; i < blocks[k].depth - 1; i += 1) {
							TeX += '\\end{itemize}'
						}
					}
					ulEnd.filter((item) => {
						if (item.index === k) {
							TeX += '\\end{itemize}'
						}
						return null
					})

					break
				default:
					// @ts-expect-error ts-migrate(7053)
					// FIXME: Element implicitly has an 'any' type because expre...
					//  Remove this comment to see the full error message
					TeX += `${texMap[type]}{${blocks[k].text}}`
			}

			allTeX.push(TeX)
		}
	}

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'callback' implicitly has an 'any' type.
	storeCitations = (callback) => {
		// @ts-expect-error ts-migrate(2339)
		// FIXME: Property 'contentState' does not exist on type 'Re...
		//  Remove this comment to see the full error message
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
			// @ts-expect-error ts-migrate(7034)
			// FIXME: Variable 'tempArray' implicitly has type 'any[]' i...
			//  Remove this comment to see the full error message
			const tempArray = []
			const tempBib = Object.create({})

			for (let i = 0; i < Object.keys(entityMap).length; i += 1) {
				if (entityMap[i].type === 'CITATION') {
					const { key } = entityMap[i].data
					// @ts-expect-error ts-migrate(2345)
					// FIXME: Type 'null' is not assignable to type 'string'.
					const { userID, APIkey } = JSON.parse(localStorage.getItem('zotero-Auth'))
					fetch(`${zoteroUrl}users/${userID}/items/${key}/?format=biblatex`, {
						method: 'GET',
						headers: {
							'Zotero-API-Version': '3',
							'Zotero-API-Key': APIkey,
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

								// @ts-expect-error ts-migrate(7005)
								// FIXME: Variable 'tempArray' implicitly has an 'any[]' typ...
								//  Remove this comment to see the full error message
								if (tempArray.findIndex((item) => item[key] === value) === -1) {
									tempArray.push(temp)
								}
								tempBib[key] = data
								if (i === Object.keys(entityMap).length - 1) {
									if (tempArray.length !== 0) {
										this.setState({
											// @ts-expect-error ts-migrate(7005)
											// FIXME: Variable 'tempArray' implicitly has an 'any[]' typ...
											//  Remove this comment to see the full error message
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
		// @ts-expect-error ts-migrate(2339)
		// FIXME: Property 'store' does not exist on type 'Readonly<...
		//  Remove this comment to see the full error message
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
				// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
				this.previewPDF(this.props.store)
				this.setState({
					isLoading: false,
					previewStyle: 'preview',
					disabled: false,
				})
			})
	}

	postBib = () => {
		// @ts-expect-error ts-migrate(2339)
		// FIXME: Property 'store' does not exist on type 'Readonly<...
		//  Remove this comment to see the full error message
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
		// @ts-expect-error ts-migrate(2339)
		// FIXME: Property 'store' does not exist on type 'Readonly<...
		//  Remove this comment to see the full error message
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
						// @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
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

				// @ts-expect-error ts-migrate(2339)
				// FIXME: Property 'contentState' does not exist on type 'Re...
				//  Remove this comment to see the full error message
				if (this.props.contentState.hasText()) {
					if (Object.keys(this.state.bib).length !== 0 && this.state.bib.constructor === Object) {
						// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 2.
						this.postBib(this.props.store, this.state.bib)
							.then(() => {
								// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 2.
								this.postData(this.props.store, this.state.content)
							})
					} else {
						// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 2.
						this.postData(this.props.store, this.state.content)
					}
				} else {
					this.setState({
						isLoading: false,
						previewStyle: 'preview',
						disabled: false,
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
		// @ts-expect-error ts-migrate(2339)
		// FIXME: Property 'login' does not exist on type 'Readonly<...
		//  Remove this comment to see the full error message
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
					// @ts-expect-error ts-migrate(2339)
					// FIXME: Property 'login' does not exist on type 'Readonly<...
					//  Remove this comment to see the full error message
					login={this.props.login}
					// @ts-expect-error ts-migrate(2339)
					// FIXME: Property 'store' does not exist on type 'Readonly<...
					//  Remove this comment to see the full error message
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

export default Preview
