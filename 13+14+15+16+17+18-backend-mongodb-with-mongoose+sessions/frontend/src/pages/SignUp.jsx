import styles from './SignUp.module.css';
import { NavLink, Form, useActionData, redirect } from 'react-router-dom';

export const SignUp = () => {
  const data = useActionData();
  return (
    <div className={styles.wrapper}>
      <Form className={styles['form']} action='/signup' method='POST'>
        <div className={styles['form-control']}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' id='password' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='confirmPassword'>Confirm password</label>
          <input type='password' name='confirmPassword' id='confirmPassword' />
        </div>
        <div className={styles['form-buttons']}>
          <button type='submit'>Sign up</button>
          <div>
            account already exists? <NavLink to='/login'>Login</NavLink>
          </div>
        </div>
      </Form>
    </div>
  );
};

export const signupAction = async ({ request }) => {
  const data = await request.formData();

  const submission = {
    email: data.get('email'),
    password: data.get('password'),
    confirmPassword: data.get('confirmPassword'),
  };

  console.log('submission: ', submission);
  return redirect('/');
};
