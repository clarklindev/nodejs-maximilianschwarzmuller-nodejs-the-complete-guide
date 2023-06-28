const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

let transporter; // Declare the transporter variable outside the function

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }
  return transporter;
};

exports.getLogin = (req, res, next) => {
  // access session cookie
  console.log('loggedin: ', req.session.isLoggedIn);
  res.json({ status: 'STATUS', loggedIn: !!req.session.isLoggedIn });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ error: 'user does not exist' });
    }

    //compare password user entered..
    //the result of compare() is a promise where it returns true if equal and false if not equal.
    try {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        req.session.isLoggedIn = true;
        req.session.user = user;

        return req.session.save((err) => {
          console.log(err);
          //ensure session was created before redirect()
          // res.redirect('/');
          res.json({ status: 'LOGGED IN', done: true });
        });
      }
      res.json({ status: 'ERROR', message: 'incorrect credentials' });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.postLogout = async (req, res, next) => {
  // clear session
  // callback with potential error as prop
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.json({ status: 'error', message: err });
    }
    res.json({ loggedIn: 'false' });
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.json({ status: 'FAIL', data: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12); //12 is the salt (amount of times to hash - for more secure password)
    const newUser = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await newUser.save();
  } catch (err) {
    console.log(err);
  }

  //send email with sendgrid
  try {
    getTransporter().sendMail({
      to: email,
      from: process.env.GMAIL_USER,
      subject: 'signup succeeded',
      html: '<h1>you successfully signed up</h1>',
    });
  } catch (err) {
    console.log(err);
  }

  res.json({
    status: 'OK',
    data: 'successfully created new user',
  });
};
