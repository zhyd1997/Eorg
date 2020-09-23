import React, { useState } from 'react'
import {
	Button, Modal, ModalHeader, ModalBody, ModalFooter,
	Form, FormGroup, Label, Input, FormFeedback, FormText,
} from 'reactstrap'
import Loading from '../Loading'
import TableExample from './TableExample'
import { zoteroUrl } from '../baseUrl'

const ModalExample = (props) => {
	const {
		buttonLabel,
		className,
		insertCite,
	} = props

	const [modal, setModal] = useState(false)
	const [modalInput, setModalInput] = useState(false)
	const [targetValue, setTargetValue] = useState(0)
	const [isClick, setIsClick] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [fetchText, setFetchText] = useState([])
	const [auth, setAuth] = useState({
		userID: '',
		APIkey: '',
	})
	const [feedback, setFeedback] = useState({
		isValid: true,
		text: '',
	})

	const toggle = () => setModal(!modal)
	const toggleInput = () => setModalInput(!modalInput)

	const handleChange = (e) => {
		setAuth({
			...auth,
			[e.target.name]: e.target.value,
		})
	}

	const verifyState = (loading, valid, detail) => {
		setIsLoading(loading)
		setFeedback({
			isValid: valid,
			text: detail,
		})
	}

	const verifyAuth = () => {
		verifyState(true, true, '')
		if (auth.userID === '' || auth.APIkey === '') {
			verifyState(false, false, 'empty input')
		} else {
			fetch(`${zoteroUrl}users/${auth.userID}/items`, {
				method: 'GET',
				headers: {
					'Zotero-API-Version': '3',
					'Zotero-API-Key': auth.APIkey,
				},
			})
				.then((res) => {
					if (res.status === 200) {
						if (localStorage.getItem('zotero-Auth') !== null) {
							/**
							 * every user has unique userID, and only API-key can be changed.
							 * if API-key changed, user maybe also changed.
							 * and localStorage Item 'zotero-Auth' changed.
							 */
							const { APIkey } = JSON.parse(localStorage.getItem('zotero-Auth'))
							if (auth.APIkey !== APIkey) {
								localStorage.setItem('zotero-Auth', JSON.stringify({
									userID: auth.userID,
									APIkey: auth.APIkey,
								}))
							}
						} else {
							localStorage.setItem('zotero-Auth', JSON.stringify({
								userID: auth.userID,
								APIkey: auth.APIkey,
							}))
						}
						verifyState(false, true, '')
						createCitations()
					} else if (res.status === 403) {
						verifyState(false, false, `${auth.userID} has invalid API key`)
					} else {
						/**
						 * TODO HTTP status codes
						 * https://www.zotero.org/support/dev/web_api/v3/basics # HTTP Status Codes
						 */

						verifyState(false, false, 'something wrong')
					}
				})
		}
	}

	const handleNext = () => {
		// 1. open input modal
		toggleInput()
	}

	const handleClick = () => {
		// 3. close cite modal
		toggle()
		cite()
	}

	const createCitations = () => {
		// 2. close input modal
		// and open cite modal, fetch citations.
		toggleInput()
		toggle()
		fetchItems()
	}

	const selectItem = (evt) => {
		if (evt.target.tagName === 'TD') {
			const value = evt.target.getAttribute('data-cite')
			setTargetValue(value)
			setIsClick(true)
		}
		return null
	}

	const fetchItems = () => {
		setIsLoading(true)
		const { userID, APIkey } = JSON.parse(localStorage.getItem('zotero-Auth'))
		fetch(`${zoteroUrl}users/${userID}/items`, {
			method: 'GET',
			headers: {
				'Zotero-API-Version': '3',
				'Zotero-API-Key': APIkey,
			},
		})
			.then((res) => {
				res.json()
					.then((data) => {
						/**
						 * [
						 *      {
						 *          key: KEY-1,
						 *          parsedDate: DATE-1,
						 *          title: TITLE-1
						 *      },
						 *      {
						 *          key: KEY-2,
						 *          parsedDate: DATE-2,
						 *          title: TITLE-2
						 *      },
						 *      {
						 *          key: KEY-3,
						 *          parsedDate: DATE-3,
						 *          title: TITLE-3
						 *      },
						 * ]
						 *
						 */
						const metadata = []

						data.map((i) => {
							const tempObj = Object.create({})

							tempObj.key = i.key
							tempObj.creatorSummary = i.meta.creatorSummary
							tempObj.parsedDate = i.meta.parsedDate
							tempObj.title = i.data.title

							metadata.push(tempObj)

							return metadata
						})

						setFetchText(metadata)
						setIsLoading(false)
					})
			})
	}

	const cite = () => {
		insertCite(fetchText, targetValue)
		setIsClick(false)
	}

	return (
		<>
			<button
				type="button"
				onClick={handleNext}
				className="math RichEditor-styleButton"
			>
				{buttonLabel}
			</button>
			<Modal size="sm" isOpen={modalInput} toggle={toggleInput} className={className}>
				<ModalHeader toggle={toggleInput}>Zotero</ModalHeader>
				<ModalBody>
					{
						isLoading ? <Loading isLoading={isLoading} /> : null
					}
					<Form>
						<FormGroup>
							<Label for="userID">userID</Label>
							<Input
								type="text"
								name="userID"
								id="userID"
								onChange={handleChange}
								innerRef={auth.userID}
								invalid={!feedback.isValid}
							/>
							{
								localStorage.getItem('zotero-Auth') !== null
									? (
										<FormText>
											Still use previous API key? please click&nbsp;
											<kbd>Restore User</kbd>
											&nbsp;button.
										</FormText>
									)
									: null
							}
						</FormGroup>
						<FormGroup>
							<Label for="APIkey">API key</Label>
							<Input
								type="text"
								name="APIkey"
								id="APIkey"
								onChange={handleChange}
								innerRef={auth.APIkey}
								invalid={!feedback.isValid}
							/>
							{
								!feedback.isValid
									? <FormFeedback>{feedback.text}</FormFeedback>
									: ''
							}
							<FormText>
								You can create API keys via&nbsp;
								<a
									href="https://www.zotero.org/settings/keys/new"
									rel="noopener noreferrer"
									target="_blank"
								>
									your Zotero account settings
								</a>
								.
							</FormText>
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					{
						localStorage.getItem('zotero-Auth') !== null
							? <Button color="dark" onClick={createCitations}>Restore User</Button>
							: null
					}
					<Button color="primary" onClick={verifyAuth}>Next</Button>
				</ModalFooter>
			</Modal>
			<Modal isOpen={modal} toggle={toggle} className={className}>
				<ModalHeader toggle={toggle}>Zotero</ModalHeader>
				<ModalBody style={{ height: '200px', overflow: 'auto' }}>
					{
						isLoading
							? <Loading isLoading={isLoading} />
							: <TableExample handleClick={selectItem} fetchText={fetchText} />
					}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" disabled={!isClick} onClick={handleClick}>Insert</Button>
					{' '}
					<Button color="secondary" onClick={toggle}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</>
	)
}

export default ModalExample
