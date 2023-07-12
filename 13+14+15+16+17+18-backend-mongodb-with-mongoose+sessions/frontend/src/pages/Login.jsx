import styles from './Login.module.css';
import { NavLink, Form, redirect, useActionData } from 'react-router-dom';

export const Login = () => {
  const data = useActionData();

  return (
    <div className={styles.wrapper}>
      {/* action= url to which the form will be submitted */}
      <Form className={styles['form']} action='/login' method='POST'>
        <div className={styles['form-control']}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' />
        </div>
        <div className={styles['form-control']}>
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' id='password' />
        </div>

        <div className={styles['form-buttons']}>
          <button type='submit'>Login</button>
          <div>
            Dont have an account? <NavLink to='/signup'>Sign up</NavLink>
          </div>
        </div>
      </Form>
      {data && data.error && <p>{data.error}</p>}
    </div>
  );
};

export const loginAction = async ({ request }) => {
  console.log('request: ', request);
  const data = await request.formData();

  // Extract form data values
  const submission = {};
  for (const [key, value] of data.entries()) {
    submission[key] = value;
  }

  console.log('submission: ', submission);

  //send post request

  await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  });

  if (submission.password.length < 3) {
    return { error: 'password must be over 3 chars' };
  }

  return redirect('/');
};
