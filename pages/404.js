import Link from 'next/link'

export default function Custom404() {
  return (
    <main className='flex flex-col items-center justify-center h-screen'>
      <h1 className='my-20 text-3xl'>
        <span className='text-8xl text-red-400'>404</span> - That page does not
        seem to exist...
      </h1>
      <iframe
        src='https://giphy.com/embed/l2JehQ2GitHGdVG9y'
        width='480'
        height='362'
        frameBorder='0'
        allowFullScreen
      ></iframe>
      <Link href='/'>
        <button className='relative inline-flex items-center px-4 py-2 mt-10 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
          Go home
        </button>
      </Link>
    </main>
  )
}
