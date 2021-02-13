import React from 'react'
import { download } from './utils'

type PropTypes = {
	login: boolean,
	store: {
		token: string,
	},
	disabled: boolean,
	onClick: () => void,
}

const Toolbar = ({
	login, store, disabled, onClick,
}: PropTypes) => {
	function handleZipDownload(): void {
		download(store, 'application/zip', 'zip')
	}

	function handlePDFDownload(): void {
		download(store, 'application/pdf', 'pdf')
	}

	const preview = <button disabled={disabled} className="save" type="button" onClick={onClick}>preview</button>
	const downloadButtons = (
		<span style={{ position: 'absolute', margin: 0, left: '100px' }}>
			<i
				className="far fa-file-archive fa-2x"
				onClick={handleZipDownload}
				role="button"
				aria-label="archive-file"
				aria-hidden="true"
				aria-disabled={disabled}
				tabIndex={0}
			/>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<i
				className="far fa-file-pdf fa-2x"
				onClick={handlePDFDownload}
				role="button"
				aria-label="pdf"
				aria-hidden="true"
				aria-disabled={disabled}
				tabIndex={-1}
			/>
		</span>
	)

	return (
		<div className="download">
			{preview}
			{
				!login ? null : downloadButtons
			}
		</div>
	)
}

export default Toolbar
