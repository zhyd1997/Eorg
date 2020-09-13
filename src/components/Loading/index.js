import React from 'react'
import { Spinner } from 'reactstrap'

const Loading = ({ isLoading }) => {
	if (isLoading) {
		return <Spinner className="spinner" type="grow" />
	}
	return ''
}

export default Loading
