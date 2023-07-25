import React from 'react';

import styles from './SignUp.module.css';
import { Form, useActionData, redirect } from 'react-router-dom';

export const PasswordInitReset = () => {
  const data = useActionData();
  return (
    <div className={styles.wrapper}>
      <Form
        className={styles['form']}
        action='/password-init-reset'
        method='POST'
      >
        <div className={styles['form-control']}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' />
        </div>
        <div className={styles['form-buttons']}>
          <button type='submit'>Reset</button>
        </div>
      </Form>
    </div>
  );
};

export const action = async ({ request }) => {
  const data = await request.formData();

  const submission = {
    email: data.get('email'),
  };

  //fetch()

  return redirect('/');
};
