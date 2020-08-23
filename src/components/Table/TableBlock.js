import React from 'react'

const T = (props) => {
	const {
		onDoubleClick, row, column, caption,
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
		<table className="hoverTable" onDoubleClick={onDoubleClick} ref={container}>
			<caption>{caption}</caption>
			{rowsTh}
			<tbody>{rows}</tbody>
		</table>
	)
}

class TableBlock extends React.Component {
	constructor(props) {
		super(props)

		this.onDoubleClick = () => {
		}
	}

	render() {
		const entity = this.props.contentState.getEntity(
			this.props.block.getEntityAt(0),
		)
		const shape = entity.getData()
		return (
			<div>
				<T
					row={shape.row}
					column={shape.column}
					caption={shape.caption}
					onDoubleClick={this.onDoubleClick}
				/>
			</div>
		)
	}
}

export default TableBlock
