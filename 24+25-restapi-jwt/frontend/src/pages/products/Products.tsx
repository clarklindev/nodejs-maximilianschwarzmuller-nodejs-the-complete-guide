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

  const totalPages = Math.ceil(parseInt(totalItems) / parseInt(perPage));

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
      <h2>Products</h2>
      <NavLink className={styles['nav-link']} to={`/products/create`}>
        Add product
      </NavLink>
      {/* show if 'page' exists and 'perPage' exists */}
      {((queryPage && queryItems) || page) && (
        <div className='paginationButtons'>
          {page > 1 && <button onClick={() => updatePage('prev')}>Prev</button>}
          {`${page} of ${totalPages}`}

          {page < totalPages && (
            <button onClick={() => updatePage('next')}>Next</button>
          )}
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
                import.meta.env.VITE_BACKEND_PORT
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
  const url = new URL(request.url);

  let page = url.searchParams.get('page');
  let items = url.searchParams.get('items');
  const query = page && items ? `?page=${page}&items=${items}` : '';

  const domain = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_BACKEND_PORT
  }`;

  const result = await fetch(`${domain}/products${query}`, {
    method: 'GET',
    // headers: {
    //   Authorization: `Bearer ${localStorage.getItem('token')}`,
    // },
  });

  if (!result.ok) {
    throw Error('Could not fetch the data');
  }

  return result.json();
  return null;
};
