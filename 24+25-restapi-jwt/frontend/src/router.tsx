import React from 'react';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

//layouts
import { HomeLayout } from './layouts/HomeLayout';
import { HelpLayout } from './layouts/HelpLayout';
import { ProductsLayout } from './layouts/ProductsLayout';
//pages
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { Faq } from './pages/help/Faq';
import { Contact, action as contactAction } from './pages/help/Contact';
//shop
import { Orders } from './pages/shop/Orders';
import { Cart } from './pages/shop/Cart';
import { Shopping, loader as shoppingLoader } from './pages/shop/Shopping';
//admin
import { Products, loader as productsLoader } from './pages/products/Products';
import {
  EditProduct,
  loader as editProductLoader,
  action as editProductAction,
} from './pages/products/EditProduct';
import { ProductError } from './pages/products/ProductError';
import {
  AddProduct,
  action as addProductAction,
} from './pages/products/AddProduct';
//auth
import { Login, action as loginAction } from './pages/auth/Login';
import { SignUp, action as signupAction } from './pages/auth/SignUp';
import {
  PasswordInitReset,
  action as passwordInitResetAction,
} from './pages/auth/PasswordInitReset';
import {
  PasswordUpdate,
  action as passwordUpdateAction,
} from './pages/auth/PasswordUpdate';

// Configure nested routes with JSX
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<HomeLayout />}>
      <Route index element={<Shopping />} loader={shoppingLoader} />

      <Route path='about' element={<About />} />

      {/* help */}
      <Route path='help' element={<HelpLayout />}>
        <Route path='faq' element={<Faq />} />
        <Route path='contact' element={<Contact />} action={contactAction} />
      </Route>

      {/* auth */}
      <Route path='auth'>
        <Route path='login' element={<Login />} action={loginAction} />
        <Route path='signup' element={<SignUp />} action={signupAction} />
        <Route
          path='password-init-reset'
          element={<PasswordInitReset />}
          action={passwordInitResetAction}
        />
        <Route
          path='password-update'
          element={<PasswordUpdate />}
          action={passwordUpdateAction}
        />
      </Route>

      {/* products */}
      <Route
        path='products'
        element={<ProductsLayout />}
        errorElement={<ProductError />}
      >
        <Route
          path='create'
          element={<AddProduct />}
          action={addProductAction}
        />

        <Route path='' element={<Products />} loader={productsLoader} />

        <Route
          path=':productId'
          element={<EditProduct />}
          loader={editProductLoader}
          action={editProductAction}
        />
      </Route>

      {/* shop */}
      <Route path='shop'>
        <Route path='orders/:orderId' element={<Orders />} />
        <Route path='cart' element={<Cart />} />
      </Route>

      <Route path='*' element={<NotFound />} />
    </Route>
  )
);
