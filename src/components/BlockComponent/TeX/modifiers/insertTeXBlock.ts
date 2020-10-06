import {
	AtomicBlockUtils,
	EditorState,
} from 'draft-js'

const examples = '\\sin{x^2} + \\cos{x^2} = 1'

// @ts-expect-error ts-migrate(7006)
// FIXME: Parameter 'editorState' implicitly has an 'any' ty...
//  Remove this comment to see the full error message
function insertTeXBlock(editorState) {
	const contentState = editorState.getCurrentContent()
	const contentStateWithEntity = contentState.createEntity(
		'TOKEN',
		'IMMUTABLE',
		{ content: examples },
	)
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
	const newEditorState = EditorState.set(
		editorState,
		{ currentContent: contentStateWithEntity },
	)
	return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
}

export default insertTeXBlock
