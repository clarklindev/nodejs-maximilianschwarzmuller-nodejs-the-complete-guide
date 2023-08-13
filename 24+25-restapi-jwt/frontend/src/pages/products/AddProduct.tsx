import React from 'react';
import { Form, redirect } from 'react-router-dom';

import styles from './AddProduct.module.css';
import { formDataToJsonApi } from '../../lib/helpers/formDataToJsonApi';

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
  const data = await request.formData();
  const formData = new FormData();

  formData.append('title', data.get('title'));
  formData.append('description', data.get('description'));
  formData.append('price', data.get('price'));
  const jsonData = formDataToJsonApi(formData, 'product');

  //check if formData.
  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_BACKEND_PORT
  }/products`;

  // //send post request
  const result = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(jsonData),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (result.ok) {
    return redirect('/products');
  }

  return await result.json();
};
