import React, { FC } from 'react'

type RegisterType = {

}

const Register: FC<RegisterType> = () => {
  return (
    <div>
      <form>
        <input type="text" name='firstname' placeholder='firstname' className='w-full block p-2 bg-gray-100 mx-3 my-2' />
        <input type="text" name='lastname' placeholder='lastname' className='w-full block p-2 bg-gray-100 mx-3 my-2' />
        <input type="email" name='email' placeholder='email'  className='w-full block p-2 bg-gray-100 mx-3 my-2' />
        <input type="password" placeholder='password' name='password_cormfirmation' className='w-full block p-2 bg-gray-100 mx-3 my-2' />
        <input type="password" placeholder='password confirmation' className='w-full block p-2 bg-gray-100 mx-3 my-2 mx-3 my-2' />
        <input type="button" className='w-full block p-2 bg-blue-400 text-white' />
      </form>
    </div>
  )
}

export default Register