import React from 'react'

const TableOutput = (props) => {
	const {
		onClick, row, column, caption, onBlur,
	} = props
	const container = React.useRef(null)

	/**
	 * if rowNum === 1
	 *  tBody = (thead>tr>th*colNum{heading $})
	 *      +
	 *          (tbody>tr*rowNum - 1>td*colNum{cell $})
	 * else
	 *  tBody = tbody>tr*rowNum>td*colNum{cell $}
	 */

	const rows = []
	const rowsTh = []
	const cols = []
	const colsTh = []

	// colsTh
	for (let i = 0; i < column; i += 1) {
		colsTh.push(<th key={i}>heading</th>)
	}

	// rowsTh
	rowsTh.push(
		<thead key="hhh">
			<tr>{colsTh}</tr>
		</thead>,
	)

	// tbody
	if (row > 1) {
		for (let i = 0; i < column; i += 1) {
			cols.push(<td key={i}>cell</td>)
		}
		for (let i = 1; i < row; i += 1) {
			rows.push(<tr key={i}>{cols}</tr>)
		}
	}

	return (
		// eslint-disable-next-line max-len
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
		<table className="hoverTable" onClick={onClick} ref={container} onBlur={onBlur}>
			<caption>{caption}</caption>
			{rowsTh}
			<tbody>{rows}</tbody>
		</table>
	)
}

const TableBlock = (props) => {
	function handleClick(evt) {
		const trTarget = evt.target
		props.blockProps.onStartEdit(props.block.getKey())
		trTarget.contentEditable = true
	}

	function handleBlur(evt) {
		const trTarget = evt.target
		trTarget.contentEditable = false
		props.blockProps.onFinishTableEdit(props.block.getKey())
	}

	const entity = props.contentState.getEntity(
		props.block.getEntityAt(0),
	)
	const shape = entity.getData()
	return (
		<TableOutput
			row={shape.row}
			column={shape.column}
			caption={shape.caption}
			onClick={handleClick}
			onBlur={handleBlur}
		/>
	)
}

export default TableBlock
