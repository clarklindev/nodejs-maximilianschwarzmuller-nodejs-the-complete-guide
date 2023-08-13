//Mongoose selective retrieval - tells mongoose which props to retrieve (selective) or which not to retrieve
//Product.find().select('title price -_id'); //return title, price, not _id

//using populate() it can retrieve full object on the prop that is using a ref by using a prop as reference
//const products = await Product.find().populate('userId');
//selective retrieval also works for .populate
//const products = await Product.find().populate('userId', 'name'); //returns ALWAYS _id unless specified not to, and "name"

import { addProduct } from './addProduct';
import { deleteAllProducts } from './deleteAllProducts';
import { deleteProduct } from './deleteProduct';
import { editProduct } from './editProduct';
import { getProduct } from './getProduct';
import { getProducts } from './getProducts';

export { addProduct, deleteAllProducts, deleteProduct, editProduct, getProduct, getProducts };
