// Function to check if the token cookie is present

//document.cookie, will not work when the httpOnly flag is set to true.
//eg server response: res.cookie('token', token, { httpOnly: true, secure: true });

export const checkLoggedIn = (cookiename: string) => {
  const cookies = document.cookie;
  console.log('cookies: ', cookies);

  const cookieArray = cookies.split(';');
  const tokenCookie = cookieArray.find((cookie) =>
    cookie.startsWith(`${cookiename}=`)
  );
  if (tokenCookie) {
    // Token cookie is present, user is logged in
    return true;
  } else {
    // Token cookie is not present, user is not logged in
    return false;
  }
};
