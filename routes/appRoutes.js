import { Router } from 'express'
import * as appController from '../controllers/appController.js'


const approuter = Router()

approuter.post('/add-book', appController.add_book_post)
approuter.delete('/delete/:userId/:bookId',appController.delete_book)
approuter.patch('/edit-book/:bookId',appController.update_book)

export default approuter