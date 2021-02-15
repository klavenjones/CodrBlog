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

  // const createdAt =
  //   post.createdAt && post.createdAt.toDate()
  //     ? new Date(post.createdAt.seconds)
  //     : post.createdAt?.seconds

  // const createdAt =
  //   typeof post?.createdAt === 'number'
  //     ? new Date(post.createdAt)
  //     : post.createdAt
  //     ? post.createdAt?.seconds
  //     : new Date()

  const createdAt =
    typeof post?.createdAt === 'number'
      ? new Date(post.createdAt)
      : post?.createdAt !== null
      ? post.createdAt.toDate()
      : new Date()

  return (
    <>
      {/* This example requires Tailwind CSS v2.0+ */}
      <div className='relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col  hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'>
        <div className='flex flex-col space-y-5'>
          <div className='flex items-center space-x-2 -mb-6'>
            <img
              className='h-10 w-10 rounded-full'
              src={
                post.photoURL ||
                'https://www.pngitem.com/pimgs/m/421-4212617_person-placeholder-image-transparent-hd-png-download.png'
              }
              alt="User Avatar"
            />
            <div className='flex flex-col justify-between '>
              <h3 className='text-base -mb-4 font-medium'>{post.username}</h3>
              <p className='text-xs text-gray-400'>
                Published {createdAt && format(new Date(createdAt), 'MMM d')} (
                {createdAt &&
                  formatDistanceToNow(new Date(createdAt), 'MMM dd')}
                )
              </p>
            </div>
          </div>

          <div className='flex-1 space-y-3'>
            <Link href={`/${post.username}/${post.slug}`}>
              <h2 className='text-3xl font-bold cursor-pointer '>
                <a className='transition-all duration-100 text-black hover:text-indigo-600'>
                  {post.title}
                </a>
              </h2>
            </Link>
            <footer className='flex-col'>
              <div className='flex'>
                <span className='mr-4'>{wordCount} words.</span>
                <span>{minutesToRead} min read </span>
                <span className='ml-auto'>
                  💗 &nbsp; {post.heartCount || 0} Hearts
                </span>
              </div>
              <div>
                {admin && (
                  <>
                    <Link href={`/admin/${post.slug}`}>
                      <h3>
                        <button className='relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                          Edit
                        </button>
                      </h3>
                    </Link>
                    {post.published ? (
                      <p className='text-green-400 font-medium'>Live</p>
                    ) : (
                      <p className='text-red-400 font-medium'>Unpublished</p>
                    )}
                  </>
                )}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  )
}
