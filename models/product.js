const { default: mongoose } = require('mongoose')

const Schema = require('mongoose').Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
}
})

module.exports = mongoose.model('Product', productSchema)





// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   async save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       // Update the product
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     try {
//       const result = await dbOp;
//       console.log(result);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async fetchAll() {
//     const db = getDb();
//     try {
//       const products = await db.collection('products').find().toArray();
//       console.log(products);
//       return products;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async findById(prodId) {
//     const db = getDb();
//     try {
//       const product = await db
//         .collection('products')
//         .find({ _id: new mongodb.ObjectId(prodId) })
//         .next();
//       console.log(product);
//       return product;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async deleteById(prodId) {
//     const db = getDb();
//     try {
//       const result = await db
//         .collection('products')
//         .deleteOne({ _id: new mongodb.ObjectId(prodId) });
//       console.log('Deleted');
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// module.exports = Product;