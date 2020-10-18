import { AtomicBlockUtils, EditorState } from 'draft-js'

function insertImageBlock(editorState: EditorState): EditorState {
	const contentState = editorState.getCurrentContent()
	const contentStateWithEntity = contentState.createEntity(
		'IMAGE',
		'IMMUTABLE',
		{ path: 'logo192.png', caption: 'This is a caption' },
	)
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
	const newEditorState = EditorState.set(
		editorState,
		{ currentContent: contentStateWithEntity },
	)
	return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
}

export default insertImageBlock
