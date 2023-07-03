import passport from "passport";
import local, {Strategy} from 'passport-local';
import userModel from "../dao/models/users.model.js";
import passport_jwt, {ExtractJwt} from 'passport-jwt';
import { createHash, isValidPassword, generateToken, extractCookie } from '../utils.js'
import dotenv from 'dotenv'

dotenv.config()

const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {

        const {first_name, last_name, email, age} = req.body
        try{
            const user = await userModel.findOne({email: username})
            if(user) {
                console.log("User already exits")
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password : createHash(password)
            }
            const result = await userModel.create(newUser)

            return done(null, result)
        } catch (err){
            return done('[LOCAL], Error al obtener user' + err)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await userModel.findOne({email: username})
            if(!user) {
                console.log("User dont exits")
                return done(null, user)
            }

            if(!isValidPassword(user, password)) return done(null, false)

            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch {
            return done("[LOCAL] Error al logearse user " + error)
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: process.env.JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport;