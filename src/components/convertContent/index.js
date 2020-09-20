import { convertToRaw } from 'draft-js'

export const allTeX = []

const convertToTeX = (contentState, biblatex) => {
	const editorContentRaw = convertToRaw(contentState)

	allTeX.length = 0
	let offset = 0
	let length = 0
	const someTeX = editorContentRaw.blocks
	const Math = []
	const someMath = editorContentRaw.entityMap

	// Blocks Processing
	if (Object.keys(someMath).length) {
		for (let i = 0; i < Object.keys(someMath).length; i += 1) { // Iterating <entityMap> ...
			if (someMath[i].type === 'TOKEN') {
				Math.push(Object.values(someMath)[i].data.content)
			} else if (someMath[i].type === 'TABLE') {
				// TODO table

				Math.push('sorry, but the table feature has not finished !!!')
			} else if (someMath[i].type === 'CITATION') {
				const { key } = someMath[i].data

				biblatex.filter((item) => {
					const title = item[key]
					if (title !== undefined) {
						Math.push(`\\cite{${title}}`)
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
	 *  O(n^3) algorithm
	 */

	for (let k = 0; k < someTeX.length; k += 1) { // Iterating <blocks> ...
		let TeX = ''
		const styledStartOffset = []
		const someTeXInlineStyleSort = []
		const someTeXInline = someTeX[k].inlineStyleRanges
		const someTeXEntity = someTeX[k].entityRanges

		for (let i = 0; i < someTeXInline.length; i += 1) {
			const o = someTeXInline[i].offset
			styledStartOffset.push(o)
		}

		styledStartOffset.sort((a, b) => a - b)

		for (let i = 0; i < styledStartOffset.length; i += 1) {
			for (let j = 0; j < Object.values(someTeXInline).length; j += 1) {
				if (Object.values(someTeXInline)[j].offset === styledStartOffset[i]) {
					someTeXInlineStyleSort.push(Object.values(someTeXInline)[j])
				}
			}
		}

		/**
		 * ** text split algorithm **
		 * split with inlineStyledText offset and its length
		 */

		if (someTeXInline.length === 0) {
			switch (someTeX[k].type) {
			case 'unstyled':
				if (someTeXEntity.length !== 0 && biblatex.length !== 0) {
					for (let i = 0; i < someTeXEntity.length; i += 1) {
						for (let j = 0; j < someTeXEntity[i].length; j += 1) {
							const startOffset = someTeXEntity[i].offset
							const citeLength = someTeXEntity[i].length
							const t = Math[i]

							if (i === 0) {
								const part1 = someTeX[k].text.slice(0, startOffset)
								TeX += ''.concat(part1, t)
							} else {
								const part1 = someTeX[k].text.slice(offset + length, startOffset)
								TeX += ''.concat(part1, t)
							}

							if (i === someTeXEntity.length - 1) {
								TeX += `${someTeX[k].text.slice(startOffset)}`
							}
							offset = startOffset
							length = citeLength
						}
					}
				} else {
					TeX += someTeX[k].text
				}
				break
			case 'atomic':
				someTeX[k].text = Math[count]
				TeX += someTeX[k].text
				count += 1

				break
			default:
				TeX += `${texMap[someTeX[k].type]}{${someTeX[k].text}}`
			}
		} else {
			for (let i = 0; i < someTeXInlineStyleSort.length; i += 1) {
				const startOffset = styledStartOffset[i]
				const styledTextLength = someTeXInlineStyleSort[i].length
				const textStyle = someTeXInlineStyleSort[i].style

				if (i === 0) {
					TeX += someTeX[k].text.slice(0, startOffset)
				} else {
					TeX += someTeX[k].text.slice(offset + length, startOffset)
				}
				TeX += `${texMap[textStyle]}{${someTeX[k].text.slice(startOffset, startOffset + styledTextLength)}}`

				if (i === someTeXInlineStyleSort.length - 1) {
					TeX += `${someTeX[k].text.slice(startOffset + styledTextLength)}`
				}
				offset = startOffset
				length = styledTextLength
			}
		}

		allTeX.push(TeX)
	}
}

const texMap = {
	'header-one': '\\section',
	'header-two': '\\subsection',
	'header-three': '\\subsubsection',
	BOLD: '\\textbf',
	ITALIC: '\\textit',
	UNDERLINE: '\\underline',
	CODE: '\\texttt',
}

export default convertToTeX
