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

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext)
  return username
    ? props.children
    : props.fallback || (
          <Link href='/dashboard'>You must be signed in</Link>
        ) || <Redirect to='/dashboard' />
}
