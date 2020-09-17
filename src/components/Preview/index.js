import React from 'react'
import Toolbar from './Toolbar'
import Loading from '../Loading'
import baseUrl from '../baseUrl/baseUrl'
import convertToTeX, { allTeX } from '../convertContent'

class Preview extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			content: {},
			message: '',
			messageContent: '',
			isLoading: false,
			previewStyle: 'preview',
			messageStyle: 'error-message',
			disabled: false,
		}
	}

	displayError = (content) => {
		this.setState({
			message: content,
			messageStyle: 'error-message error-message-active',
		})
		setTimeout(
			() => {
				this.setState({ messageStyle: 'tips-fade' })
			},
			3000,
		)
	}

	postData = (store, content) => {
		this.setState({
			isLoading: true,
			previewStyle: 'preview loading',
			disabled: true,
		})

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
			.then((data) => {
				console.log('posted data:', data)
				this.previewPDF(store)
				this.setState({
					isLoading: false,
					previewStyle: 'preview',
					disabled: false,
				})
			})
	}

	previewPDF = (store) => {
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
						pdf.src = fileURL
						// window.open(fileURL)
					})
			})
	}

	loadPDF = () => {
		convertToTeX(this.props.contentState)
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
				this.postData(this.props.store, this.state.content)
			} else {
				this.setState({
					messageContent: 'Nothing you wrote',
				}, () => {
					this.displayError(this.state.messageContent)
				})
			}
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

export default Preview
