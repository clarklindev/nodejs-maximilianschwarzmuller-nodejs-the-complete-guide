import styles from './Navbar.module.css';
export const Navbar = (props) => {
  return (
    <header>
      <nav className={styles.navbar}>{props.children}</nav>
    </header>
  );
};
