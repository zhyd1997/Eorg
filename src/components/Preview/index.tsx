import React from 'react'
import { convertToRaw, ContentState } from 'draft-js'
import Toolbar from './Toolbar'
import Loading from '../Loading'
import { baseUrl, zoteroUrl } from '../baseUrl'

const allTeX: string[] = []

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

type Props = {
	contentState: ContentState,
	store: {
		token: string,
	},
	login: boolean,
}

type State = {
	content: string [],
	message: string,
	messageContent: string,
	isLoading: boolean,
	previewStyle: string,
	messageStyle: string,
	disabled: boolean,
	biblatex: any [],
	bib: {},
}

class Preview extends React.Component<Props, State> {
	constructor(props: Props) {
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

	displayError = (messageContent: string): void => {
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

	convertToTeX = (): void => {
		const { contentState } = this.props
		const { biblatex } = this.state
		const editorContentRaw = convertToRaw(contentState)
		allTeX.length = 0

		const { blocks, entityMap } = editorContentRaw
		const Math = []
		const citations: string[] = []

		const ul = []
		const ulStart = []
		const ulEnd = []
		const ulIndex: number[] = []
		const ulDepth: number[] = []
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
			if (ulIndex[i] - ulIndex[i - 1] !== 1) {
				ulJumpIndex.push(ulIndex[i - 1])
			}
		}

		for (let i = 1; i < ulDepth.length; i += 1) {
			if (ulDepth[i] - ulDepth[i - 1] !== 1) {
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

					biblatex.filter((item) => {
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

	storeCitations = (callback: () => void): void => {
		const { contentState } = this.props
		const editorContentRaw = convertToRaw(contentState)
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
					const { userID, APIkey } = JSON.parse(localStorage.getItem('zotero-Auth')!)
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

	postData = (): void => {
		const { content } = this.state
		const { store } = this.props
		const TOKEN = `Bearer ${store.token}`
		fetch(`${baseUrl}draftJS`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: TOKEN,
			},
			body: JSON.stringify(content),
		})
			.then((res) => res.json())
			.then(() => {
				this.previewPDF()
				this.setState({
					isLoading: false,
					previewStyle: 'preview',
					disabled: false,
				})
			})
	}

	postBib = () => {
		const { bib } = this.state
		const { store } = this.props
		const TOKEN = `Bearer ${store.token}`
		return fetch(`${baseUrl}draftJS/tex`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: TOKEN,
			},
			body: JSON.stringify(bib),
		})
			.then((res) => res.json())
	}

	previewPDF = (): void => {
		const { store } = this.props
		const token = `Bearer ${store.token}`
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

	loadPDF = (): void => {
		const convertAndPost = (): void => {
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

				const { bib, messageContent } = this.state
				const { contentState } = this.props
				if (contentState.hasText()) {
					if (Object.keys(bib).length !== 0 && bib.constructor === Object) {
						this.postBib()
							.then(() => {
								this.postData()
							})
					} else {
						this.postData()
					}
				} else {
					this.setState({
						isLoading: false,
						previewStyle: 'preview',
						disabled: false,
						messageContent: 'Nothing you wrote',
					}, () => {
						this.displayError(messageContent)
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

	preview = (): void => {
		const { messageContent } = this.state
		const { login } = this.props
		if (login) {
			this.loadPDF()
		} else {
			this.setState({
				messageContent: 'You need to login first!',
			}, () => {
				this.displayError(messageContent)
			})
		}
	}

	render() {
		const {
			messageStyle, message,
			previewStyle,
			disabled,
			isLoading,
		} = this.state
		const { login, store } = this.props
		const ErrorMessage = () => <p className={messageStyle}>{message}</p>
		return (
			<div className={previewStyle}>
				<ErrorMessage />
				<Toolbar
					login={login}
					store={store}
					disabled={disabled}
					onClick={this.preview}
				/>
				<iframe
					id="pdf"
					title="hello"
				/>
				<Loading isLoading={isLoading} />
			</div>
		)
	}
}

export default Preview
