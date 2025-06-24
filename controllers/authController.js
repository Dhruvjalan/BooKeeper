import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const maxAge = 3 * 24 * 60 * 60

const handleErrors = (err) => {
    console.log("authcontroller line8: ", err.message, err.code)
    let error = { email: '', password: '' }

    if(err.message==="Incorrect Password"){
        error['password'] = err.message;
    }

    if(err.message === "Looks like this email is not signed up with us. Sign in Now"){
        error['email']= err.message;
    }
    if (err.code === 11000) {
        error.email = 'Seems like this email is already signed-up. Try with another email or login'
        return error
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message
        })
    }
    return error
}

const createToken = (id) => {
    return jwt.sign({ id }, 'dhruvsecret', { expiresIn: maxAge })
}

export function signup_get(req, res) {
    res.render('signup')
}

export function login_get(req, res) {
    res.render('login')
}

export function logout_get(req,res){
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/')
}

export async function signup_post(req, res) {
    const { email, password } = req.body
    try {
        const user = await User.create({ email, password, TotalBooks: [], CompletedBooks: [] })
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * maxAge })
        res.status(201).json({ user: user._id })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json(errors)
    }
}

export async function login_post(req, res) {
    const { email, password } = req.body
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * maxAge })
        res.status(201).json({ user: user._id })

    }
    catch(err){
        const errors = handleErrors(err)
        
        res.status(400).json(errors)
    }
}



