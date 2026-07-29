import { Outlet } from 'react-router'
import { Suspense } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const Auth_layout = () => {
  return (
    <div className='min-h-dvh w-full overflow-y-auto bg-white px-4 py-4 sm:px-6 sm:py-6'>
      <div className='mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl items-center justify-center sm:min-h-[calc(100dvh-3rem)]'>
        <Suspense
          fallback={
            <AiOutlineLoading3Quarters size={34} className='animate-spin text-action' />
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default Auth_layout
