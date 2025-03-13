// components/Navigation/Navigation.js
import styles from './Navigation.module.css';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>BLOCKER</h1>
      <div className={styles.links}>
        <NavLink to="/" className={({isActive}) => isActive ? styles.active : ''}>
          Home
        </NavLink>
        <NavLink to="/about" className={({isActive}) => isActive ? styles.active : ''}>
          About
        </NavLink>
        <NavLink to="/contact" className={({isActive}) => isActive ? styles.active : ''}>
          Contact
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;