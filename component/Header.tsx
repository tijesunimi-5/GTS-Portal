'use client'
import React from 'react'
import Alert from './Alert'

const Header = () => {
  return (
    <>
      <header className='fixed top-0 left-0 w-full bg-[#1565C0] text-white text-center py-2 shadow-md z-50'>
        <div className="logo">
          <h1 className='font-bold text-2xl tracking-wide'>Genius Squads Tutorial</h1>
        </div>
      </header>
      <Alert />
    </>
  )
}

export default Header
