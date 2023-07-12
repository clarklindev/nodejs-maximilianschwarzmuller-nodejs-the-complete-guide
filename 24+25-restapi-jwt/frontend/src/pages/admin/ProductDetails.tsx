import React from 'react';

import { useParams, useLoaderData } from 'react-router-dom';

export const ProductDetails = () => {
  //2. consume loader data
  const { product } = useLoaderData();
  console.log('product: ', product);
  return (
    <div className='product-details'>
      <h2>Product Details</h2>
      <p>title: {product.title}</p>
      <p>description: {product.description}</p>
      <p>price: {product.price}</p>
      <p>imageUrl: {product.imageUrl}</p>
    </div>
  );
};

//1. loader function
export const productDetailsLoader = async ({ params }) => {
  const { productId } = params;
  const res = await fetch(`http://localhost:3000/admin/products/${productId}`);
  if (!res.ok) {
    throw Error('Could not find that ID');
  }
  return res.json();
};
