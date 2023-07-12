import React from 'react';

import styles from './Login.module.css';
import { NavLink, Form, redirect, useActionData } from 'react-router-dom';

export const Login = () => {
  const data = useActionData();

  return (
    <div className={styles.wrapper}>
      {/* action= url to which the form will be submitted */}
      <Form className={styles['form']} action='/auth/login' method='POST'>
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
        </div>
        <div>
          Dont have an account? <NavLink to='/auth/signup'>Sign up</NavLink>
        </div>
        <div>
          Forgot your password?{' '}
          <NavLink to='/auth/password-init-reset'>Reset password</NavLink>
        </div>
      </Form>
      {data && data.error && <p>{data.error}</p>}
    </div>
  );
};

export const loginAction = async ({ request }) => {
  const data = await request.formData();

  // Extract form data values
  const submission = {};
  for (const [key, value] of data.entries()) {
    submission[key] = value;
  }

  //send post request
  const result = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  });
  const returned = await result.json(); //{token, userId}

  if (submission.password.length < 3) {
    return { error: 'password must be over 3 chars' };
  }

  return redirect('/');
};
