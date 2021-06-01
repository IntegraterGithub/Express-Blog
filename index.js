var express = require("express");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://dbUser:dbPassword@cluster0.osuxa.mongodb.net/myBlog", {
	useNewUrlParser: true, 
	useUnifiedTopology: true

})
var get_ip = require('ipware')().get_ip;

app.use(express.urlencoded({extended: false}));

var articleSchema = new mongoose.Schema({
	title: String, 
	description: String, 
	content: String,
	date: String
})
var articleModel = mongoose.model("articles", articleSchema);
var newPost = (post) => {
var Post = new articleModel(post);
Post.save()
}



app.set('view engine', "ejs");

app.get('/', async (req, res) => {
 var ip_info = get_ip(req);
     console.log(ip_info);
const articles = await articleModel.find({}).sort({date: 1}).lean();

res.render("index", {articles: articles})
})
app.get("/article/:title", async (req, res) => {
 const article = await articleModel.findOne({title: req.params.title.split("-").join(" ")}).lean();
if(!article) return res.send("not found")
res.render("article", {article: article})
})
app.listen(process.env.PORT || 8080, () => { 
	console.log(`App listening!`)
})
console.log(Date());
