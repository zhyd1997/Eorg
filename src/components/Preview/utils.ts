import { ContentState, convertToRaw } from 'draft-js'
import { baseUrl, zoteroUrl } from '../baseUrl'

type StoreType = {
	token: string,
}

const texMap = {
	'header-one': '\\section',
	'header-two': '\\subsection',
	'header-three': '\\subsubsection',
	'unordered-list-item': '\\item',
	BOLD: '\\textbf',
	ITALIC: '\\textit',
	UNDERLINE: '\\underline',
	CODE: '\\texttt',
}

export function parseRawContent(
	contentState: ContentState, biblatex: string[],
): string[] {
	const allTeX: string[] = []
	const editorContentRaw = convertToRaw(contentState)

	const { blocks, entityMap } = editorContentRaw
	/**
	 * TODO optimization
	 *  -- Oops!!!
	 *  O(n^2) algorithm
	 */
	blocks.forEach((row) => { // by row
		const {
			type, text, inlineStyleRanges, entityRanges,
		} = row
		let tex = ''

		const ranges: { offset: number, length: number, style?: string, key?: number }[] = []
		switch (type) {
			// inline style
			case 'unstyled':
				inlineStyleRanges.forEach((range) => {
					ranges.push(range)
				})
				entityRanges.forEach((range) => {
					ranges.push(range)
				})

				ranges.sort((a, b) => a.offset - b.offset)

				if (ranges.length !== 0) {
					let position = 0
					let finaltex = ''

					ranges.forEach((range, index) => {
						// 1. find the offset and length of styled text.
						const { offset, length, style } = range
						// 2. slice and concat.
						let plaintext = ''
						if (index === 0 && offset !== 0) {
							plaintext += (text.slice(0, offset))
						} else {
							plaintext += (text.slice(position, offset))
						}
						let styledText = ''
						if (range.key !== undefined) {
							const { key } = entityMap[range.key].data
							// TODO biblatex is async... why?
							biblatex.filter((entry) => {
								const identifier = entry[key]
								if (entry[key] !== undefined) {
									styledText = `\\cite{${identifier}}`
								}
								return null
							})
						} else {
							// @ts-ignore
							styledText = `${texMap[style]}{${text.slice(offset, offset + length)}}`
						}
						plaintext += (styledText)
						position = offset + length
						if (index === ranges.length - 1 && position !== text.length) {
							plaintext += (text.slice(position))
						}
						finaltex += plaintext
						// 3. append.
					})
					tex += finaltex
					tex += '\n'
				} else {
					tex += text
					tex += '\n'
				}
				break
			case 'atomic':
				entityRanges.forEach((entityRange) => {
					const { key } = entityRange
					if (entityMap[key].type === 'TOKEN') {
						const { content } = entityMap[key].data
						tex += '\\begin{equation}'
						tex += content
						tex += '\\end{equation}'
					} else if (entityMap[key].type === 'IMAGE') {
						const { path, caption } = entityMap[key].data
						tex += '\\begin{figure}'
						tex += `\\caption{${caption}}`
						tex += '\\centering'
						if (path !== 'logo192.png') {
							tex += `\\includegraphics[scale=0.1]{./images/${path}}`
						}
						tex += '\\end{figure}'
					} else if (entityMap[key].type === 'TABLE') {
						// TODO
					} else {
						// TODO
					}
				})
				break
			case 'code-block':
				// TODO
				break
			case 'ordered-list-item':
				// TODO
				break
			case 'unordered-list-item':
				// TODO
				break
			// block style, except for 'atomic', 'code-block', 'list-item'
			default:
				// @ts-ignore
				tex += `${texMap[type]}{${text}}`
		}
		allTeX.push(tex)
	})

	return allTeX
}

export function previewPDF(store: StoreType): void {
	const TOKEN = `Bearer ${store.token}`
	fetch(`${baseUrl}draftJS/pdf`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/pdf',
			Authorization: TOKEN,
		},
	})
		.then((res) => {
			res.blob()
				.then((data) => {
					const fileURL = URL.createObjectURL(data)
					const pdf = document.getElementById('pdf')
					// @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
					pdf.src = fileURL
					// window.open(fileURL)
				})
		})
}

export function postData(content: string[], store: StoreType) {
	const TOKEN = `Bearer ${store.token}`
	return fetch(`${baseUrl}draftJS`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: TOKEN,
		},
		body: JSON.stringify(content),
	})
		.then((res) => res.json())
}

export function postBib(bib: {}, store: StoreType) {
	const TOKEN = `Bearer ${store.token}`
	fetch(`${baseUrl}draftJS/tex`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: TOKEN,
		},
		body: JSON.stringify(bib),
	})
		.then((res) => res.json())
}

export function fetchBibEntry(key: string, userID: string, APIkey: string) {
	return fetch(`${zoteroUrl}users/${userID}/items/${key}/?format=biblatex`, {
		method: 'GET',
		headers: {
			'Zotero-API-Version': '3',
			'Zotero-API-Key': APIkey,
		},
	})
		.then((res) => res.text())
}

export function download(
	store: StoreType, contentType: string, fileExtension: string,
): void {
	const TOKEN = `Bearer ${store.token}`
	fetch(`${baseUrl}draftJS/${fileExtension}`, {
		method: 'GET',
		headers: {
			'Content-Type': `${contentType}`,
			Authorization: TOKEN,
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
