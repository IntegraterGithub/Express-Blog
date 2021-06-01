var express = require("express");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://dbUser:dbPassword@cluster0.osuxa.mongodb.net/myBlog", {
	useNewUrlParser: true, 
	useUnifiedTopology: true
})
app.use(express.urlencoded({extended: false}));
var get_ip = require('ipware')().get_ip;
var articleSchema = new mongoose.Schema({
	title: String, 
	description: String, 
	content: String,
	date: String,
	views: Number,
	viewersIp: Array
})
var articleModel = mongoose.model("articles", articleSchema);
var newPost = (post) => {
var Post = new articleModel(post);
Post.save()
}

app.get("/post", (req, res) => {
	
 //const article = await articleModel.findOne({}).lean();
})

app.set('view engine', "ejs");

app.get('/', async (req, res) => {
  
 const articles = await articleModel.find({}).sort({date: 1}).lean();

res.render("index", {articles: articles})
})
app.get("/article/:title", async (req, res) => {
const article = await articleModel.findOne({title: req.params.title.split("-").join(" ")}).lean();
if(!article) return res.send("not found");
var ip_info = get_ip(req);
     console.log(ip_info);
if(article.viewersIp.indexOf(ip_info.clientIp) === -1) {
	article.views = article.views + 1
	article.save();
}
res.render("article", {article: article})
})
app.listen(process.env.PORT || 3000, () => { 
	console.log(`App listening!`)
})
console.log(Date());
