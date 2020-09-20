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
		cite,
		fetchText,
		fetchZ,
		handleClickT,
		isLoading,
		isClicked,
	} = props

	const [modal, setModal] = useState(false)

	const toggle = () => setModal(!modal)

	const handleClick = () => {
		toggle()
		cite()
	}

	const anotherClick = () => {
		toggle()
		fetchZ()
	}

	return (
		<div>
			<button type="button" onClick={anotherClick} className="math RichEditor-styleButton">{buttonLabel}</button>
			<Modal isOpen={modal} toggle={toggle} className={className}>
				<ModalHeader toggle={toggle}>Modal title</ModalHeader>
				<ModalBody style={{ height: '200px', overflow: 'auto' }}>
					{
						isLoading
							? <Loading isLoading={isLoading} />
							: <TableExample handleClickT={handleClickT} fetchText={fetchText} />
					}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" disabled={!isClicked} onClick={handleClick}>Do Something</Button>
					{' '}
					<Button color="secondary" onClick={toggle}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</div>
	)
}

export default ModalExample
