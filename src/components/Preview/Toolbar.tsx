import React from 'react'
import { baseUrl } from '../baseUrl'

const Toolbar = (props: any) => {
	const {
		login, store, disabled, onClick,
	} = props

	// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'auth' implicitly has an 'any' type.
	const download = (auth, contentType, fileExtension) => {
		const token = `Bearer ${auth.token}`
		fetch(`${baseUrl}draftJS/${fileExtension}`, {
			method: 'GET',
			headers: {
				'Content-Type': `${contentType}`,
				Authorization: token,
			},
		})
			.then((res) => {
				res.blob()
					.then((data) => {
						const fileURL = URL.createObjectURL(data)
						const link = document.createElement('a')
						link.href = fileURL
						link.setAttribute('download', `main.${fileExtension}`)
						// 3. Append to html page
						document.body.appendChild(link)
						// 4. Force download
						link.click()
						// 5. Clean up and remove the link
						// @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
						link.parentNode.removeChild(link)
					})
			})
	}

	function handleZipDownload() {
		download(store, 'application/zip', 'zip')
	}

	function handlePDFDownload() {
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
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number | ... Remove this comment to see the full error message
				tabIndex="0"
			/>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<i
				className="far fa-file-pdf fa-2x"
				onClick={handlePDFDownload}
				role="button"
				aria-label="pdf"
				aria-hidden="true"
				aria-disabled={disabled}
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number | ... Remove this comment to see the full error message
				tabIndex="-1"
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
