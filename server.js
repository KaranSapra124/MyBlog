const express = require("express")
const mongoose = require('mongoose')
const ejs = require('ejs');
const bodyParser = require("body-parser")
const path = require("path")
const cors = require("cors")
const app = express()

// MIddlewares setup to make the backend code work


mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://saprakaran001:Iamphenomenol1@cluster0.ld8blmo.mongodb.net/?retryWrites=true&w=majority")
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const userPost = new mongoose.Schema({
    Title: { type: String },
    Description: { type: String },
    Date: { type: String }
})

const Userpost = mongoose.model("Userpost", userPost);

const UserComment = new mongoose.Schema({
    Title: { type: String },
    CommentDesc: { type: String }
})

const Comment = mongoose.model("Comment", UserComment)


// Routes to pages 
// When homepage loads

app.get("/", (req, res) => {
    Userpost.find({})
        .then((docs) => {
            res.render("index", { Posts: docs })
        })
})

app.get("/AddPost", (req, res) => {
    res.render("AddBlog")
}).post('/AddPost', (req, res) => {
    const NewPost = new Userpost({
        Title: req.body.Title,
        Description: req.body.Desc,
        Date: req.body.Date
    })
    NewPost.save()
    res.redirect("/")
})

// To browse or comment on an individual post


app.get("/:title", async (req, res) => {
    // console.log(req.params.title);
    await Userpost.findOne({ Title: req.params.title })
        .then((docs) => {
            Comment.find({ Title: req.params.title })
                .then((Data) => {
                    // console.log(Data);
                    res.render("ReadPost",{Docs:docs , CommentData:Data})
                })
            
        })

}).post("/:title", (req, res) => {
    const NewComm = new Comment({
        Title: req.params.title,
        CommentDesc: req.body.Comment
    })
    NewComm.save()
    res.redirect('/')

})


// To check whether server is running or not


app.listen(3000, () => {
    console.log("Running");
})

