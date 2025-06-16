import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import { requireAuth, checkUser } from './middleware/authMiddleware.js'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use(checkUser)


app.set('view engine', 'ejs')

const dbURI = 'mongodb+srv://ed24b047:tb3HP1wJUglHDSGa@cluster0.i6uksdv.mongodb.net/node-auth?retryWrites=true&w=majority&tls=true'

mongoose.connect(dbURI, {})
  .then(() => app.listen(4000))
  .catch((err) => console.log(err))

app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'))
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))

app.use(authRoutes)

app.get('/set-cookies', (req, res) => {
  res.cookie('newUser', false, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
  res.send("You got the cookies")
})

app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies
  console.log(cookies)
  res.json(cookies)
})
