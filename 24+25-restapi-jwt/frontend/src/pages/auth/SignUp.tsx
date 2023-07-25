import React from 'react';
import { NavLink, Form, useActionData, redirect } from 'react-router-dom';

import styles from './SignUp.module.css';
import { UserAttributes } from '../../interfaces/UserAttributes';
import { formDataToJsonApi } from '../../global/helpers/formDataToJsonApi';

export const SignUp = () => {
  const data = useActionData();

  return (
    <div className={styles.wrapper}>
      <Form className={styles['form']} action='/auth/signup' method='POST'>
        <div className={styles['form-control']}>
          <label htmlFor='username'>Username</label>
          <input type='text' name='username' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='confirmPassword'>Confirm password</label>
          <input type='password' name='confirmPassword' />
        </div>
        <div className={styles['form-buttons']}>
          <button type='submit'>Sign up</button>
        </div>
        <div>
          account already exists? <NavLink to='/auth/login'>Login</NavLink>
        </div>
        <div>
          Forgot your password{' '}
          <NavLink to='/auth/password-init-reset'>Reset password</NavLink>
        </div>
      </Form>
    </div>
  );
};

export const action = async ({ request }) => {
  const data = await request.formData();

  const formData = new FormData();
  formData.append('username', data.get('username'));
  formData.append('email', data.get('email'));
  formData.append('password', data.get('password'));

  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_PORT
  }/auth/signup`;

  const jsonData = formDataToJsonApi<UserAttributes>(formData, 'user');

  const result = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' },
    body: JSON.stringify(jsonData),
  });

  return result;
};
