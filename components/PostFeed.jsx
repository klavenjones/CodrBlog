import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null
}

function PostItem({ post, admin = false }) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  const createdAt =
    post.createdAt && post?.createdAt?.toDate()
      ? new Date(post.createdAt.toDate())
      : post.createdAt?.seconds

  console.log(post?.createdAt)

  return (
    <>
      {/* This example requires Tailwind CSS v2.0+ */}
      <div className='relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col  hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'>
        <div className='flex space-x-3'>
          <img
            className='h-10 w-10 rounded-full'
            src={
              post.photoURL ||
              'https://www.pngitem.com/pimgs/m/421-4212617_person-placeholder-image-transparent-hd-png-download.png'
            }
            alt
          />

          <div className='flex-1 space-y-3'>
            <div className='flex flex-col justify-between'>
              <h3 className='text-sm font-medium'>{post.username}</h3>
              <p className='text-xs text-gray-400'>
                Published {createdAt && format(new Date(createdAt), 'MMM d')} (
                {createdAt &&
                  formatDistanceToNow(new Date(createdAt), 'MMM dd')}
                )
              </p>
            </div>
            <Link href={`/${post.username}/${post.slug}`}>
              <h2 className='text-3xl font-bold cursor-pointer transition-all duration-100 hover:text-indigo-600'>
                <a>{post.title}</a>
              </h2>
            </Link>
            <footer className='flex space-x-6'>
              <span>{wordCount} words.</span>
              <span>{minutesToRead} min read </span>

              <span className='push-left'>
                💗 {post.heartCount || 0} Hearts
              </span>
              {admin && (
                <>
                  <Link href={`/admin/${post.slug}`}>
                    <h3>
                      <button className='btn-blue'>Edit</button>
                    </h3>
                  </Link>
                  {post.published ? (
                    <p className='text-success'>Live</p>
                  ) : (
                    <p className='text-danger'>Unpublished</p>
                  )}
                </>
              )}
            </footer>
          </div>
        </div>

        {/* <div className='px-4 py-5 sm:p-6'> */}
        {/* Content goes here */}
        {/* <Link href={`/${post.username}`}>
            <a>
              <strong>By @{post.username}</strong>
            </a>
          </Link>
          <Link href={`/${post.username}/${post.slug}`}>
            <h2>
              <a>{post.title}</a>
            </h2>
          </Link>
          <footer>
            <span>
              {wordCount} words. {minutesToRead} min read //{' '}
            </span>

            <span className='push-left'>💗 {post.heartCount || 0} Hearts</span>
            {admin && (
              <>
                <Link href={`/admin/${post.slug}`}>
                  <h3>
                    <button className='btn-blue'>Edit</button>
                  </h3>
                </Link>
                {post.published ? (
                  <p className='text-success'>Live</p>
                ) : (
                  <p className='text-danger'>Unpublished</p>
                )}
              </>
            )}
          </footer> */}
      </div>
    </>
  )
}
