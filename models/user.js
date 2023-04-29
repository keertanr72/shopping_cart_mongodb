const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  async save() {
    const db = getDb();
    try {
      await db.collection('users').insertOne(this);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    try {
      await db.collection('users').updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    try {
      const products = await db.collection('products').find({ _id: { $in: productIds } }).toArray();
      return products.map(p => {
        return {
          ...p,
          quantity: this.cart.items.find(i => {
            return i.productId.toString() === p._id.toString();
          }).quantity
        };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    try {
      await db.collection('users').updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async addOrder() {
    const db = getDb();
    try {
      const products = await this.getCart();
      const order = {
        items: products,
        user: {
          _id: new ObjectId(this._id),
          name: this.name
        }
      };
      await db.collection('orders').insertOne(order);
      this.cart = { items: [] };
      await db.collection('users').updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: [] } } }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getOrders() {
    const db = getDb();
    try {
      return await db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async findById(userId) {
    const db = getDb();
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      console.log(user);
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = User

