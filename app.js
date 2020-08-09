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

const ItemsSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: [true, "Things want to do is missing, please check back"]
  }
});

const listSchema = {
  name:String,
  items: [ItemsSchema]
}


//name, nameofSchema
const Item = mongoose.model("Item", ItemsSchema);

const List = mongoose.model("List", listSchema);

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
    title: itemName
  });

  item.save();

  //after the item have been saved, redirect back to the / and render all items
  res.redirect("/");

});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.CheckBoxToDelete;

  Item.findOneAndRemove({_id: checkedItemId}, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Selected data has been remove");
      res.redirect("/");
    }
  });
});

app.get("/:customListName", function(req,res){
  const customListName = req.params.customListName;

  //check if the list already exist, don't add duplicate data to the databse
  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
      if(!foundList) {
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();

        res.redirect("/" + customListName);
      }
      else {
        //listTitle: customeListName also works
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
    else {
      console.log(foundList);
    }
  });
  /*
  */
});

app.get("/work", function(req,res){
  res.render("work");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");




});
