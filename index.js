const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {dbName: "simplonapp"})
.then(() => console.log("connected successfully to simplonapp"))
.catch((error) => console.log("error", error));

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true,
    unique: true
  }
});

const itemSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  itemImg: {
    type: String,
    required: true
  },
  itemTitle: {
    type: String,
    required: true
  },
  itemDesc: {
    type: String,
    required: true
  },
  itemPrice: {
    type: String,
    required: true
  },
  town: {
    type: String,
    required: true
  },
  rent: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);
const Item = mongoose.model("Item", itemSchema);

async function addUser(req, res) {
  const a = req.body;
  await User.findOne({email: a.email}).then(data => {
    if(data) {
      console.log("user already registered", data);
      return res.send("User already registered");
    }
  }).catch(err => console.log(err));
  
  let b = new User({email: a.email, name: a.name, password: a.password, number: a.number});
  await b.save().then(data => {
    console.log(`User ${data.email} added to database`, data);
    return res.json({email: data.email, name: data.name, password: data.password, number: data.number});
  }).catch(err => console.log(err));
}

async function addItem(req, res) {
  const a = req.body;
  let b = new Item({email: a.email, itemImg: a.itemImg, itemTitle: a.itemTitle, itemDesc: a.itemDesc, 
    itemPrice: a.itemPrice, category: a.category, town: a.town, rent: a.rent});
  await b.save().then(data => {
    console.log("New item added to database", data);
    return res.json({email: data.email, itemImg: data.itemImg, category: data.category});
  }).catch(err => console.log(err));

}

async function getItems(req, res) {
  await Item.find({}).then(data => {
    if(data) {
      console.log(data);
      return res.json(data);
    }
  }).catch(err => console.log(err));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post("/user", (req, res) => {
  addUser(req, res);
});

app.post("/item", (req, res) => {
  addItem(req, res);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});