import React from 'react'
import NavbarSidebar from './Navbar'
import DashboardContent from './Dashboard'

const AdminDashboard = () => {
  return (
     <>
      <NavbarSidebar />
      <div className="pt-[56px] md:pl-64">
        <DashboardContent />
      </div>
    </>
  )
}

export default AdminDashboard

