import React from 'react'
import { convertToRaw, ContentState } from 'draft-js'
import Toolbar from './Toolbar'
import Loading from '../Loading'
import { zoteroUrl } from '../baseUrl'
import {
	convertToTeX, previewPDF, postData, postBib,
} from './utils'

const allTeX: string[] = []

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

	loadPDF = (): void => {
		const convertAndPost = (): void => {
			const { contentState, store } = this.props
			const {
				biblatex,
				bib, messageContent, content,
			} = this.state
			convertToTeX(contentState, biblatex, allTeX)
			this.setState({
				content: allTeX,
			}, () => {
				/**
				 * TODO load pdf
				 *  if and only if
				 *      - [x] this.state.data is not empty
				 *      - [ ] and not equal to prevState.data
				 */

				if (contentState.hasText()) {
					if (Object.keys(bib).length !== 0 && bib.constructor === Object) {
						postBib(bib, store)
							.then(() => {
								postData(content, store)
									.then(() => {
										previewPDF(store)
										this.setState({
											isLoading: false,
											previewStyle: 'preview',
											disabled: false,
										})
									})
							})
					} else {
						postData(content, store)
							.then(() => {
								previewPDF(store)
								this.setState({
									isLoading: false,
									previewStyle: 'preview',
									disabled: false,
								})
							})
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
