import baseUrl from '../baseUrl/baseUrl'

export function postData(opts) {
	fetch(`${baseUrl}draftJS`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(opts),
	})
		.then((res) => res.json())
		.then((data) => console.log('posted data:', data))
}

export const getPDF = () => {
	fetch(`${baseUrl}draftJS`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/pdf',
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
