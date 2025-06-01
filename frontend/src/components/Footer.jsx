import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.logo_main} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Doclino is a comprehensive clinic management system designed to streamline operations in healthcare facilities. Doclino has been the trusted choice for clinics since its inception, offering features like appointment scheduling, patient record management, billing, and prescription tracking. It simplifies daily tasks for doctors and staff, improving efficiency and patient care.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>79rip79@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025 @ Doclino.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
