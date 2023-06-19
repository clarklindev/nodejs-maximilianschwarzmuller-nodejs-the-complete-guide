exports.getLogin = (req, res, next) => {
  // access session cookie
  console.log(req.session.isLoggedIn);
};

exports.postLogin = (req, res, next) => {
  // see chrome browser tools -> application -> will set a cookie
  req.session.isLoggedIn = true;
};
