import React from 'react';
import {
  useLoaderData,
  NavLink,
  useSearchParams,
  useNavigate,
  useHref,
  redirect,
} from 'react-router-dom';

import styles from './Products.module.css';

export const Products = () => {
  const { products, totalItems, perPage } = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentUrl = useHref();

  let page = parseInt(searchParams.get('page'));

  const totalPages = Math.ceil(parseInt(totalItems) / parseInt(perPage));

  const updatePage = (type: string) => {
    switch (type) {
      case 'prev':
        if (page > 1) {
          page = page - 1;
        }
        break;
      case 'next':
        if (page <= 1) {
          page = 1;
        }

        if (page < totalPages) {
          page = page + 1;
        }
        break;
      default:
        return;
    }

    navigate(`${currentUrl}?page=${page}&items=${perPage}`);
  };

  return (
    <div className={styles.products}>
      <NavLink className={styles['nav-link']} to={`/products/create`}>
        Add product
      </NavLink>
      <h2>Products</h2>
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

  const domain = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_PORT
  }`;

  if (parseInt(page) < 1) {
    throw Error('Invalid page - Could not fetch the data');
  }

  const res = await fetch(`${domain}/products?page=${page}&items=${items}`);

  if (!res.ok) {
    throw Error('Could not fetch the data');
  }

  return res.json({
    data: res,
  });
};
