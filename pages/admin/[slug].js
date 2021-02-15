import AuthCheck, { Redirect } from '../../components/AuthCheck'
import ImageUploader from '../../components/ImageUploader'
import { firestore, serverTimestamp } from '../../lib/firebase'
import { UserContext } from '../../lib/context'
import { useState, useContext } from 'react'
import { useRouter } from 'next/router'

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminPostEdit(props) {
  const { user, username } = useContext(UserContext)
  return (
    <AuthCheck fallback={<Redirect to='/' />}>
      <PostManager user={user} />
    </AuthCheck>
  )
}

function PostManager({ user }) {
  const [preview, setPreview] = useState(false)

  const router = useRouter()
  const { slug } = router.query

  const postRef = firestore
    .collection('users')
    .doc(user.uid)
    .collection('posts')
    .doc(slug)

  const [post] = useDocumentDataOnce(postRef)

  return (
    <main className='min-h-screen grid grid-cols-1 gap-y-10 sm:gap-6  py-12 px-4 sm:grid-cols-4 lg:pt-20 sm:px-6 lg:px-10'>
      {post && (
        <>
          <section className='col-span-3 space-y-14'>
            <div className='mb-5 border-gray-200'>
              <h3 className='text-3xl sm:text-5xl font-bold text-gray-900'>
                {post.title}
              </h3>
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
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState, errors } = useForm({
    defaultValues,
    mode: 'onChange',
  })

  const { isValid, isDirty } = formState

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    })

    reset({ content, published })

    toast.success('Post updated successfully!')
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className='content-card'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={`flex-col space-y-8 ${preview ? 'hidden' : 'flex'}`}>
        <ImageUploader />
        <textarea
          name='content'
          className='h-screen-60 shadow-sm w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-xl border-gray-300 rounded-md'
          ref={register({
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
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
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}

function DeletePostButton({ postRef }) {
  const router = useRouter()

  const deletePost = async () => {
    const doIt = confirm('are you sure!')
    if (doIt) {
      await postRef.delete()
      router.push('/admin')
      toast('post annihilated ', { icon: '🗑️' })
    }
  }

  return (
    <button className='btn btn-red justify-center' onClick={deletePost}>
      Delete
    </button>
  )
}
