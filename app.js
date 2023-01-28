const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);
//////////////////////////////////   Targeting all route    //////////////////////////////
app.route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticle) {
      if (err) {
        console.log(err);
      } else {
        res.send(foundArticle);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Saved Successfully");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Deleted Successfully");
      }
    });
  });

//////////////////////////////////   Targeting all route    //////////////////////////////

app.route("/articles/:articleTitle")
  .get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(err){
            res.send(err);
        }
        else{
            res.send(foundArticle);
        }
    });
  })
  .put(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle}, //specific id or name
        {title:req.body.title,content:req.body.content}, // condition
        //overwrite true because we are using mongoose 
        function(err){
            if(!err){
                res.send("updated successfully");
            }else{
                res.send(err);
            }
        }
    )
  })
  .patch(function(req,res){
    Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
        if(!err){
            res.send("updated successfully");
        }else{
            res.send(err);
        }
    }
    );
})
    .delete(function(req,res){
        Article.deleteOne(
            {title:req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("deleted successfully");
                }else{
                    res.send(err);
                }
            }
        )
    })


app.listen(3000, function (req, res) {
  console.log("listening on 3000 port");
});
