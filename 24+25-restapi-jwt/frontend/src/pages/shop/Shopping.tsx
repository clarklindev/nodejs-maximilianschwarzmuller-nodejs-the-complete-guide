import React from 'react';
import {
  useLoaderData,
  NavLink,
  useSearchParams,
  useNavigate,
  useHref,
} from 'react-router-dom';

import styles from './Shopping.module.css';

export const Shopping = () => {
  // const { products, totalItems, perPage, page } = useLoaderData();
  // const [searchParams] = useSearchParams();
  // const navigate = useNavigate();

  // // const currentUrl = useHref();
  // const queryPage = searchParams.get('page');
  // const queryItems = searchParams.get('items');

  // const totalPages = Math.ceil(parseInt(totalItems) / parseInt(perPage));

  // only used if query params: 'page' && 'items'
  // const updatePage = (type: string) => {
  //   let newPage;

  //   switch (type) {
  //     case 'prev':
  //       if (+page > 1) {
  //         newPage = +page - 1;
  //       }
  //       break;
  //     case 'next':
  //       if (+page < totalPages) {
  //         newPage = +page + 1;
  //       }
  //       break;
  //     default:
  //       return;
  //   }

  //   if (+page < 1) {
  //     newPage = 1;
  //   }

  //   console.log('-------------------------------------\nnewPage: ', newPage);

  //   navigate(`${currentUrl}?page=${newPage}&items=${perPage}`);
  // };

  return (
    <div>
      <h2>Shopping</h2>

      {/* show if 'page' exists and 'perPage' exists */}
      {/* {((queryPage && queryItems) || page) && (
        <div className='paginationButtons'>
          {page > 1 && <button onClick={() => updatePage('prev')}>Prev</button>}
          {`${page} of ${totalPages}`}

          {page < totalPages && (
            <button onClick={() => updatePage('next')}>Next</button>
          )}
        </div>
      )} */}

      {/* {products.map((product, index) => {
        return (
          <div key={index}>
            <p>{product.title}</p>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}:${
                import.meta.env.VITE_BACKEND_PORT
              }/images/${product.imageUrl}`}
              width='200'
              height='auto'
              alt={product.title}
            />
          </div>
        );
      })} */}
    </div>
  );
};

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  // let page = url.searchParams.get('page') || 1;
  // let items = url.searchParams.get('items') || 10;

  // const domain = `${import.meta.env.VITE_BACKEND_URL}:${
  //   import.meta.env.VITE_BACKEND_PORT
  // }`;

  // const result = await fetch(`${domain}/shop?page=${page}&items=${items}`, {
  //   method: 'GET',
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //   },
  // });

  // if (!result.ok) {
  //   throw Error('Could not fetch the data');
  // }

  return null; //result.json();
};
