import { Router } from 'express'
import * as appController from '../controllers/appController.js'


const approuter = Router()

approuter.post('/add-book', appController.add_book_post)


export default approuter