import React from 'react';
import path from 'path';
import { useLoaderData, NavLink } from 'react-router-dom';

import styles from './Products.module.css';

export const Products = () => {
  const { products } = useLoaderData();

  return (
    <div className={styles.products}>
      <NavLink className={styles['nav-link']} to={`/products/create`}>
        Add product
      </NavLink>

      <h2>Products</h2>
      {products.map((product, index) => {
        return (
          <NavLink
            className={styles['nav-link']}
            to={`${product._id}`}
            key={index}
          >
            <p>{product.title}</p>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}:${
                import.meta.env.VITE_PORT
              }/images/${product.imageUrl}`}
              width='200'
              height='auto'
              alt={product.title}
            />
          </NavLink>
        );
      })}
    </div>
  );
};

export const loader = async () => {
  console.log('productsLoader');
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_PORT}/products`
  );

  if (!res.ok) {
    throw Error('Could not fetch the data');
  }

  return res.json();
};
