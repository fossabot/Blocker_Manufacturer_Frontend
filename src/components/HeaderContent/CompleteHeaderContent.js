import styles from './HeaderContent.module.css';

function HeaderContent({ title, onBackClick }) {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>{title}</h1>
    </nav>
  );
}

export default HeaderContent;