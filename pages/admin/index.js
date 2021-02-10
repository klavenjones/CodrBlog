import AuthCheck from '../../components/AuthCheck'
import PostFeed from '../../components/PostFeed'
import { UserContext } from '../../lib/context'
import { firestore, auth, serverTimestamp } from '../../lib/firebase'

import { useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { useCollection } from 'react-firebase-hooks/firestore'
import kebabCase from 'lodash.kebabcase'
import toast from 'react-hot-toast'

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
          <PostList />
          <CreateNewPost />
        </div>
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map((doc) => doc.data())

  return (
    <div className='mt-8 space-y-4 sm:mx-auto sm:w-full sm:max-w-xl'>
      <h1 className='text-4xl'>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </div>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username, user } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(slug)

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      photoURL: user.photoURL,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }

    await ref.set(data)

    toast.success('Post created!')

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`)
  }

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-xl'>
      <div className='py-8 sm:rounded-lg'>
        <form onSubmit={createPost} className='space-y-6'>
          <label
            htmlFor='title'
            className='block text-2xl font-medium text-gray-700'
          >
            Add Post Title
          </label>
          <div>
            <input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='My Awesome Article!'
              className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
          <div>
            <p className='text-xl font-medium'>
              <span className='text-2xl font-medium'>Slug:</span> {slug}
            </p>
          </div>
          <div className='mt-10'>
            <button
              type='submit'
              disabled={!isValid}
              className='relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
