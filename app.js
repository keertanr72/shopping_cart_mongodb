const path = require('path');
const mongoose = require('mongoose')

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('644d91aaee6756ba0a2048fb')
    .then(user => {
      req.user = user
      console.log(req.user)
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://keertan:keertan@cluster0.9m5vdch.mongodb.net/my_shopping_cart_database?retryWrites=true&w=majority')
  .then(() => {
    User.findOne()
      .then(user => {
        if(!user) {
          const user = new User({
            name: 'keertan',
            email: 'keertanr72@gmail.com',
            cart: {
              items: []
            }
          })
          user.save()
        }
      })
    console.log('connected')
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
