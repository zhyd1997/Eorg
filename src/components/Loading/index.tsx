import React from 'react'
import { Spinner } from 'reactstrap'

type PropType = {
	isLoading: boolean,
}

const Loading: React.FC<PropType> = ({ isLoading }) => {
	if (isLoading) {
		return <Spinner className="spinner" type="grow" />
	}
	return null
}

export default Loading
