require("dotenv").config();

const express  = require('express')
const path  = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require('./middlewares/authentication')

const Blog = require('./models/blog')
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog');


const app = express()
const PORT = process.env.PORT || 8003

//===============MongoDB Connection==================
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Successfully Connected MongoDB..!!")
})



app.set('view engine', 'ejs')
app.set('views',path.resolve('./views'))


//===================Middleware==================
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))


//==============Router Define===================
app.get("/",async (req, res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use('/user',userRouter);
app.use('/blog',blogRouter);



app.listen(PORT,()=>{
    console.log(`Server is running at port : ${PORT}`)
})