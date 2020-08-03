//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });
//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];


//required: [true, "Things want to do is missing, please check back"]
const ItemSchema = new mongoose.Schema ({
  title: {
    type: String

  }
});

//name, nameofSchema
const Item = mongoose.model("Item", ItemSchema);

const breakFast = new Item ({
  title: "Eat Breakfast"
});

const coding = new Item({
  title: "Don't forget to code today."
});


const defaultItems = [breakFast, coding];




app.get("/", function(req, res) {
  // {} means find all
  Item.find({}, function(err, founditems) {
    //if the database is empty, insert the default data.
    if (founditems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Default Items have been added to the list.");
        }
      });
      res.redirect("/");
    }
    else {
      res.render("list", {listTitle: "Today", newListItems: founditems});


    }
  });


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item ({
    name: itemName
  });

  item.save();

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");




});
