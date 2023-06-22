import styles from './Login.module.css';
import { NavLink, Form, useActionData, redirect } from 'react-router-dom';
export const Login = () => {
  return (
    <div className={styles.wrapper}>
      <Form className={styles['form']} action='/login' method='POST'>
        <div className={styles['form-control']}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' id='password' />
        </div>

        <div className={styles['form-buttons']}>
          <button type='submit'>Login</button>
          <div>
            Don't have an account? <NavLink to='/signup'>Sign up</NavLink>
          </div>
        </div>
      </Form>
    </div>
  );
};

export const loginAction = async ({ request }) => {
  const data = await request.formData();

  const submission = {
    email: data.get('email'),
    password: data.get('password'),
  };

  console.log('submission: ', submission);
  return redirect('/');
};
