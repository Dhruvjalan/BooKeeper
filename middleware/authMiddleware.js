import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Book from '../models/Book.js'


export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, 'dhruvsecret', (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.redirect('/login')
      } else {
        console.log(decodedToken)
        next()
      }
    })
  } else {
    res.redirect('/login')
  }

}

export const checkUser = (req,res,next) =>{
    const token = req.cookies.jwt

    if(token){
      jwt.verify(token, 'dhruvsecret', async (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.locals.user = null

        next();
      } else {
        console.log(decodedToken)
        let user = await User.findById(decodedToken.id);
        let books = await Book.getUserBooks(decodedToken.id)
        res.locals.user = user
        if(books){
          res.locals.books = books
        }
        else{
          res.locals.books = []
        }
        next()
      }
    })
    }else{        
        res.locals.user = null
        next()
    }

}

