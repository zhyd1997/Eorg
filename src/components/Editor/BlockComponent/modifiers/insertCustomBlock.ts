import {
	AtomicBlockUtils,
	EditorState,
} from 'draft-js'

function insertCustomBlock(editorState: EditorState, type: string, data?: {}): EditorState {
	const contentState = editorState.getCurrentContent()
	const contentStateWithEntity = contentState.createEntity(
		type,
		'IMMUTABLE',
		data,
	)
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
	const newEditorState = EditorState.set(
		editorState,
		{ currentContent: contentStateWithEntity },
	)
	return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
}

export default insertCustomBlock
