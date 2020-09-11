import baseUrl from '../baseUrl/baseUrl'

export const postData = (store, opts) => {
	const token = `Bearer ${store.token}`
	fetch(`${baseUrl}draftJS`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token,
		},
		body: JSON.stringify(opts),
	})
		.then((res) => res.json())
		.then((data) => console.log('posted data:', data))
}

export const previewPDF = (store) => {
	const token = `Bearer ${store.token}`
	fetch(`${baseUrl}draftJS/pdf`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/pdf',
			Authorization: token,
		},
	})
		.then((res) => {
			res.blob()
				.then((data) => {
					const fileURL = URL.createObjectURL(data)
					const pdf = document.getElementById('pdf')
					pdf.src = fileURL
					// window.open(fileURL)
				})
		})
}
