import React from 'react'
import { tableShape } from './ModalTable'

const T = (props) => {
	const { onDoubleClick } = props
	const container = React.useRef(null)

	/**
	 * if rowNum === 1
	 *  tBody = (thead>tr>th*colNum{heading $})
	 *      +
	 *          (tbody>tr*rowNum - 1>td*colNum{cell $})
	 * else
	 *  tBody = tbody>tr*rowNum>td*colNum{cell $}
	 */

	return tableShape.map((metadata) => {
		const rows = []
		const rowsTh = []
		const cols = []
		const colsTh = []

		// colsTh
		for (let i = 0; i < metadata.column; i += 1) {
			colsTh.push(<th key={i}>heading</th>)
		}

		// rowsTh
		rowsTh.push(
			<thead key="hhh">
				<tr>{colsTh}</tr>
			</thead>,
		)

		// tbody
		if (metadata.row > 1) {
			for (let i = 0; i < metadata.column; i += 1) {
				cols.push(<td key={i}>cell</td>)
			}
			for (let i = 1; i < metadata.row; i += 1) {
				rows.push(<tr key={i}>{cols}</tr>)
			}
		}

		return (
			<table className="hoverTable" onDoubleClick={onDoubleClick} ref={container}>
				<caption>{metadata.caption}</caption>
				{rowsTh}
				<tbody>{rows}</tbody>
			</table>
		)
	})
}

class TableBlock extends React.Component {
	constructor(props) {
		super(props)

		this.onDoubleClick = () => {
		}
	}

	render() {
		return (
			<div>
				<T
					onDoubleClick={this.onDoubleClick}
				/>
			</div>
		)
	}
}

export default TableBlock
