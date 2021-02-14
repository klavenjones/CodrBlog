import PostFeed from '../components/PostFeed'
import Loader from '../components/Loader'
import { firestore, fromMillis, postToJSON } from '../lib/firebase'
import { useState } from 'react'
import Metatags from '../components/MetaTags'

// Max post to query per page
const LIMIT = 3

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { posts }, // will be passed to the page component as props
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]

    const cursor =
      typeof last.createdAt === 'number'
        ? fromMillis(last.createdAt)
        : last.createdAt

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT)

    const newPosts = (await query.get()).docs.map((doc) => doc.data())
    console.log(newPosts)
    setPosts(posts.concat(newPosts))
    setLoading(false)

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <main className='py-20 px-4 sm:px-10 grid grid-cols-1 gap-y-6 sm:gap-6'>
      <Metatags title='Codr Blog' />
      <div className='px-10 space-y-6'>
        <PostFeed posts={posts} />

        {!loading && !postsEnd && (
          <button
            className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:max-w-xs'
            onClick={getMorePosts}
          >
            Load more
          </button>
        )}
        <Loader show={loading} />
        <p>{postsEnd && 'You have reached the end!'}</p>
      </div>
    </main>
  )
}
