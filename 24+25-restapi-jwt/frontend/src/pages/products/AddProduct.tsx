import React from 'react';
import { Form, redirect } from 'react-router-dom';

import styles from './AddProduct.module.css';

export const AddProduct = () => {
  return (
    <Form
      className='product-details'
      encType='multipart/form-data'
      action='/products/create'
      method='post'
    >
      <h2>Add new product:</h2>

      <div className={styles['form-control']}>
        <label htmlFor='title'>title:</label>
        <input name='title' />
      </div>

      <div className={styles['form-control']}>
        <label htmlFor='description'>description:</label>
        <input name='description' />
      </div>

      <div className={styles['form-control']}>
        <label htmlFor='price'>price:</label>
        <input name='price' />
      </div>

      <div className={styles['form-control']}>
        <label htmlFor='upload'>upload:</label>
        <input name='upload' type='file' />
      </div>

      <button type='submit'>submit</button>
    </Form>
  );
};

export const action = async ({ request }) => {
  const formData = await request.formData();

  //check if formData.

  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_PORT
  }/products`;

  // //send post request
  const result = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (result.ok) {
    return redirect('/products');
  }
  return result;
};
