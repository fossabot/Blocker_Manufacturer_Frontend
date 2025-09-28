// components/Navigation/Navigation.js
import styles from './Navigation.module.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path, { state: { from: location } });
  };

  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>BLOCKER</h1>
      <div className={styles.links}>
        <button onClick={() => handleNavigate('/encryption-visualization')} className={`${styles.navLinkButton} ${location.pathname === '/encryption-visualization' ? styles.active : ''}`}>
          Deploy 3D Animation
        </button>

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