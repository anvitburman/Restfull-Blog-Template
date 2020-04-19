var express=require('express'),
app=express(),
methodOverride=require('method-override')
bodyparser=require('body-parser')
mongoose=require('mongoose');

app.use(bodyparser.urlencoded({extended:false}));
app.set("view engine" ,"ejs");
mongoose.connect("mongodb://localhost/blogsite",{useNewUrlParser:true,useUnifiedTopology:true});
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema({
 name:String,
 image:String,
 body:String,
 created:{type:Date ,default:Date.now }
});

var Blog =mongoose.model("Blog",blogSchema);

// Blog.create({
// name:"camping fire",
// image:"https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507441722e7ed09145c0_340.jpg",
// body:"this is the best bonefire i have ever seen "
// });

app.get("/blogs",function(req,res){
Blog.find({},function(err,newblogs){

    if(err)
    console.log(err);
    else
    res.render("index",{blogs:newblogs});
});

});
app.get("/blogs/new",function(req,res){
    res.render("new");
    })  ;  
    

app.post("/blogs",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var body=req.body.body;
    var newblog={
        name:name,image:image,body:body
    }
Blog.create(newblog,function(err,newblog){

    if(err)
    console.log(err);
    else
    res.redirect("/blogs");
});
});

app.get("/blogs/:id",function(req,res){

    Blog.findById(req.params.id,function(err,blogfound){

        if(err)
        console.log(err);
        else
        res.render("show",{blog:blogfound})
    });
});
app.get("/blogs/:id/edit",function(req,res){

    Blog.findById(req.params.id,function(err,oldblog){

        if(err)
        console.log("Old blog vali error")
        else
        res.render("edit",{blog:oldblog});
    });
    
});

app.put("/blogs/:id",function(req,res){

    var newdata={
        name:req.body.name,
        image:req.body.image,
        body:req.body.body
    }
    Blog.findByIdAndUpdate(req.params.id,newdata,function(err,updatedblog){
     if(err)
     console.log("Update vali error");
     else
     res.redirect("/blogs/"+req.params.id);
    });

});

app.delete("/blogs/:id",function(req,res)
{
    Blog.findByIdAndDelete(req.params.id,function(err,deletepost){

        if (err)
        console.log("dele vali err");
        else
        res.redirect("/blogs")
    });
});

app.listen(3000,function(){

    console.log("Server is Running");

});