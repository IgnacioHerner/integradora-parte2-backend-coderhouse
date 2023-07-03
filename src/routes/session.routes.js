import { Router } from 'express'
import passport from 'passport'

const router = Router()

// ? Vista para registrar usuarios
router.get('/register', async(req, res) => {
    res.render('sessions/register')
})

// ? Api para crear usuarios en la DB
router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failregister' }), async (req, res) => {
    res.redirect('/session/login')
})

router.get('/failregister', (req, res) => {
    console.log('Fail Strategy')
    res.send({error: "Failed"})
})

// ? Vista de login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

// ? API para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/faillogin' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentiales" })
    }
    // req.session.user = {
    //     first_name: req.user.first_name,
    //     last_name: req.user.last_name,
    //     email: req.user.email,
    //     age: req.user.age,
    // }

    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
})

router.get('/faillogin', (req, res) => {
    res.send({error: "Fail Login"})
})

// ? Cerrar Session
router.get('/logout', (req, res) => {
    // req.session.destroy(err => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).render('errors/base', { error: err })
    //     } else res.redirect('/session/login')
    // })
    res.clearCookie(JWT_COOKIE_NAME).redirect('/session/login')
})


export default router