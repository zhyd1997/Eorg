// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/draft-js` if it exists or ... Remove this comment to see the full error message
import { EditorState, Modifier, SelectionState } from 'draft-js'

function removeTeXBlock(editorState: any, blockKey: any) {
	const content = editorState.getCurrentContent()
	const block = content.getBlockForKey(blockKey)

	const targetRange = new SelectionState({
		anchorKey: blockKey,
		anchorOffset: 0,
		focusKey: blockKey,
		focusOffset: block.getLength(),
	})

	const withoutTeX = Modifier.removeRange(content, targetRange, 'backward')
	const resetBlock = Modifier.setBlockType(
		withoutTeX,
		withoutTeX.getSelectionAfter(),
		'unstyled',
	)

	const newState = EditorState.push(editorState, resetBlock, 'remove-range')
	return EditorState.forceSelection(newState, resetBlock.getSelectionAfter())
}

export default removeTeXBlock
