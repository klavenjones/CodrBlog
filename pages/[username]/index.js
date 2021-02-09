import { getUserWithUsername, postToJSON } from '../../lib/firebase'
import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/PostFeed'

export async function getServerSideProps({ query }) {
  const { username } = query

  const userDoc = await getUserWithUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  // JSON serializable data
  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)
    posts = (await postsQuery.get()).docs.map(postToJSON)
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  }
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main className='min-h-screen py-12 px-4 sm:px-6 lg:px-10'>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}
