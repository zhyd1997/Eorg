import { convertToRaw } from 'draft-js'

export const allTeX = []

const convertToTeX = (contentState, biblatex) => {
	const editorContentRaw = convertToRaw(contentState)

	allTeX.length = 0
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
	 *  O(n^2) algorithm
	 */

	for (let k = 0; k < someTeX.length; k += 1) { // Iterating <blocks> ...
		let TeX = ''
		const someTeXInline = someTeX[k].inlineStyleRanges
		const someTeXEntity = someTeX[k].entityRanges

		const ranges = []

		someTeXInline.forEach((item) => {
			ranges.push(item)
		})
		someTeXEntity.forEach((item) => {
			ranges.push(item)
		})

		ranges.sort((a, b) => a.offset - b.offset)

		/**
		 * ** text split algorithm **
		 * split with inlineStyledText offset and its length
		 */

		let position = 0
		let index = 0 // Math[Index]

		switch (someTeX[k].type) {
		case 'unstyled':
			console.log(Math)
			for (let i = 0; i < ranges.length; i += 1) {
				// 1. find the offset and length of styled text.
				const { offset, length, style } = ranges[i]
				// 2. slice and concat.
				const plaintext = someTeX[k].text.slice(position, offset)
				let styledText = ''

				if (style === undefined) {
					// inline-style
					styledText = Math[index]
					index += 1
				} else {
					// cite item
					styledText = `${texMap[style]}{${someTeX[k].text.slice(offset, offset + length)}}`
				}
				const finalText = plaintext.concat(styledText)
				// 3. append to TeX.
				TeX += finalText
				position = offset + length
				if (i === ranges.length - 1) {
					TeX += someTeX[k].text.slice(position)
				}
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
