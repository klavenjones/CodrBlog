import PostContent from '../../components/PostContent'
import AuthCheck from '../../components/AuthCheck'
import HeartButton from '../../components/HeartButton'
import { useContext } from 'react'
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase'
import { UserContext } from '../../lib/context'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Link from 'next/link'

export async function getStaticProps({ params }) {
  const { username, slug } = params
  const userDoc = await getUserWithUsername(username)

  let post
  let path

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug)
    post = postToJSON(await postRef.get())

    path = postRef.path
  }

  return {
    props: { post, path },
    revalidate: 5000,
  }
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get()

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data()
    return {
      params: { username, slug },
    }
  })

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  }
}

export default function Post(props) {
  const postRef = firestore.doc(props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post
  const { user: currentUser } = useContext(UserContext)

  return (
    <main className='py-20 px-4 sm:px-10 grid grid-cols-1 gap-y-6 sm:gap-6 sm:grid-cols-4'>
      <section className='col-span-3 content-card'>
        <PostContent post={post} />
      </section>

      <aside className='col-span-1 content-card h-full max-h-60 flex flex-col space-y-5 '>
        <p className='text-center'>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href='/enter'>
              <button className='btn btn-blue justify-center w-36'>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className='btn btn-blue justify-center mx-auto w-36'>Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  )
}
