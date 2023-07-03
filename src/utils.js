import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import passport from 'passport'

dotenv.config()

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = user => {
    return jwt.sign({user}, process.env.PRIVATE_KEY, {expiresIn: '24h'})
}

export const extractCookie = req => {
    returt (req && req.cookies) ? req.cookies [JWT_COOKIE_NAME] : null
}

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render('errors/base', {error: info.mensagges ? info.mensagges : info.toString()})
            req.user = user
            next()
        })(req, res, next)
    }
}
