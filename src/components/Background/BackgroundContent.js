import React from 'react';
import styles from './BackgroundContent.module.css';

function BackgroundContent({ children }) {
  return (
  <div className={styles.background}>
    {children}
  </div>
  );
}

export default BackgroundContent;