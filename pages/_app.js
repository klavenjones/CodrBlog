import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'

function MyApp({ Component, pageProps }) {
  const userData = useUserData()

  return (
    <>
      <UserContext.Provider value={userData}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: 'rgba(209, 250, 229, 1)',
                padding: '1rem',
                color: 'rgba(4, 120, 87, 1)',
              },
            },
            error: {
              style: {
                background: 'rgba(254, 226, 226, 1)',
                padding: '1rem',
                color: 'rgba(185, 28, 28, 1)',
              },
            },
          }}
        />
      </UserContext.Provider>
    </>
  )
}

export default MyApp
