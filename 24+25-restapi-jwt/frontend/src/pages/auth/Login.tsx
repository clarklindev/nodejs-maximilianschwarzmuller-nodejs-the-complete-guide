import React, { useContext, useEffect } from 'react';
import { NavLink, Form, useActionData, useNavigate } from 'react-router-dom';

import styles from './Login.module.css';
import { ILoginResponse } from '../../interfaces/ILoginResponse';
import { formDataToJsonApi } from '../../global/helpers/formDataToJsonApi';
import { AuthContext } from '../../context/AuthContext';

export const Login = () => {
  const data = useActionData();
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = data?.token;

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
    import.meta.env.VITE_BACKEND_PORT
  }/auth/login`;

  const jsonData = formDataToJsonApi(data, 'user');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/vnd.api+json' }, //format of what we sending
    body: JSON.stringify(jsonData),
  });

  const json = await response.json();
  localStorage.setItem('token', json.token);

  return json;
};
