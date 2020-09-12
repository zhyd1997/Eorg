import React from 'react'
import Download from '../DownloadFile/Download'
import LoadingSpinner from '../Loading'

const Loading = ({ isLoading }) => {
	if (isLoading) {
		return <LoadingSpinner />
	}
	return ''
}

const Preview = (props) => {
	const {
		login,
		store,
		previewStyle,
		isLoading,
	} = props

	return (
		<div className={previewStyle}>
			{
				login ? <Download store={store} /> : ''
			}
			<iframe
				id="pdf"
				title="hello"
			/>
			<Loading isLoading={isLoading} />
		</div>
	)
}

export default Preview
