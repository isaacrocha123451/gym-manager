const express = require("express")
const nunjucks = require("nunjucks")
const routes = require("./routes")
const methordOveride = require("method-override")

const server = express()

server.use(express.urlencoded({extended : true}))
server.use(express.static("public"))
server.use(methordOveride('_method'))
server.use(routes)

server.set("view engine","njk")

nunjucks.configure("views",{
    express:server,
    autoescape:false,
    noCache:true
})




server.listen("7000",function(){
    console.log("server is running")
})