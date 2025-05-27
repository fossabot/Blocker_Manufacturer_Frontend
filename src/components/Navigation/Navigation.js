// components/Navigation/Navigation.js
import styles from './Navigation.module.css';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>BLOCKER</h1>
      <div className={styles.links}>
        {/* <NavLink to="/" className={({isActive}) => isActive ? styles.active : ''}>
          Software Update
        </NavLink> */}

        <NavLink to="/monitoring" className={({isActive}) => isActive ? styles.active : ''}>
          Update Monitoring
        </NavLink>
        <NavLink to="/encryption-visualization" className={({isActive}) => isActive ? styles.active : ''}>
        {/* /about */}
          About Us
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;