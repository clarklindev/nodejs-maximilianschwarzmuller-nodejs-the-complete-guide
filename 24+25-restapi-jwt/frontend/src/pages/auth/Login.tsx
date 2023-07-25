import React from 'react';
import { NavLink, Form, redirect, useActionData } from 'react-router-dom';

import { ILoginResponse } from '../../interfaces/ILoginResponse';
import styles from './Login.module.css';
import { formDataToJsonApi } from '../../global/helpers/formDataToJsonApi';
import { UserAttributes } from '../../interfaces/UserAttributes';

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

  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_PORT
  }/auth/login`;

  const jsonData = formDataToJsonApi<LoginAttributes>(data, 'user');

  const result = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' },
    body: JSON.stringify(jsonData),
  });

  const returned = (await result.json()) as ILoginResponse; //an object with {token, userId}

  console.log('returned: ', returned);

  return redirect('/');
};
