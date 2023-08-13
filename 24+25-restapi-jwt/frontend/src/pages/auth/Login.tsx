import React from 'react';
import { NavLink, Form, useActionData, useNavigate } from 'react-router-dom';

import styles from './Login.module.css';
import { formDataToJsonApi } from '../../lib/helpers/formDataToJsonApi';
import { useToken } from '../../shared/hooks/useToken';
import { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';

export const Login = () => {
  const actionData = useActionData();
  const [_, setToken] = useToken();

  const navigate = useNavigate();

  if (actionData.meta !== undefined) {
    const token = actionData.meta.token;
    setToken(token);

    navigate('/');
  }

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
        <div>
          Forgot your password?{' '}
          <NavLink to='/auth/password-init-reset'>Reset password</NavLink>
        </div>

        <br />

        <div className={styles['form-buttons']}>
          <button type='submit'>Login</button>
        </div>

        <br />

        <div>
          Dont have an account? <NavLink to='/auth/signup'>Sign up</NavLink>
        </div>
      </Form>
      {actionData && actionData.errors && <p>{actionData.errors}</p>}
    </div>
  );
};

export const action = async ({ request }) => {
  const data = await request.formData();

  //limit what we send back to server by creating a new FormData() instance
  const formData = new FormData();
  formData.append('email', data.get('email'));
  formData.append('password', data.get('password'));
  const jsonData = formDataToJsonApi(formData, 'user');

  const url = `${import.meta.env.VITE_BACKEND_URL}:
    ${import.meta.env.VITE_BACKEND_PORT}/auth/login`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' }, //format of what we sending
    body: JSON.stringify(jsonData),
  });

  const responseJSON: IJsonApiResponse | undefined = await response.json();
  return responseJSON;
};
