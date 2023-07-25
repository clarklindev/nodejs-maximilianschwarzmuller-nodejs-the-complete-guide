import React from 'react';

import styles from './PasswordUpdate.module.css';
import { NavLink, Form, useActionData, redirect } from 'react-router-dom';

export const PasswordUpdate = () => {
  const data = useActionData();
  return (
    <div className={styles.wrapper}>
      <Form
        className={styles['form']}
        action='/auth/password-update'
        method='POST'
      >
        <div className={styles['form-control']}>
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' id='password' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='confirmPassword'>Confirm password</label>
          <input type='password' name='confirmPassword' id='confirmPassword' />
        </div>
        <div className={styles['form-buttons']}>
          <button type='submit'>Update</button>
        </div>
      </Form>
    </div>
  );
};

export const action = async ({ request }) => {
  const data = await request.formData();

  const submission = {
    password: data.get('password'),
    confirmPassword: data.get('confirmPassword'),
  };

  return redirect('/');
};
