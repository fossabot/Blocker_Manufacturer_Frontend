import styles from './HeaderContent.module.css';

function HeaderContent({ title, onBackClick }) {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>{title}</h1>
             <button className={styles.backButton} onClick={onBackClick}>
                 {/* 화살표 모양 (여기서는 간단히 유니코드 화살표 문자를 사용하거나, CSS로 모양 만듦) */}
                 &#x2190; {/* 왼쪽 화살표 유니코드 문자 */}
                 {/* 또는 <span className={styles.arrowIcon}></span> 와 같이 CSS로 모양 만들 수도 있습니다. */}
             </button>
    </nav>
  );
}

export default HeaderContent;