import React from 'react'
import { Spinner } from 'reactstrap'

type PropTypes = {
	isLoading: boolean,
}

const Loading = ({ isLoading }: PropTypes) => {
	if (isLoading) {
		return <Spinner className="spinner" type="grow" />
	}
	return null
}

export default Loading
