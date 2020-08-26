import React from 'react'

const coordinate = [] // which table cell clicked

const TableOutput = (props) => {
	const {
		onClick, row, column, caption, cell, onBlur,
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
	const colsTh = []

	// colsTh
	for (let i = 0; i < column; i += 1) {
		colsTh.push(<th key={i}>{cell[0][i]}</th>)
	}

	// rowsTh
	rowsTh.push(
		// TODO key-1
		<thead key="hhh">
			<tr>{colsTh}</tr>
		</thead>,
	)

	// tbody
	if (row > 1) {
		for (let i = 1; i < row; i += 1) {
			const cols = [] // look out, it's local in for loop, not out like @row
			for (let j = 0; j < column; j += 1) {
				cols.push(
					<td
						key={i + j} // TODO key-2
						onDoubleClick={() => coordinate.push([i, j])}
					>
						{cell[i][j]}
					</td>,
				)
			}
			rows.push(<tr key={i}>{cols}</tr>) // TODO key-3
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
	const entity = props.contentState.getEntity(
		props.block.getEntityAt(0),
	)
	const shape = entity.getData()

	function handleClick(evt) {
		const trTarget = evt.target
		props.blockProps.onStartEdit(props.block.getKey())
		trTarget.contentEditable = true
	}

	function handleBlur(evt) {
		const trTarget = evt.target
		trTarget.contentEditable = false

		// find the coordinate of the node clicked
		const x1 = coordinate[coordinate.length - 1][0]
		const y1 = coordinate[coordinate.length - 1][1]

		// update shape.cell[i][j]
		shape.cell[x1][y1] = trTarget.innerHTML
		props.blockProps.onFinishTableEdit(props.block.getKey())
	}

	return (
		<TableOutput
			row={shape.row}
			column={shape.column}
			caption={shape.caption}
			cell={shape.cell}
			onClick={handleClick}
			onBlur={handleBlur}
		/>
	)
}

export default TableBlock
