import {
	AtomicBlockUtils,
	EditorState,
} from 'draft-js'

const examples = '\\sin{x^2} + \\cos{x^2} = 1'

function insertTeXBlock(editorState: EditorState): EditorState {
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
