import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token


    console.log(req.headers, 'request .headers')
    console.log(req.headers.authorization, 'request .headers.authorization')
    //req.headers.authorization holds or storer the bearer token value 
    // router.route('/:id/reviews').post(protect, createProductReview)
    // ask chinedu or abiola how does this in router file connects with the req.header.authorization
    //protect middle ware does executes first then the controller function , so where does the req.headers.authorizatoin comes
    // and how generate token comes in the picture 
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //how did req.user get in the picture? does it mean all req object has property called user ?
            req.user = await User.findById(decoded.id).select('-password')

            next()


        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }

})

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}
export { protect, admin }