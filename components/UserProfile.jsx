import { FaUser } from 'react-icons/fa'

export default function UserProfile({ user }) {
  return (
    <>
      {/* This example requires Tailwind CSS v2.0+ */}
      <div className='lg:flex lg:items-center lg:justify-between'>
        <div className='flex-1 min-w-0 text-center'>
          <div className='my-10 flex justify-center'>
            <img
              className='h-40 w-40 rounded-full'
              src={user.photoURL || '/hacker.png'}
              alt="User Avatar"
            />
          </div>

          <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:text-6xl sm:truncate'>
            {user.displayName}
          </h2>
          <div className='mt-1 flex flex-col justify-center sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6'>
            <div className='flex items-center justify-center text-2xl text-gray-300'>
              {/* Heroicon name: solid/username */}
            @{user.username}
            </div>
           
          </div>
        </div>
      </div>
    </>
  )
}
