import { Outlet } from 'react-router'

const Auth_layout = () => {
  return (
    <div className='min-h-dvh w-full overflow-y-auto bg-gradient-to-br from-login-bg-start to-login-bg-end px-4 py-4 sm:px-6 sm:py-6'>
      <div className='mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl items-center justify-center sm:min-h-[calc(100dvh-3rem)]'>
        <Outlet />
      </div>
    </div>
  )
}

export default Auth_layout