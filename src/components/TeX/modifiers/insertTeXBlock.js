import {
	AtomicBlockUtils,
	EditorState,
} from 'draft-js'

const examples = '\\KaTeX'

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
