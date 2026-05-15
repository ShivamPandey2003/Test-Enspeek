import React from 'react'
import UserCard, { type UserProps } from './UserCard'

interface UserDisplayProps {
    userData: UserProps[]
}

const UserDisplay:React.FC<UserDisplayProps> = ({userData}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {
            userData.map((user, index)=>(
                <UserCard key={index} {...user}/>
            ))
        }
    </div>
  )
}

export default UserDisplay