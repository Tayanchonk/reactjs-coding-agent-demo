import React from 'react'
import UserList from './UserList'

import { useLocation } from 'react-router-dom';

function User() {
    const location = useLocation();

    // console.log(location.pathname); // /setting/user-management
  return (
    <>   <UserList />
   {/* <CreateNewUser /> */}
   </>

  )
}

export default User