import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

export default function Home() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div>
        <button onClick={() => toast.error('hello toast!')}>Toast Me</button>
      </div>
    </div>
  )
}
