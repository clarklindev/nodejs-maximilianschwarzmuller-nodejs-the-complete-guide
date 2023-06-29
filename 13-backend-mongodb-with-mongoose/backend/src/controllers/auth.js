const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

  try {
    getTransporter().sendMail(
      {
        to: email,
        from: {
          name: 'Clark',
          address: process.env.GMAIL_USER,
        },
        subject: 'signup succeeded',
        html: '<h1>you successfully signed up</h1>',
      },
      (err, info) => {
        console.log(info);
      }
    );
  } catch (err) {
    console.log(err);
  }

  res.json({
    status: 'OK',
    data: 'successfully created new user',
  });
};

exports.postResetPassword = (req, res, next) => {
  //callback with error or buffer

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return res.json({ status: 'error', message: err.message });
    }

    //create a token for user asking to reset password
    const token = buffer.toString('hex'); //decodes from hex to string val

    //find matching User account
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ status: 'error', message: 'user not found' });
    }
    //store token on user model
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;

    const result = await user.save();

    //send email
    try {
      const domainUrl =
        process.env.NODE_ENV === 'development'
          ? process.env.DEVELOPMENT_URL
          : process.env.PRODUCTION_URL;

      console.log('domainUrl: ', domainUrl);

      getTransporter().sendMail(
        {
          to: req.body.email,
          from: {
            name: 'Clark',
            address: process.env.GMAIL_USER,
          },
          subject: 'password reset',
          html: `<p>you requested a password reset</p>
        <p>Click this <a href="http://${domainUrl}/auth/reset/${token}">link</a> to set a new password.
      `,
        },
        (err, info) => {
          if (err) {
            res.json({ status: 'error', message: err });
          }
          res.json({ status: info, url: domainUrl });
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
};

//on the FRONTEND:
//user enters new password, which is sent as a form post
// at this stage the password reset has already been requested and the user has clicked on the link received in the email
//AND user has entered new password and sent the form..which is now handled by this function.
exports.postNewPassword = async (req, res, next) => {
  const token = req.params.token;

  //new password
  const newPassword = req.body.password;

  //check if there is a user which has a matching token - and experation date is after the current date (meaning token is still valid)
  //dont need to check what user._id is because on client side would have passed in user._id to this route anyways..
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return res.json({ status: 'token invalid' });
  }
  //encrypt new password
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    const result = await user.save();
    res.json({ status: result });
  } catch (err) {
    console.log(err);
  }
};
