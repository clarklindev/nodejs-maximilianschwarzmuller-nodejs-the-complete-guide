import React from 'react';
import {
  Form,
  useParams,
  useLoaderData,
  useActionData,
  redirect,
} from 'react-router-dom';
import styles from './AddProduct.module.css';

export const AddProduct = () => {
  const data = useActionData();

  return (
    <Form className='product-details' action='/admin/add-product' method='POST'>
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
        <label htmlFor='imageUrl'>imageUrl:</label>
        <input name='imageUrl' />
      </div>

      <button type='submit'>submit</button>
    </Form>
  );
};

export const addProductAction = async ({ request }) => {
  const data = await request.formData();

  console.log('data: ', data);

  // Extract form data values
  const submission = {};
  for (const [key, value] of data.entries()) {
    submission[key] = value;
  }

  // //send post request
  const result = await fetch('http://localhost:3000/admin/add-product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  });

  console.log('result:', result);
  if (result.ok) {
    return redirect('/admin/products');
  }
  return result.json(); //{token, userId}
  // console.log('returned: ', returned);
};
