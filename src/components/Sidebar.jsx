import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ user, navItems, onLogout, brandName, brandSub }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const initial = user?.name?.[0]?.toUpperCase() || 'U';
  const apiBase = 'http://localhost:5173/api';

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(true)} aria-label="Open menu">
        &#9776;
      </button>

      <div className={'sidebar-overlay ' + (open ? 'open' : '')} onClick={() => setOpen(false)} />

      <aside className={'sidebar ' + (open ? 'open' : '')}>
        <div className="sidebar-brand">
          {brandName}
          {brandSub && <span>{brandSub}</span>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            {user?.photo ? (
              <img src={apiBase + user.photo} alt="foto" className="avatar avatar-sm sidebar-avatar" />
            ) : (
              <div className="avatar avatar-sm sidebar-avatar">{initial}</div>
            )}
            <div>
              <div className="sidebar-username">{user?.name}</div>
              <div className="sidebar-role">{user?.position}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-block" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
