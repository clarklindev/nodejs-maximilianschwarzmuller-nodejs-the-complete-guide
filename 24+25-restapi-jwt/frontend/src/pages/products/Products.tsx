import React from 'react';
import {
  useLoaderData,
  NavLink,
  useSearchParams,
  useNavigate,
  useHref,
} from 'react-router-dom';

import styles from './Products.module.css';

export const Products = () => {
  const { products, totalItems, perPage, page } = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentUrl = useHref();
  const queryPage = searchParams.get('page');
  const queryItems = searchParams.get('items');

  console.log('products: ', products);
  console.log('totalItems: ', totalItems);
  console.log('perPage: ', perPage);
  console.log('page: ', page);

  const totalPages = Math.ceil(parseInt(totalItems) / parseInt(perPage));
  console.log('totalPages: ', totalPages);

  // only used if query params: 'page' && 'items'
  const updatePage = (type: string) => {
    let newPage;

    switch (type) {
      case 'prev':
        if (+page > 1) {
          newPage = +page - 1;
        }
        break;
      case 'next':
        if (+page < totalPages) {
          newPage = +page + 1;
        }
        break;
      default:
        return;
    }

    if (+page < 1) {
      newPage = 1;
    }

    console.log('-------------------------------------\nnewPage: ', newPage);

    navigate(`${currentUrl}?page=${newPage}&items=${perPage}`);
  };

  return (
    <div className={styles.products}>
      <NavLink className={styles['nav-link']} to={`/products/create`}>
        Add product
      </NavLink>
      <h2>Products</h2>

      {/* show if 'page' exists and 'perPage' exists */}
      {queryPage && queryItems && (
        <div className='paginationButtons'>
          <button onClick={() => updatePage('prev')} disabled={page <= 1}>
            Prev
          </button>
          <button
            onClick={() => updatePage('next')}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}

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

export const loader = async ({ request }) => {
  console.log('productsLoader');

  const url = new URL(request.url);
  let page = url.searchParams.get('page');
  let items = url.searchParams.get('items');

  console.log('page: ', page);
  console.log('items: ', items);

  const domain = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_PORT
  }`;

  const res = await fetch(`${domain}/products?page=${page}&items=${items}`);

  if (!res.ok) {
    throw Error('Could not fetch the data');
  }

  return res.json();
};
