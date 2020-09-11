import React, { useState } from 'react'
import {
	Button, Modal, ModalHeader, ModalBody, ModalFooter,
	// Col, Row, Form, FormGroup, Label, Input,
} from 'reactstrap'

export const tableShape = []

const ModalTable = (props) => {
	const {
		buttonLabel,
		className,
		// onClick,
	} = props

	const [modal, setModal] = useState(false)
	// const rowRef = React.useRef(null)
	// const columnRef = React.useRef(null)
	// const captionRef = React.useRef(null)

	const toggle = () => setModal(!modal)

	// const handleClick = () => {
	// 	const tableData = {
	// 		row: rowRef.current.value,
	// 		column: columnRef.current.value,
	// 		caption: captionRef.current.value,
	// 	}
	// 	tableShape.push(tableData)
	// 	onClick()
	// 	toggle()
	// }

	return (
		<>
			<button color="danger" onClick={toggle} type="button" className="math RichEditor-styleButton">{buttonLabel}</button>
			<Modal isOpen={modal} toggle={toggle} className={className}>
				<ModalHeader toggle={toggle}>
					Tips: &nbsp;the table feature has not finished yet.
				</ModalHeader>
				<ModalBody>
					<p>
						You can use &nbsp;
						<a href="https://www.tablesgenerator.com/">tables generator</a>
						&nbsp; or &nbsp;
						<a href="https://ctan.org/pkg/excel2latex?lang=en">excel2latex</a>
						&nbsp; to create a table and then click &nbsp;
						<b>Math</b>
						&nbsp; button to insert a table.
					</p>

					{/* not finished yet */
					/* <Form>
						<Row form>
							<Col md={6}>
								<FormGroup>
									<Label for="tableRow">Row</Label>
									<Input
										type="text"
										name="row"
										id="tableRow"
										innerRef={rowRef}
									/>
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="tableColumn">Column</Label>
									<Input
										type="text"
										name="column"
										id="tableColumn"
										innerRef={columnRef}
									/>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col>
								<FormGroup>
									<Label for="tableTitle">Title</Label>
									<Input
										type="text"
										name="title"
										id="tableTitle"
										innerRef={captionRef}
									/>
								</FormGroup>
							</Col>
						</Row>
					</Form> */ }
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={toggle}>
						got it
					</Button>
					{/* <Button color="primary" onClick={handleClick}> */}
					{/*	Yes */}
					{/* </Button> */}
					{/* {' '} */}
					{/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
				</ModalFooter>
			</Modal>
		</>
	)
}

export default ModalTable
