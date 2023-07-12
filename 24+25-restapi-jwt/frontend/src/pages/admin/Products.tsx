import React from 'react';
import { useLoaderData, NavLink } from 'react-router-dom';
import styles from './Products.module.css';

export const Products = () => {
  const { products } = useLoaderData();
  console.log('products: ', products);

  return (
    <div className={styles.products}>
      <h2>Products</h2>
      {products.map((product, index) => (
        <NavLink
          className={styles['nav-link']}
          to={`${product._id}`}
          key={index}
        >
          <p>{product.title}</p>
        </NavLink>
      ))}
    </div>
  );
};

export const productsLoader = async () => {
  console.log('productsLoader');
  const res = await fetch('http://localhost:3000/admin/products');

  if (!res.ok) {
    throw Error('Could not fetch the data');
  }

  return res.json();
};
