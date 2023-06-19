import styles from './Navbar.module.css';
export const Navbar = (props) => {
  return <div className={styles.navbar}>{props.children}</div>;
};
