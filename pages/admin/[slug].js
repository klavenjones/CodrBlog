import AuthCheck from '../../components/AuthCheck'
import { firestore, auth, serverTimestamp } from '../../lib/firebase'

import { useState } from 'react'
import { useRouter } from 'next/router'

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false)

  const router = useRouter()
  const { slug } = router.query

  const postRef = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
    .doc(slug)

  const [post] = useDocumentDataOnce(postRef)

  return (
    <main className='min-h-screen grid grid-cols-1 gap-y-10 sm:gap-6  py-12 px-4 sm:grid-cols-4 lg:pt-20 sm:px-6 lg:px-10'>
      {post && (
        <>
          <section className='col-span-3 space-y-14'>
            <div className='mb-5 border-gray-200'>
              <h3 className='text-6xl font-bold text-gray-900'>{post.title}</h3>
            </div>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside className='col-span-1 flex flex-col space-y-3  sticky w-full sm:max-w-xs'>
            <h3>Tools</h3>
            <button
              className='w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              onClick={() => setPreview(!preview)}
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                Live view
              </button>
            </Link>
            <button
              className='justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              onClick={() => setPreview(!preview)}
            >
              Delete
            </button>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues,
    mode: 'onChange',
  })

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    })

    reset({ content, published })

    toast.success('Post updated successfully!')
  }
  {
    console.log(watch('content'))
  }
  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className='card'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={`flex-col space-y-8 ${preview ? 'hidden' : 'flex'}`}>
        <textarea
          name='content'
          className='h-screen-60 shadow-sm w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-2xl border-gray-300 rounded-md'
          ref={register}
        ></textarea>

        <fieldset>
          <div className='flex items-start'>
            <div className='flex items-center h-5'>
              <input
                id='published'
                name='published'
                ref={register}
                type='checkbox'
                className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
              />
            </div>
            <div className='ml-3 text-sm'>
              <label htmlFor='published' className='font-medium text-gray-700'>
                Publish
              </label>
              <p className='text-gray-500'>
                Make your article available to the public.
              </p>
            </div>
          </div>
        </fieldset>

        <button
          type='submit'
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:max-w-xs'
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}
