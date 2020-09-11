import React from 'react'
import baseUrl from './baseUrl/baseUrl'

const Download = ({ store }) => {
	const download = (auth, contentType, fileExtension = '') => {
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
						link.parentNode.removeChild(link)
					})
			})
	}

	function handleLaTeXDownload() {
		download(store, 'application/x-tex', 'tex')
	}

	function handlePDFDownload() {
		download(store, 'application/pdf')
	}

	return (
		<div className="download">
			<span>Download</span>
			&nbsp;&nbsp;
			<button type="button" onClick={handleLaTeXDownload}>
				LaTeX
			</button>
			&nbsp;&nbsp;
			<button type="button" onClick={handlePDFDownload}>
				PDF
			</button>
			&nbsp;&nbsp;
		</div>
	)
}

export default Download
