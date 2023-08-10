import React, { useContext, useEffect } from 'react';
import { NavLink, Form, useActionData, useNavigate } from 'react-router-dom';

import styles from './Login.module.css';
import { formDataToJsonApi } from '../../lib/helpers/formDataToJsonApi';
import { AuthContext } from '../../context/AuthContext';
import { IJsonApiResponse } from '../../interfaces/IJsonApiResponse';

export const Login = () => {
  const actionData = useActionData();

  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = actionData?.token;

  useEffect(() => {
    console.log('calls this..');
    if (!!token) {
      setLoggedIn(true);
      navigate('/');
    }
  }, [token]);

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
      {actionData && actionData.error && <p>{actionData.error}</p>}
    </div>
  );
};

export const action = async ({ request }) => {
  const data = await request.formData();

  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_BACKEND_PORT
  }/auth/login`;

  const jsonData = formDataToJsonApi(data, 'user');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' }, //format of what we sending
    body: JSON.stringify(jsonData),
  });
  const jsonapiResponse: IJsonApiResponse | undefined = await response.json();
  console.log('jsonapiResponse: ', jsonapiResponse);

  //set token in localstorage
  const token = jsonapiResponse.meta.token;
  localStorage.setItem('token', token);

  //send back to rendering function as useActionData()
  return { token };
};
