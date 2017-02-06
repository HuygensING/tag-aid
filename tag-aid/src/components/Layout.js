import React from 'react'
import MainNav from './MainNav'

export default ({ children }) => (
  <div>
    <MainNav />
    <div>{children}</div>
  </div>
)
