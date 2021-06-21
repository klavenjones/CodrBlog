import { useEffect, useState, useCallback, useContext } from 'react'
import {
  auth,
  firestore,
  githubProvider,
  googleProvider
} from '../lib/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import toast from 'react-hot-toast'
import debounce from 'lodash.debounce'
import { UserContext } from '../lib/context'
import { FaGoogle, FaGithub, FaUser} from 'react-icons/fa'
import Metatags from '../components/Metatags'
import AuthCheck from '../components/AuthCheck'

export default function SignUp() {
  const { user, username } = useContext(UserContext)

  return (
    <main className='min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <Metatags title='dashboard' />
      {user ? (
        !username ? (
          <UserNameForm />
        ) : (
          <AuthCheck>
            <LoggedInPage user={user} />
          </AuthCheck>
        )
      ) : (
        <SignInForm />
      )}
    </main>
  )
}

function LoggedInPage({ user }) {
  const ref = firestore.collection('users').doc(user.uid).collection('posts')

  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map((doc) => doc.data())
  const [totalPost, setPosts] = useState(0)
  const [totalHearts, setHearts] = useState(0)

  useEffect(() => {
    let total = posts && posts.length
    let amount =
      posts &&
      posts.reduce((a, i) => {
        return a + i.heartCount
      }, 0)

    setPosts(total)
    setHearts(amount)
  })

  return (
    <div className='h-full flex-1'>
      <>
        <header>
          <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-2xl leading-6 font-semibold text-gray-900 sm:text-3xl md:text-4xl'>
              Dashboard
            </h1>
          </div>
        </header>
        <div>
          <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
            <div className='px-4 py-4 sm:px-0 grid grid-cols-1 gap-3 sm:grid-cols-3'>
              <div className='rounded-lg col-span-1 mb-10 content-card'>
                <h3 className='text-2xl font-medium mb-4'>Total Hearts</h3>
                <h2 className='text-4xl sm:text-6xl font-medium'>
                  {totalHearts}
                </h2>
              </div>
              <div className=' rounded-lg col-span-1 mb-10 content-card'>
                <h3 className='text-2xl font-medium mb-4'>Total Posts</h3>
                <h2 className='text-4xl sm:text-6xl font-medium'>
                  {totalPost}
                </h2>
              </div>
            </div>

            {/* /End replace */}
          </div>
        </div>
      </>
    </div>
  )
}

function SignInForm() {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleProvider)
    } catch (error) {
      toast.error(error.message)
    }
  }
  const signInWithGithub = async () => {
    try {
      await auth.signInWithPopup(githubProvider)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-2xl font-medium text-gray-900'>
          Welcome to the CODR community
        </h2>
      </div>
      <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <div className='mt-6'>
            <div className='mt-6 grid grid-cols-1 gap-3'>
              <div>
                <button
                  onClick={() => auth.signInAnonymously()}
                  className='w-full inline-flex justify-center items-center py-2 px-4 border rounded-md shadow-sm bg-gray-400 text-sm font-medium text-white hover:opacity-90'
                >
                  <span className='sr-only'>Sign in with Google</span>
                  <FaUser className='w-6 h-6 mr-3' />
                  <span className='text-white text-lg'>
                    Sign in Anonymously
                  </span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => signInWithGoogle()}
                  className='w-full inline-flex justify-center items-center py-2 px-4 border rounded-md shadow-sm bg-red-500 text-sm font-medium text-white hover:opacity-90'
                >
                  <span className='sr-only'>Sign in with Google</span>
                  <FaGoogle className='w-6 h-6 mr-3' />
                  <span className='text-white text-lg'>
                    Sign in with Google
                  </span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => signInWithGithub()}
                  className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-black text-sm font-medium text-white hover:opacity-80'
                >
                  <span className='sr-only'>Sign in with GitHub</span>
                  <FaGithub className='h-6 w-6 mr-3' />
                  <span className='text-white text-lg'>
                    Sign in with Github
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function SignUpForm() {
  return (
    <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
        <div className='mt-6'>
          <div className='mt-6 grid grid-cols-1 gap-3'>
            <div>
              <a
                href='#'
                className='w-full inline-flex justify-center items-center py-2 px-4 border rounded-md shadow-sm bg-red-500 text-sm font-medium text-white hover:opacity-90'
              >
                <span className='sr-only'>Sign in with Google</span>
                <FaGoogle className='w-6 h-6 mr-3' />
                <span className='text-white text-lg'>Sign up with Google</span>
              </a>
            </div>
            <div>
              <a
                href='#'
                className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-black text-sm font-medium text-white hover:opacity-80'
              >
                <span className='sr-only'>Sign in with GitHub</span>
                <FaGithub className='h-6 w-6 mr-3' />
                <span className='text-white text-lg'>Sign up with Github</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserNameForm() {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      // Create refs for both documents
      const userDoc = firestore.doc(`users/${user.uid}`)
      const usernameDoc = firestore.doc(`usernames/${formValue}`)

      // Commit both docs together as a batch write.
      const batch = firestore.batch()
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName
      })
      batch.set(usernameDoc, { uid: user.uid })

      await batch.commit()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  //

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get()

        setIsValid(!exists)
        setLoading(false)
      }
    }, 500),
    []
  )

  return (
    !username && (
      <>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-2xl font-medium text-gray-900'>
            Choose a username
          </h2>
        </div>
        <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-4 px-4 shadow sm:rounded-lg sm:px-10'>
            <div className='mt-6'>
              <div className='mt-6 grid grid-cols-1 gap-3'>
                <form onSubmit={onSubmit}>
                  <div className='relative rounded-md shadow-sm'>
                    <input
                      type='text'
                      name='text'
                      id='text'
                      className={`block w-full pr-10 text-gray-800 border-gray-400 focus:outline-none sm:text-sm rounded-md ${
                        isValid
                          ? 'focus:ring-green-500 focus:border-green-500'
                          : username && isValid
                          ? 'focus:ring-red-500 focus:border-red-500'
                          : 'focus:outline-none'
                      }`}
                      placeholder='Create a username'
                      value={formValue}
                      onChange={onChange}
                      aria-invalid='true'
                      aria-describedby='email-error'
                    />
                  </div>
                  <div className='mt-3'>
                    <UsernameMessage
                      username={formValue}
                      isValid={isValid}
                      loading={loading}
                    />
                  </div>
                  <div className='mt-6'>
                    <button
                      type='submit'
                      className='inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    >
                      Choose Username
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isValid) {
    return (
      <p className='mt-2 text-lg text-green-600'>{username} is available!</p>
    )
  } else if (username && !isValid) {
    return <p className='mt-2 text-lg text-red-600'>This username is taken!</p>
  } else {
    return <p></p>
  }
}
