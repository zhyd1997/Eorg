import React from 'react'
import { baseUrl } from '../../../baseUrl'

type PropTypes = {
	id: string,
	update: (name: string) => void,
	save: (name?: string) => void,
}

const Image: React.FC<PropTypes> = ({ id, update, save }) => {
	let image: File
	const store = JSON.parse(localStorage.getItem('login')!)
	// @ts-ignore
	function handleSubmit(e) {
		e.preventDefault()
		const TOKEN = `Bearer ${store.token}`
		const formData = new FormData()
		formData.append('test', image)
		formData.append('id', id)
		fetch(`${baseUrl}figure`, {
			method: 'POST',
			headers: {
				// There is no need to assign a header:
				// 'Content-Type': 'multipart/form-data',
				// The browser substitutes its own.
				Authorization: TOKEN,
			},
			body: formData,
		})
			.then(() => update(image.name))
	}

	// @ts-ignore
	function handleChange(e) {
		[image] = e.target.files
	}

	function handleClick() {
		save(image.name)
	}

	return (
		<form className="img-form" onSubmit={handleSubmit}>
			<label htmlFor="fileElem">
				<input
					type="file"
					id="fileElem"
					accept="image/png, image/jpeg"
					className="visually-hidden"
					name="test"
					onChange={handleChange}
				/>
			</label>
			<br />
			<button type="submit" className="TeXEditor-saveButton">Upload</button>
			<button type="button" className="TeXEditor-removeButton" onClick={handleClick}>
				Cancel
			</button>
		</form>
	)
}

export default Image
