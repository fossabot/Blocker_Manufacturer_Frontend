// components/Navigation/Navigation.js
import styles from './Navigation.module.css';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>BLOCKER</h1>
      <div className={styles.links}>
        <NavLink to="/encryption-visualization" className={({isActive}) => isActive ? styles.active : ''}>
          Deploy 3D Animation
        </NavLink>

        <NavLink to="/monitoring" className={({isActive}) => isActive ? styles.active : ''}>
          Update Monitoring
        </NavLink>
        <a href="https://github.com/HSU-Blocker" target="_blank" rel="noopener noreferrer">
          About Us
        </a>
      </div>
    </nav>
  );
}

export default Navigation;