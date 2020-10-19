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

const store: StoreType = JSON.parse(localStorage.getItem('login')!)

export function parseRawContent(
	contentState: ContentState, biblatex: string[],
): string[] {
	const allTeX: string[] = []
	const editorContentRaw = convertToRaw(contentState)

	const { blocks, entityMap } = editorContentRaw
	const Math = []
	const citations: string[] = []

	const ul = []
	const ulStart = []
	const ulEnd = []
	const ulIndex: number[] = []
	const ulDepth: number[] = []
	const ulJumpIndex = []
	const ulJumpDepth = []

	// find ul index

	for (let i = 0; i < blocks.length; i += 1) {
		if (blocks[i].type === 'unordered-list-item') {
			const tempO = Object.create({})

			tempO.index = i
			tempO.depth = blocks[i].depth

			ul.push(tempO)
		}
	}

	for (let i = 0; i < ul.length - 1; i += 1) {
		if (i === 0) {
			ulStart.push(ul[0])
		}
		if (ul[i + 1].index - ul[i].index === 1) {
			if (ul[i + 1].depth > ul[i].depth) {
				ulStart.push(ul[i + 1])
			} else if (ul[i + 1].depth < ul[i].depth) {
				ulEnd.push(ul[i])
			}
		}
		if (i + 1 === ul.length - 1) {
			ulEnd.push(ul[i + 1])
		}
		if (ul[i + 1].index - ul[i].index !== 1) { // look here
			ulEnd.push(ul[i])
			ulStart.push(ul[i + 1])
		}
	}

	ul.forEach((item) => {
		ulIndex.push(item.index)
	})

	ul.forEach((item) => {
		ulDepth.push(item.depth)
	})

	for (let i = 1; i < ulIndex.length; i += 1) {
		if (ulIndex[i] - ulIndex[i - 1] !== 1) {
			ulJumpIndex.push(ulIndex[i - 1])
		}
	}

	for (let i = 1; i < ulDepth.length; i += 1) {
		if (ulDepth[i] - ulDepth[i - 1] !== 1) {
			ulJumpDepth.push(ulDepth[i - 1])
		}
	}

	// Blocks Processing
	if (Object.keys(entityMap).length) {
		for (let i = 0; i < Object.keys(entityMap).length; i += 1) { // Iterating <entityMap> ...
			if (entityMap[i].type === 'TOKEN') {
				Math.push(Object.values(entityMap)[i].data.content)
			} else if (entityMap[i].type === 'IMAGE') {
				Math.push(Object.values(entityMap)[i].data)
			} else if (entityMap[i].type === 'TABLE') {
				// TODO table

				Math.push('sorry, but the table feature has not finished !!!')
			} else if (entityMap[i].type === 'CITATION') {
				const { key } = entityMap[i].data

				biblatex.filter((item) => {
					const title = item[key]
					if (title !== undefined) {
						citations.push(`\\cite{${title}}`)
					}
					return null
				})
			}
		}
	}

	let count = 0

	/**
	 * TODO optimization
	 *  -- Oops!!!
	 *  O(n^2) algorithm
	 */

	for (let k = 0; k < blocks.length; k += 1) { // Iterating <blocks> ...
		let TeX = ''
		const { inlineStyleRanges, entityRanges } = blocks[k]

		// @ts-expect-error ts-migrate(7034)
		// FIXME: Variable 'ranges' implicitly has type 'any[]' in s...
		//  Remove this comment to see the full error message
		const ranges = []

		inlineStyleRanges.forEach((item) => {
			ranges.push(item)
		})
		entityRanges.forEach((item) => {
			ranges.push(item)
		})

		// @ts-expect-error ts-migrate(7005) FIXME: Variable 'ranges' implicitly has an 'any[]' type.
		ranges.sort((a, b) => a.offset - b.offset)

		/**
		 * ** text split algorithm **
		 * split with inlineStyledText offset and its length
		 */

		let position = 0
		let index = 0 // citations[Index]
		const { type } = blocks[k]

		switch (type) {
			case 'unstyled':
				if (ranges.length !== 0) {
					for (let i = 0; i < ranges.length; i += 1) {
						// 1. find the offset and length of styled text.
						// @ts-expect-error ts-migrate(7005)
						// FIXME: Variable 'ranges' implicitly has an 'any[]' type.
						const { offset, length, style } = ranges[i]
						// 2. slice and concat.
						const plaintext = blocks[k].text.slice(position, offset)
						let styledText = ''

						if (style === undefined) {
							// cite item
							styledText = citations[index]
							index += 1
						} else {
							// inline style
							// @ts-expect-error ts-migrate(7053)
							// FIXME: Element implicitly has an 'any' type because expre...
							//  Remove this comment to see the full error message
							styledText = `${texMap[style]}{${blocks[k].text.slice(offset, offset + length)}}`
						}
						const finalText = plaintext.concat(styledText)
						// 3. append to TeX.
						TeX += finalText
						position = offset + length
						if (i === ranges.length - 1) {
							TeX += blocks[k].text.slice(position)
						}
					}
				} else {
					TeX += blocks[k].text
				}
				break
			case 'atomic':
				if (Math[count].caption !== undefined) {
					TeX += '\\begin{figure}'
					TeX += `\\caption{${Math[count].caption}}`
					TeX += '\\centering'
					if (Math[count].path !== 'logo192.png') {
						TeX += `\\includegraphics[scale=0.1]{./images/${Math[count].path}}`
					} else {
						alert('change default image first!!')
					}
					TeX += '\\end{figure}'
					count += 1
				} else {
					blocks[k].text = Math[count]
					TeX += '\\begin{equation}'
					TeX += blocks[k].text
					TeX += '\\end{equation}'
					count += 1
				}

				break
			case 'unordered-list-item': // TODO added indentation (depth)
				ulStart.filter((item) => {
					if (item.index === k) {
						TeX += '\\begin{itemize}'
					}
					return null
				})
				TeX += `${texMap[type]} ${blocks[k].text}` // has a space between them.
				if (ulJumpIndex.indexOf(k) !== -1) {
					for (let i = 0; i < blocks[k].depth - 1; i += 1) {
						TeX += '\\end{itemize}'
					}
				}
				if (ulJumpDepth.indexOf(k) !== -1) {
					for (let i = 0; i < blocks[k].depth - 1; i += 1) {
						TeX += '\\end{itemize}'
					}
				}
				ulEnd.filter((item) => {
					if (item.index === k) {
						TeX += '\\end{itemize}'
					}
					return null
				})

				break
			default:
				// @ts-expect-error ts-migrate(7053)
				// FIXME: Element implicitly has an 'any' type because expre...
				//  Remove this comment to see the full error message
				TeX += `${texMap[type]}{${blocks[k].text}}`
		}

		allTeX.push(TeX)
	}
	return allTeX
}

export function previewPDF(): void {
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

export function postData(content: string[]) {
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

export function postBib(bib: {}) {
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
	contentType: string, fileExtension: string,
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
