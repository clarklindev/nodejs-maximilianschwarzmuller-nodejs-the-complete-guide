const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // access session cookie
  console.log(req.session.isLoggedIn);
};

exports.postLogin = async (req, res, next) => {
  // see chrome browser tools -> application -> will set a cookie
  try {
    const user = await User.findById('648d9b2926121ba0bf431eed');
    req.session.isLoggedIn = true;
    req.session.user = user;

    req.session.save((err) => {
      console.log(err);
      //ensure session was created before redirect()
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.postLogout = async (req, res, next) => {
  // clear session
  // callback with potential error as prop
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
