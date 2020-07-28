import {
	AtomicBlockUtils,
	EditorState,
} from 'draft-js'

function createTable(editorState) {
	const contentState = editorState.getCurrentContent()
	const contentStateWithEntity = contentState.createEntity(
		'table',
		'IMMUTABLE',
		{ content: '' },
	)
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
	const newEditorState = EditorState.set(
		editorState,
		{ currentContent: contentStateWithEntity },
	)
	return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
}

export default createTable
