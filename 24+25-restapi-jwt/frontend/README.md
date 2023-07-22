## serving files statically

## FRONTEND - form

- after setting the folder to serve files statically on the backend,

```js
import { Form, redirect } from 'react-router-dom';
<Form
  method='post'
  encType='multipart/form-data'
  action='/testing/upload'
  className={styles.form}
>
  <div className={styles['form-control']}>
    <label htmlFor='name'>name</label>
    <input name='name' />
  </div>

  <div className={styles['form-control']}>
    <label htmlFor='upload'>upload</label>
    <input name='upload' type='file' />
  </div>

  <button type='submit'>submit</button>
</Form>;
```

## formData()

- note the use of formData() by react-router-6
- when you use formData() to submit your form content, content-type for headers is set automatically by formData()

```js
// you would send from frontend like this:

const data = await request.formData(); //form data received from form post.

const url = `${import.meta.env.VITE_BACKEND_URL}:${
  import.meta.env.VITE_PORT
}/testing/upload`;

// //send post request
const result = await fetch(url, {
  method: 'POST',
  body: data,
});
```

---

## .env variables in VITE

- .env.development
- .env.production

### WHAT TO DO TO GET .ENV variables WORKING USING VITE:

update vite.config.js to include build:{ target:'es2020'} etc..

```js
// viteconfig.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },

  // include this to get import.meta.env working in the code (see below)
  build: {
    target: 'es2020', // Set the target to ES2020 or newer
    polyfillDynamicImport: false, // Disable dynamic import polyfill if necessary
  },
});
```

- access env variables by: import.meta.env
- The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'
- environment variables prefixed with `VITE_` are exposed to your application by default. Variables without the `VITE_` prefix are not exposed to the application and are only available in the build process.

```.env
<!-- example -->
VITE_API_URL=https://example.com/api
```

```js
const apiUrl = import.meta.env.VITE_API_URL;
```
