import React, { useEffect, useState } from 'react';
import { Home, ClipboardList, Calendar, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MenuSideBar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname || '/dashboard');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/attendance', label: 'Attendance', icon: ClipboardList },
    { path: '/appointment', label: 'Appointment', icon: Calendar },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img
              src="/images/CareLink-Logo.png"
              alt="CareLink Logo"
              className="object-contain"
              style={{ width: "98px", height: "98px" }}
            />
          </div>
          {isExpanded && <span className="logo-text">CareLink</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <IconComponent className="sidebar-icon" size={22} />
              {isExpanded && <span className="sidebar-label">{item.label}</span>}
              {isActive && <div className="active-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item logout" title="Logout">
          <LogOut className="sidebar-icon" size={22} />
          {isExpanded && <span className="sidebar-label">Logout</span>}
        </button>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 80px;
          height: 100vh;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          z-index: 100;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(148, 163, 184, 0.1);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .sidebar.expanded {
          width: 240px;
        }

        .sidebar-header {
          padding: 0 16px 24px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          margin-bottom: 24px;
        }

        .logo-text {
          color: white;
          font-weight: 600;
          font-size: 20px;
          white-space: nowrap;
          opacity: 0;
          animation: fadeIn 0.3s ease-in-out forwards;
          animation-delay: 0.1s;
        }



        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          padding: 0 12px;
        }

        .sidebar-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 16px;
          border-radius: 12px;
          color: rgba(226, 232, 240, 0.7);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          width: 100%;
          text-align: left;
        }

        .sidebar-item:hover {
          background: rgba(148, 163, 184, 0.1);
          color: white;
          transform: translateX(2px);
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
          color: white;
        }

        .sidebar-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 32px;
          background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
        }

        .sidebar-icon {
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .sidebar-item:hover .sidebar-icon {
          transform: scale(1.1);
        }

        .sidebar-label {
          white-space: nowrap;
          opacity: 0;
          animation: fadeIn 0.3s ease-in-out forwards;
          animation-delay: 0.05s;
        }

        .active-indicator {
          position: absolute;
          right: 12px;
          width: 6px;
          height: 6px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        .sidebar-footer {
          padding: 24px 12px 0;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
          margin-top: auto;
        }

        .sidebar-item.logout {
          color: rgba(239, 68, 68, 0.8);
        }

        .sidebar-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 70px;
          }

          .sidebar.expanded {
            width: 200px;
          }

          .logo-icon {
            width: 42px;
            height: 42px;
            font-size: 28px;
          }

          .sidebar-item {
            padding: 12px 14px;
          }
        }
      `}</style>
    </aside>
  );
};

export default MenuSideBar;