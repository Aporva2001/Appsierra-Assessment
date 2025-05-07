require('dotenv').config()

const express= require('express')
const authRoutes= require('./routes/auth')
const projectRoutes= require('./routes/projects')
const taskRoutes= require('./routes/tasks')

const mongoose = require('mongoose')
const cors= require('cors')

const app= express();

app.use(cors())

app.use(cors({
    origin: `${process.env.REACT_FRONTEND_URI}`,
    credentials: true,
    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS"
}))


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(authRoutes)
app.use(projectRoutes)
app.use(taskRoutes)

mongoose.connect(`${process.env.MONGODB_URI}`)
.then(app.listen(process.env.BACKEND_PORT, ()=>{
    console.log("Database connected successfully")
}))
.catch(err =>{
    console.log(err)
})