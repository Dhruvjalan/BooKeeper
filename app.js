import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import appRoutes from './routes/appRoutes.js'
import cookieParser from 'cookie-parser'
import { requireAuth, checkUser } from './middleware/authMiddleware.js'
import {get_this_book} from './middleware/appMiddleware.js'
const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use(checkUser)


app.set('view engine', 'ejs')


mongoose.connect(process.env.dbURI, {})
  .then(() => app.listen(4000))
  .catch((err) => console.log(err))

app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'))
app.get('/myLibrary', requireAuth, (req, res) => res.render('myLibrary'))
app.get('/add-book', requireAuth, (req, res) => res.render('addBook'))
app.get('/edit-book/:bookId', requireAuth, get_this_book, (req, res) => {
  res.render('editBook')
});
app.get('/BookNotFound', requireAuth, (req, res) => res.render('bookNotFound'))

app.use(authRoutes)
app.use(appRoutes)

app.get('/set-cookies', (req, res) => {
  res.cookie('newUser', false, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
  res.send("You got the cookies")
})

app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies
  console.log(cookies)
  res.json(cookies)
})
