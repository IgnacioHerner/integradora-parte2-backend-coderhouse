import express from 'express'
import handelbars from 'express-handlebars'
import mongoose from 'mongoose'
// import MongoStore from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";


import initializePassport from "./config/passport.config.js";
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRouter from './routes/view.routes.js'
import sessionRouter from './routes/session.routes.js'
import { passportCall } from './utils.js'


mongoose.set('strictQuery', false)
dotenv.config()

const app = express()

app.use(
    session({
        // store: MongoStore.create({
        //     mongoUrl: process.env.MONGO_URI,
        //     dbName: process.env.MONGO_DB_NAME
        // }),
        secret: 'c0der',
        resave: true,
        saveUninitialized: true
    })
)
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.engine('handlebars', handelbars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')


app.use('/products',passportCall('jwt'), viewsRouter)
app.use('/session', sessionRouter)

app.use('/api/products',  productsRouter)
app.use('/api/carts', cartsRouter)


mongoose
    .connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME,
    })
    .then(() => {
        console.log('DB connected!')
    })
    .catch((err) =>{
        console.log("DB connection error:", err)
    })

app.listen(8080, () => console.log('Server up!'));