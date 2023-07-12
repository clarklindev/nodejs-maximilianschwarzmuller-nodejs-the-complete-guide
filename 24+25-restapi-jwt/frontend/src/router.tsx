import React from 'react';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

// layouts
import { HomeLayout } from './layouts/HomeLayout';
import { HelpLayout } from './layouts/HelpLayout';
import { ProductsLayout } from './layouts/ProductsLayout';

// pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { Faq } from './pages/help/Faq';
import { Contact, contactAction } from './pages/help/Contact';

//admin
import { Products, productsLoader } from './pages/admin/Products';
import {
  ProductDetails,
  productDetailsLoader,
} from './pages/admin/ProductDetails';
import { ProductError } from './pages/admin/ProductError';
import { AddProduct, addProductAction } from './pages/admin/AddProduct';

//auth
import { Login, loginAction } from './pages/auth/Login';
import { SignUp, signupAction } from './pages/auth/SignUp';
import {
  PasswordInitReset,
  passwordInitResetAction,
} from './pages/auth/PasswordInitReset';
import {
  PasswordUpdate,
  passwordUpdateAction,
} from './pages/auth/PasswordUpdate';

//testing
import { UploadImage, uploadImageAction } from './pages/testing/UploadImage';

// Configure nested routes with JSX
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<HomeLayout />}>
      <Route index element={<Home />} />
      <Route path='about' element={<About />} />
      {/* testing */}
      <Route
        path='testing/upload'
        element={<UploadImage />}
        action={uploadImageAction}
      />

      {/* help */}
      <Route path='help' element={<HelpLayout />}>
        <Route path='faq' element={<Faq />} />
        <Route path='contact' element={<Contact />} action={contactAction} />
      </Route>

      {/* auth */}
      <Route path='auth/login' element={<Login />} action={loginAction} />
      <Route path='auth/signup' element={<SignUp />} action={signupAction} />
      <Route
        path='auth/password-init-reset'
        element={<PasswordInitReset />}
        action={passwordInitResetAction}
      />
      <Route
        path='auth/password-update'
        element={<PasswordUpdate />}
        action={passwordUpdateAction}
      />

      {/* admin */}
      <Route
        path='admin'
        element={<ProductsLayout />}
        errorElement={<ProductError />}
      >
        <Route path='products' element={<Products />} loader={productsLoader} />
        <Route
          path='products/:productId'
          element={<ProductDetails />}
          loader={productDetailsLoader}
        />
        <Route
          path='add-product'
          element={<AddProduct />}
          action={addProductAction}
        />
      </Route>

      <Route path='*' element={<NotFound />} />
    </Route>
  )
);
