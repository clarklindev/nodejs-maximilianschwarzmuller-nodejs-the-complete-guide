import styles from './SignUp.module.css';
import { NavLink } from 'react-router-dom';

export const SignUp = () => {
  return (
    <div className={styles.wrapper}>
      <form className={styles['form']} action='' method='POST'>
        <div className={styles['form-control']}>
          <label for='email'>Email</label>
          <input type='email' name='email' id='email' />
        </div>
        <div className={styles['form-control']}>
          <label for='password'>Password</label>
          <input type='password' name='password' id='password' />
        </div>
        <div className={styles['form-control']}>
          <label for='confirmPassword'>Confirm password</label>
          <input type='password' name='confirmPassword' id='confirmPassword' />
        </div>
        <div className={styles['form-buttons']}>
          <button type='submit'>Sign up</button>
          <div>
            account already exists? <NavLink to='/login'>Login</NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};
