import Link from 'next/link'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from '../lib/context'

//Component Responsible for Redirecting
function Redirect({ to }) {
  const router = useRouter()
  useEffect(() => {
    router.push(to)
  }, [to])
  return null
}

function FallbackLink() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='flex flex-col'>
        <h1 className='text-xl mb-10'>
          You must be logged in to access this page
        </h1>
        <Link href='/dashboard'>
          <button className='btn btn-blue justify-center'>
            Please log in to continue
          </button>
        </Link>
      </div>
    </div>
  )
}

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext)
  
  return username
    ? props.children
    : props.fallback || <FallbackLink /> || <Redirect to='/dashboard' />
}

export { Redirect }
