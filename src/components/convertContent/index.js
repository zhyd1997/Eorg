import { convertToRaw } from 'draft-js'

export const allTeX = []

const convertToTeX = (contentState, biblatex) => {
	const editorContentRaw = convertToRaw(contentState)

	allTeX.length = 0
	const { blocks, entityMap } = editorContentRaw
	const Math = []
	const citations = []

	// Blocks Processing
	if (Object.keys(entityMap).length) {
		for (let i = 0; i < Object.keys(entityMap).length; i += 1) { // Iterating <entityMap> ...
			if (entityMap[i].type === 'TOKEN') {
				Math.push(Object.values(entityMap)[i].data.content)
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

		const ranges = []

		inlineStyleRanges.forEach((item) => {
			ranges.push(item)
		})
		entityRanges.forEach((item) => {
			ranges.push(item)
		})

		ranges.sort((a, b) => a.offset - b.offset)

		/**
		 * ** text split algorithm **
		 * split with inlineStyledText offset and its length
		 */

		let position = 0
		let index = 0 // citations[Index]
		let { text } = blocks[k]
		const { type } = blocks[k]

		switch (type) {
		case 'unstyled':
			for (let i = 0; i < ranges.length; i += 1) {
				// 1. find the offset and length of styled text.
				const { offset, length, style } = ranges[i]
				// 2. slice and concat.
				const plaintext = text.slice(position, offset)
				let styledText = ''

				if (style === undefined) {
					// cite item
					styledText = citations[index]
					index += 1
				} else {
					// inline style
					styledText = `${texMap[style]}{${text.slice(offset, offset + length)}}`
				}
				const finalText = plaintext.concat(styledText)
				// 3. append to TeX.
				TeX += finalText
				position = offset + length
				if (i === ranges.length - 1) {
					TeX += text.slice(position)
				}
			}
			break
		case 'atomic':
			text = Math[count]
			TeX += text
			count += 1

			break
		default:
			TeX += `${texMap[type]}{${text}}`
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
