import React from 'react'

const TableOutput = (props: any) => {
	const {
		row, column, caption, cell, block, blockProps,
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

	const [coordinate, setCoordinate] = React.useState([1, 0])

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
	function handleClick(evt) {
		const trTarget = evt.target
		blockProps.onStartEdit(block.getKey())
		trTarget.contentEditable = true
	}

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
	function handleBlur(evt) {
		const trTarget = evt.target
		trTarget.contentEditable = false

		// find the coordinate of the node clicked
		const x = coordinate[0]
		const y = coordinate[1]

		// update shape.cell[x][y]
		cell[x][y] = trTarget.innerHTML
		blockProps.onFinishEdit(block.getKey())
	}

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
					// eslint-disable-next-line max-len
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
					<td
						key={i + j} // TODO key-2
						onClick={() => setCoordinate([i, j])}
						id={`Tooltip-${i + j}`}
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
		<table className="hoverTable" onClick={handleClick} ref={container} onBlur={handleBlur}>
			<caption>{caption}</caption>
			{rowsTh}
			<tbody>{rows}</tbody>
		</table>
	)
}

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
const TableBlock = (props) => {
	const { contentState, block, blockProps } = props

	const entity = contentState.getEntity(
		block.getEntityAt(0),
	)
	const shape = entity.getData()

	return (
		<TableOutput
			row={shape.row}
			column={shape.column}
			caption={shape.caption}
			cell={shape.cell}
			block={block}
			blockProps={blockProps}
		/>
	)
}

export default TableBlock
