import React from 'react';

import { ILoginResponse } from '../../interfaces/ILoginResponse';
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

export const action = async ({ request }) => {
  const data = await request.formData();

  const result = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_PORT
    }/auth/login`,
    {
      method: 'POST',
      body: data,
    }
  );
  const returned = (await result.json()) as ILoginResponse; //an object with {token, userId}

  // return redirect('/');
};
