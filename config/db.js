if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://anderson:<password>@blogapp.dl4lo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}