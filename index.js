const express=require('express');
const mongoose=require('mongoose');
const app =express();
const dotenv=require('dotenv');
const path =require("path");
const bodyParser=require('body-parser');
const port=process.env.PORT || 3000;
dotenv.config({ path: './config.env'});
const static_path=path.join(__dirname, "./public");
const template_path=path.join(__dirname, "./templates/views");
require("./src/db/conn")
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",template_path);

const itemSchema={
    name:String
}
const Item=mongoose.model("Item",itemSchema);
const item1=new Item({
    name:"complete math homework",
});
const item2=new Item({
    name:"party with friends",
});
const item3=new Item({
    name:"music ",
});
const d=[item1,item2,item3];
app.get("/",(req,res)=>{
    Item.find({},function(err,f)
    {
       // console.log(f);
       if(f.length===0)
       {
         Item.insertMany(d,function(err)
         {
             if(err){
                 console.log(err);
             }
             else{
                 console.log("Successfully saved items to DB");
             }
         });
       res.redirect("/");
       }
       else{
       res.render("list",{newListItems:f});
       }
    })
   ;
})

app.post("/",(req,res)=>{
    const itemName=req.body.n;
    //console.log(i);
    //i1.push(i);
    //res.render("list",{newListItem:i});
   // res.redirect("/");
   const item=new Item({
       name:itemName
   });
item.save();
res.redirect("/");
})
app.post("/delete",function(req,res)
{
  const check=req.body.checkbox;
  Item.findByIdAndRemove(check,function(err)
  {
      if(!err)
      {
          console.log("Successfully deleted");
          res.redirect("/");
      }
  })
});
app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})