const Contact = require('../models/contact');
const mongoose = require('mongoose');

exports.createContact = async (req, res, next) => {
  const clientId = req.query.clientId;
  console.log('clientId: ', clientId);

  // this will be one contact for clientId
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;

  const contact = new Contact({
    firstName,
    lastName,
    email,
    phoneNumber,
    clientId: new mongoose.Types.ObjectId(clientId),
  });

  try {
    await contact.save();
    res.status(200).json({ status: 'CONTACT CREATED' });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

exports.getContact = async (req, res, next) => {
  const clientId = req.query.clientId;
  console.log('clientId: ', clientId);

  const queryContact = req.params.id;
  console.log('queryContact: ', queryContact);
  try {
    const contact = await Contact.where({ clientId: clientId }).where({
      _id: queryContact,
    });
    console.log('CONTACT: ', contact);
    res.json({ contact });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err });
  }
};

exports.updateContact = async (req, res, next) => {
  const clientId = req.query.clientId;
  console.log('clientId: ', clientId);

  const queryContact = req.params.id;
  console.log('queryContact: ', queryContact);
  try {
    const result = await Contact.findOneAndUpdate(
      {
        clientId: clientId,
        _id: queryContact,
      },
      { ...req.body, updatedAt: new Date().getTime() },
      { timestamps: false, strict: false }
    );
    res.json({ status: 'PRODUCT EDITED', result });
  } catch (err) {
    console.log(err);
    return res.json({ status: 'NOT FOUND' });
  }
};

exports.deleteContact = async (req, res, next) => {
  const clientId = req.query.clientId;
  console.log('clientId: ', clientId);

  const queryContact = req.params.id;
  console.log('queryContact: ', queryContact);
  try {
    const result = await Contact.findOneAndDelete({
      clientId: clientId,
      _id: queryContact,
    });
    res.json({ status: 'PRODUCT DELETED', result });
  } catch (err) {
    console.log(err);
    return res.json({ status: 'NOT FOUND' });
  }
};
