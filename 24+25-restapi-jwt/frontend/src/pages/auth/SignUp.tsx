import React from 'react';
import { NavLink, Form, useActionData, useNavigate } from 'react-router-dom';

import styles from './SignUp.module.css';
import { formDataToJsonApi } from '../../lib/helpers/formDataToJsonApi';
import { useToken } from '../../shared/hooks/useToken';
import { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';

export const SignUp = () => {
  const actionData = useActionData();
  const [_, setToken] = useToken();

  const navigate = useNavigate();

  if (actionData.meta) {
    const token = actionData.meta.token;
    setToken(token);

    navigate('/');
  }

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

        <br />

        <div className={styles['form-buttons']}>
          <button type='submit'>Sign up</button>
        </div>

        <br />

        <div>
          account already exists? <NavLink to='/auth/login'>Login</NavLink>
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
  formData.append('username', data.get('username'));
  formData.append('email', data.get('email'));
  formData.append('password', data.get('password'));
  const jsonData = formDataToJsonApi(formData, 'user');

  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_BACKEND_PORT
  }/auth/signup`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' },
    body: JSON.stringify(jsonData),
  });

  const responseJSON: IJsonApiResponse | undefined = await response.json(); // Parse the JSON response body
  return responseJSON;
};
