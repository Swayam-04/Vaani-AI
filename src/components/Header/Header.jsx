import React from 'react';
import { Button, Tooltip } from 'antd';
import { FiSettings, FiShield, FiMenu, FiLogOut } from 'react-icons/fi';
import styles from './Header.module.css';

export default function Header({ onOpenSettings, collapsed, onToggleSidebar, backendOnline, onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Button 
          type="text" 
          icon={<FiMenu className={styles.menuIcon} />} 
          onClick={onToggleSidebar}
          className={styles.toggleBtn}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        />
        <div className={styles.iconContainer}>
          <FiShield className={styles.shieldIcon} />
        </div>
        <div>
          <h1 className={styles.title}>VAANI AI</h1>
          <p className={styles.subtitle}>Offline Secure Speech Intelligence Platform</p>
        </div>
      </div>
      
      <div className={styles.right}>
        <Tooltip 
          title={backendOnline ? "Flask integration server is online on http://127.0.0.1:5000. System operating securely offline." : "Cannot connect to Flask backend. Please start the backend service."} 
          placement="bottomLeft"
        >
          <div className={styles.statusPill}>
            <span 
              className="status-dot" 
              style={{ 
                backgroundColor: backendOnline ? 'var(--color-status-green)' : '#f5222d',
                boxShadow: backendOnline ? undefined : 'none',
                animation: backendOnline ? undefined : 'none'
              }} 
            />
            <span className={styles.statusText}>{backendOnline ? "Backend Online" : "Backend Offline"}</span>
          </div>
        </Tooltip>
        
        <Button 
          type="text" 
          icon={<FiSettings className={styles.settingsIcon} />} 
          onClick={onOpenSettings}
          className={styles.settingsBtn}
          title="Open Settings"
        />

        <Button 
          type="text" 
          icon={<FiLogOut className={styles.logoutIcon} />} 
          onClick={onLogout}
          className={styles.logoutBtn}
          title="Logout"
        />
      </div>
    </header>
  );
}
