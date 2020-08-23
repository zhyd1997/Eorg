import {
	AtomicBlockUtils,
	EditorState,
} from 'draft-js'

import { tableShape } from '../ModalTable'

function createTable(editorState) {
	const contentState = editorState.getCurrentContent()
	const { row, column, caption } = tableShape[tableShape.length - 1]
	const contentStateWithEntity = contentState.createEntity(
		'TABLE',
		'IMMUTABLE',
		{ row, column, caption },
	)
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
	const newEditorState = EditorState.set(
		editorState,
		{ currentContent: contentStateWithEntity },
	)
	return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
}

export default createTable
