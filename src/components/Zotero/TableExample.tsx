import React from 'react'

export default function TableExample(props: any) {
	const { fetchText, handleClick } = props
	let i = 0

	return (
		<table className="cite-modal-table">
			<thead>
				<tr>
					<th key="author">Author</th>
					<th key="title">Title</th>
					<th key="date">Date</th>
				</tr>
			</thead>
			{/* eslint-disable-next-line max-len */}
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
			<tbody onClick={handleClick}>
				{/* eslint-disable-next-line no-return-assign */}
				{/* @ts-expect-error ts-migrate(7006) FIXME: Parameter 'data' implicitly has an 'any' type. */}
				{fetchText.map((data) => (
					<tr data-cite={i += 1} key={data.key}>
						<td data-cite={i} key={`${data.key}author`}>{data.creatorSummary}</td>
						<td data-cite={i} key={`${data.key}title`}>{data.title}</td>
						<td data-cite={i} key={`${data.key}date`}>{data.parsedDate}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
