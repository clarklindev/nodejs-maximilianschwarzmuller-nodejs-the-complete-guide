import React from 'react';
import { Form, redirect, useActionData } from 'react-router-dom';
export const Contact = () => {
  const data = useActionData();

  return (
    <>
      <h3>Contact</h3>
      <Form className='form' method='post' action='/help/contact'>
        <label>
          <span>your email:</span>
          <input type='email' name='email' required />
        </label>
        <label>
          <span>your message:</span>
          <textarea name='message' required />
        </label>

        <button>Submit</button>

        {data && data.error && <p>{data.error}</p>}
      </Form>
    </>
  );
};

export const contactAction = async ({ request }) => {
  console.log(request);

  const data = await request.formData();

  const submission = {
    email: data.get('email'),
    message: data.get('message'),
  };

  console.log(submission);

  //send post request
  if (submission.message.length < 10) {
    return { error: 'message must be over 10 chars long' };
  }

  //redirect user
  return redirect('/');
};
