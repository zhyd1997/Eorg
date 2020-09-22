import React, { useState } from 'react'
import {
	Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap'
import Loading from '../Loading'
import TableExample from './TableExample'

const ModalExample = (props) => {
	const {
		buttonLabel,
		className,
		insertCite,
	} = props

	const [modal, setModal] = useState(false)
	const [targetValue, setTargetValue] = useState(0)
	const [isClick, setIsClick] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [fetchText, setFetchText] = useState([])

	const toggle = () => setModal(!modal)

	const handleClick = () => {
		toggle()
		cite()
	}

	const createCitations = () => {
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
		fetch('https://api.zotero.org/users/6882019/items', {
			method: 'GET',
			headers: {
				'Zotero-API-Version': '3',
				'Zotero-API-Key': 'UpZgNhfbGzWgHmeWPMg6y10r',
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
			<button type="button" onClick={createCitations} className="math RichEditor-styleButton">{buttonLabel}</button>
			<Modal isOpen={modal} toggle={toggle} className={className}>
				<ModalHeader toggle={toggle}>Modal title</ModalHeader>
				<ModalBody style={{ height: '200px', overflow: 'auto' }}>
					{
						isLoading
							? <Loading isLoading={isLoading} />
							: <TableExample handleClick={selectItem} fetchText={fetchText} />
					}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" disabled={!isClick} onClick={handleClick}>Do Something</Button>
					{' '}
					<Button color="secondary" onClick={toggle}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</>
	)
}

export default ModalExample
