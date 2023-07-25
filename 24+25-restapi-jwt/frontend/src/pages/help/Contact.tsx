import React from 'react';
import { Form, redirect, useActionData } from 'react-router-dom';
import styles from './Contact.module.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
export const Contact = () => {
  const data = useActionData();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  return (
    <>
      <h3>Contact</h3>
      <Form className={styles.form} method='post' action='/help/contact'>
        <label>
          <span>your email:</span>
          <input type='email' name='email' required />
        </label>
        <label>
          <span>your message:</span>
          <textarea name='message' required />
        </label>

        <button>Submit</button>

        {data && data.error && <p>{data.error}</p>}
      </Form>
    </>
  );
};

export const action = async ({ request }) => {
  console.log(request);

  const data = await request.formData();

  //send post request
  if (submission.message.length < 10) {
    return { error: 'message must be over 10 chars long' };
  }

  try {
    const response = await sendRequest(
      'http:localhost:3000/contacts',
      'POST',
      data
    );
    console.log('FRONTEND response:', response);
  } catch (err) {
    console.log(err);
  }

  //redirect user
  return redirect('/');
};
