import React from 'react'
import { Bell, User, HomeIcon, CameraIcon } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const tabs = [
    { path: '/dashboard', label: 'Home', icon: HomeIcon},
    { path: '/', label: 'Scan QR', icon: CameraIcon },
    { path: '/', label: 'Profile', icon: User },
  ]

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault()
    // Handle navigation if needed
  }

  return (
    <header className="topbar">
      <div className="topbar-content">
        {/* Center - Navigation */}
        <nav className="topbar-center">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <a
                key={tab.path}
                href="#"
                onClick={(e) => handleNavClick(tab.path, e)}
                className="nav-tab"
                title={tab.label}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{tab.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Right - Actions */}
        <div className="topbar-right">
          <button className="action-btn" aria-label="Notifications">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>

          <a href="#profile" className="user-profile">
            <div className="avatar">JD</div>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar