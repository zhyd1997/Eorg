import React from 'react'
import RichTextEditor from './Editor'
import Header from './Header'

const Main = () => {
	const [login, setLogin] = React.useState(false)
	const [store, setStore] = React.useState({ token: '' })

	function storeCollector(): void {
		const localStore = JSON.parse(localStorage.getItem('login')!)

		if (localStore && localStore.login) {
			setLogin(true)
			setStore(localStore)
		} else {
			setLogin(false)
			setStore({ token: '' })
		}
	}

	React.useEffect(() => {
		storeCollector()
	}, [login])

	return (
		<div>
			<Header storeCollector={storeCollector} isLogIn={login} />
			<RichTextEditor login={login} store={store} />
		</div>
	)
}

export default Main
