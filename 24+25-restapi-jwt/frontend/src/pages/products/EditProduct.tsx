import React, { useState, useRef } from 'react';
import {
  Form,
  useLoaderData,
  useParams,
  useNavigate,
  redirect,
} from 'react-router-dom';

import styles from './AddProduct.module.css';

export const EditProduct = () => {
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  //2. consume loader data
  const { product } = useLoaderData();
  const { productId } = useParams();

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check if the selected file is an image (you can add more checks for other file types)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = function (event) {
        // Create an image element and set its source to the file data URL
        setFilePreview(event.target.result);
      };

      // Read the file as a data URL (base64 format)
      reader.readAsDataURL(file);
    } else {
      // If the file is not an image, set the file preview state to null
      setFilePreview(null);
    }
  };

  const handleReset = () => {
    setFilePreview(null);
    // Clear the file input by resetting its value using the useRef reference
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const deleteProduct = async () => {
    console.log('productId: ', productId);
    const url = `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/products/${productId}`;

    const result = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    console.log('result: ', result);

    if (result.ok) {
      console.log('OKAY!');
      return navigate('/products');
    }
    return result;
  };

  return (
    <Form
      className='product-details'
      encType='multipart/form-data'
      action={`/products/${productId}`}
      method='PUT'
    >
      <h2>Add new product:</h2>

      <div className={styles['form-control']}>
        <label htmlFor='title'>title:</label>
        <input name='title' defaultValue={product.title} />
      </div>

      <div className={styles['form-control']}>
        <label htmlFor='description'>description:</label>
        <input name='description' defaultValue={product.description} />
      </div>

      <div className={styles['form-control']}>
        <label htmlFor='price'>price:</label>
        <input name='price' defaultValue={product.price} />
      </div>

      {product.imageUrl && (
        <div className={styles['form-control']}>
          <label htmlFor='imageUrl:'>current image:</label>
          <input
            type='hidden'
            name='imageUrl'
            defaultValue={product.imageUrl}
          />
          {/* preview of what is currently saved */}
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}:${
              import.meta.env.VITE_BACKEND_PORT
            }/images/${product.imageUrl}`}
            alt={product.title}
            width='150'
            height='auto'
          />
        </div>
      )}

      <div className={styles['form-control']}>
        <label htmlFor='upload'>new image:</label>
        <input
          name='upload'
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Preview image container */}
      {filePreview && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '150px',
            height: 'auto',
          }}
        >
          <img
            src={filePreview}
            alt='File Preview'
            style={{ maxWidth: '100%' }}
          />
          <button style={{ height: '35px' }} onClick={handleReset}>
            delete
          </button>
        </div>
      )}

      <div>
        <button type='button' onClick={deleteProduct}>
          delete
        </button>
        <button type='submit'>submit</button>
      </div>
    </Form>
  );
};

//1. loader function
export const loader = async ({ params }) => {
  const { productId } = params;

  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_BACKEND_PORT
  }/products/${productId}`;

  const result = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!result.ok) {
    throw Error('Could not find that ID');
  }

  return result.json();
};

export async function action({ request, params }) {
  const { productId } = params;
  const formData = await request.formData(); //this is react-router-6 but same as new FormData()
  // const newFormData = new FormData();
  // for (const [key, value] of formData) {
  //   newFormData.append(key, value);
  // }

  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_BACKEND_PORT
  }/products/${productId}`;

  const result = await fetch(url, {
    method: 'PUT',
    body: formData, //no need to set contentType.. formData does this automatically.
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (result.ok) {
    return redirect('/products');
  }
  return result;
}
