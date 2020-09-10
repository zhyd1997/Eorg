import React from 'react'
import RichTextEditor from './RichTextEditor'
import Header from './Header'

const Main = () => {
	const [login, setLogin] = React.useState(false)
	const [store, setStore] = React.useState(null)

	React.useEffect(() => {
		storeCollector()
		console.log('login', login)
	}, [login])

	function storeCollector() {
		const localStore = JSON.parse(localStorage.getItem('login'))

		if (localStore && localStore.login) {
			setLogin(true)
			setStore(localStore)
		} else {
			setLogin(false)
			setStore(null)
		}
	}

	return (
		<>
			<Header storeCollector={storeCollector} isLogIn={login} />
			<RichTextEditor login={login} store={store} />
		</>
	)
}

export default Main
