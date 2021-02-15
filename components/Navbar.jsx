import React, { useState, useContext } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import { BiPencil } from 'react-icons/bi'
import { MdClose } from 'react-icons/md'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../lib/firebase'
import { UserContext } from '../lib/context'

function LoggedIn({ username, user }) {
  const [showPopup, setPopup] = useState(false)
  const router = useRouter()
  return (
    <>
      <div className='flex items-center'>
        <div className='flex-shrink-0'>
          <Link href='/admin'>
            <button type='button' className='btn btn-blue'>
              {/* Heroicon name: solid/plus */}

              <BiPencil className='-ml-1 mr-2 h-5 w-5' />
              <span>Write Post</span>
            </button>
          </Link>
        </div>
        <div className='hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center'>
          {/* Profile dropdown */}
          <div className='ml-3 relative'>
            <div>
              <button
                onClick={() => setPopup(!showPopup)}
                className='bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                id='user-menu'
                aria-haspopup='true'
              >
                <span className='sr-only'>Open user menu</span>
                <img
                  className='h-8 w-8 rounded-full'
                  src={
                    user?.photoURL ||
                    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3AProfile_avatar_placeholder_large.png&psig=AOvVaw0i-Fw-RSoRjKSkgMT6X4AD&ust=1612978742869000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOi8kpqs3e4CFQAAAAAdAAAAABAI'
                  }
                  alt="Blog Logo"
                />
              </button>
            </div>

            <div
              className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 ${
                showPopup
                  ? 'transition ease-out duration-200 transform opacity-100 scale-100'
                  : 'transition ease-in duration-75 transform opacity-0 scale-95'
              }`}
              role='menu'
              aria-orientation='vertical'
              aria-labelledby='user-menu'
            >
              <Link href={`/dashboard`}>
                <a
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                  role='menuitem'
                >
                  Dashboard
                </a>
              </Link>
              <Link href={`/${username}`}>
                <a
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                  role='menuitem'
                >
                  Your Profile
                </a>
              </Link>
              <button
                onClick={() => {
                  auth.signOut()
                  router.push('/dashboard')
                }}
                className='block text-left w-full px-4 py-2 text-gray-700 hover:bg-gray-100'
                role='menuitem'
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
function LoggedOut() {
  const [showPopup, setPopup] = useState(false)
  return (
    <>
      <div className='flex items-center'>
        <div className='flex-shrink-0'>
          <Link href='/dashboard'>
            <button type='button' className='btn btn-blue'>
              {/* Heroicon name: solid/plus */}

              <span>Log In</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default function Navbar() {
  const [showPopup, setPopup] = useState(false)
  const [showMenu, setMenu] = useState(false)
  const { user, username } = useContext(UserContext)

  return (
    <>
      {/* This example requires Tailwind CSS v2.0+ */}
      <nav className='bg-white shadow-md w-full fixed top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-20'>
            <div className='flex'>
              {/* Only show whenuser is signed in */}
              {username && (
                <div className='-ml-2 mr-2 flex items-center md:hidden'>
                  <button
                    onClick={() => setMenu(!showMenu)}
                    className='inline-flex items-center justify-center p-2 rounded-md text-gray-700  hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
                    aria-expanded='false'
                  >
                    <span className='sr-only'>Open main menu</span>
                    <AiOutlineMenu
                      className={`block h-6 w-6 stroke-1 ${
                        showMenu ? 'hidden' : 'block'
                      }`}
                    />
                    <MdClose
                      className={`block h-6 w-6 stroke-1 ${
                        showMenu ? 'block' : 'hidden'
                      }`}
                    />
                  </button>
                </div>
              )}
              <div className='flex-shrink-0 flex items-center'>
                <Link href='/'>
                  <h1 className='p-2 text-2xl text-white bg-black hover:bg-gray-800 font-medium rounded uppercase cursor-pointer'>
                    Codr
                  </h1>
                </Link>
              </div>
            </div>
            {username ? (
              <LoggedIn username={username} user={user} />
            ) : (
              <LoggedOut />
            )}
          </div>
        </div>
        {username && (
          <div className={`md:hidden ${showMenu ? 'block' : 'hidden'}`}>
            <div className='pt-4 pb-3 border-t border-gray-200'>
              <div className='flex items-center px-4 sm:px-6'>
                <div className='flex-shrink-0'>
                  <img
                    className='h-10 w-10 rounded-full'
                    src={
                      user?.photoURL ||
                      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3AProfile_avatar_placeholder_large.png&psig=AOvVaw0i-Fw-RSoRjKSkgMT6X4AD&ust=1612978742869000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOi8kpqs3e4CFQAAAAAdAAAAABAI'
                    }
                    alt="User Avatar"
                  />
                </div>
                <div className='ml-3'>
                  <div className='text-base font-medium text-gray-800'>
                    {user?.displayName}
                  </div>
                  <div className='text-sm font-medium text-gray-500'>
                    @{username}
                  </div>
                </div>
              </div>
              <div className='mt-3 space-y-1'>
                <Link href={`/${username}`}>
                  <a className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 sm:px-6'>
                    Your Profile
                  </a>
                </Link>
                <a
                  href='#'
                  className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 sm:px-6'
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
