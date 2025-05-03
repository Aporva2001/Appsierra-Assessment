const express= require('express')
const authRoutes= require('./routes/auth')
const projectRoutes= require('./routes/projects')

const mongoose = require('mongoose')
const cors= require('cors')

const app= express();

app.use(cors())

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS"
}))


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(authRoutes)
app.use(projectRoutes)

mongoose.connect('mongodb+srv://password_2001:password_2001@cluster0.ucqxscj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(app.listen(8080, ()=>{
    console.log("Database connected successfully")
}))
.catch(err =>{
    console.log(err)
})