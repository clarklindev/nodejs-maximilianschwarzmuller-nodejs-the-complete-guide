import React from 'react';
import { Form, redirect } from 'react-router-dom';
import styles from './UploadImage.module.css';

export const UploadImage = () => {
  return (
    <Form
      method='post'
      encType='multipart/form-data'
      action='/testing/upload'
      className={styles.form}
    >
      <div className={styles['form-control']}>
        <label htmlFor='name'>name</label>
        <input name='name' />
      </div>

      <div className={styles['form-control']}>
        <label htmlFor='upload'>upload</label>
        <input name='upload' type='file' />
      </div>

      <button type='submit'>submit</button>
    </Form>
  );
};

export const uploadImageAction = async ({ request }) => {
  const data = await request.formData();

  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_PORT
  }/testing/upload`;

  // //send post request
  const result = await fetch(url, {
    method: 'POST',
    body: data,
  });

  if (result.ok) {
    return redirect('/');
  }

  return result;
};
