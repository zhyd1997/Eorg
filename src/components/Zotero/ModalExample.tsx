import React, { useState } from 'react'
import {
	Button, Modal, ModalHeader, ModalBody, ModalFooter,
	Form, FormGroup, Input, FormFeedback, FormText,
} from 'reactstrap'
import Loading from '../Loading'
import TableExample from './TableExample'
import { zoteroUrl } from '../baseUrl'

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
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

	function toggle(): void {
		setModal(!modal)
	}
	function toggleInput(): void {
		setModalInput(!modalInput)
	}

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
	function handleChange(e): void {
		setAuth({
			...auth,
			[e.target.name]: e.target.value,
		})
	}

	function cite(): void {
		insertCite(fetchText, targetValue)
		setIsClick(false)
	}

	function fetchItems(): void {
		setIsLoading(true)
		// @ts-expect-error ts-migrate(2345) FIXME: Type 'null' is not assignable to type 'string'.
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
						// @ts-ignore
						const metadata = []

						// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'i' implicitly has an 'any' type.
						data.map((i) => {
							const tempObj = Object.create({})

							tempObj.key = i.key
							tempObj.creatorSummary = i.meta.creatorSummary
							tempObj.parsedDate = i.meta.parsedDate
							tempObj.title = i.data.title

							metadata.push(tempObj)

							// @ts-ignore
							return metadata
						})

						// @ts-ignore
						setFetchText(metadata)
						setIsLoading(false)
					})
			})
	}

	function createCitations(): void {
		// 2. close input modal
		// and open cite modal, fetch citations.
		toggleInput()
		toggle()
		fetchItems()
	}

	function verifyState(loading: boolean, valid: boolean, detail: string): void {
		setIsLoading(loading)
		setFeedback({
			isValid: valid,
			text: detail,
		})
	}

	function verifyAuth(): void {
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
							const { APIkey } = JSON.parse(localStorage.getItem('zotero-Auth')!)
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

	function handleNext(): void {
		// 1. open input modal
		toggleInput()
	}

	function handleClick(): void {
		// 3. close cite modal
		toggle()
		cite()
	}

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
	function selectItem(evt): null {
		if (evt.target.tagName === 'TD') {
			const value = evt.target.getAttribute('data-cite')
			setTargetValue(value)
			setIsClick(true)
		}
		return null
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
							<Input
								type="text"
								name="userID"
								id="userID"
								placeholder="userID"
								onChange={handleChange}
								// @ts-expect-error ts-migrate(2769)
								// FIXME: Type 'string' is not assignable to type '((instanc...
								//  Remove this comment to see the full error message
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
							<Input
								type="text"
								name="APIkey"
								id="APIkey"
								placeholder="API key"
								onChange={handleChange}
								// @ts-expect-error ts-migrate(2769)
								// FIXME: Type 'string' is not assignable to type '((instanc...
								//  Remove this comment to see the full error message
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
