import React from 'react'
import { download } from './utils'

type PropTypes = {
	login: boolean,
	disabled: boolean,
	onClick: () => void,
}

const Toolbar: React.FC<PropTypes> = ({
	login, disabled, onClick,
}) => {
	function handleZipDownload(): void {
		download('application/zip', 'zip')
	}

	function handlePDFDownload(): void {
		download('application/pdf', 'pdf')
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
