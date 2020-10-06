import React from 'react'
import { Spinner } from 'reactstrap'

const Loading = ({
	isLoading,
}: any) => {
	if (isLoading) {
		return <Spinner className="spinner" type="grow" />
	}
	return null
}

export default Loading
