// components/Navigation/Navigation.js
import styles from './Navigation.module.css';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>BLOCKER</h1>
      <div className={styles.links}>
        <NavLink to="/" className={({isActive}) => isActive ? styles.active : ''}>
          Software Update
        </NavLink>
        <NavLink to="/update_file_management" className={({isActive}) => isActive ? styles.active : ''}>
          Update File Management
        </NavLink>
        <NavLink to="/update_monitoring" className={({isActive}) => isActive ? styles.active : ''}>
          Update Monitoring
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;