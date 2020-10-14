import { ContentBlock, ContentState } from 'draft-js'

export default interface Block {
	block: ContentBlock,
	contentState: ContentState,
	blockProps: {
		onStartEdit?: any, // TODO what's immutable Map() type?
		onFinishTeXEdit?: any,
		onFinishTableEdit?: any,
		onRemove?: any,
	},
}
