const express = require('express')

const router = express.Router()
const axios = require('axios')


router.post('/signin', async (req, res) => {

    try {
        const email = req.body.email
        const password = req.body.password

        const response = await axios.post('http://localhost:20242/api/auth/signin', {
            email,
            password
        });

        req.session.token = response.data.token

        res.json(req.session.token);
    } catch (error) {

        if (error.response) {
            res.status(error.response.status).json({ message: error.response.data.message });
        } else {
            console.log(error)
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la connexion.' });
        }
    }

})

router.post('/signout', async (req, res) => {

    try {
        await axios.post('http://localhost:20242/api/auth/signout');
        req.session.destroy(err => {
            if (err) {
                console.error('Erreur lors de la destruction de la session :', err);
                return res.status(500).json({ error: 'Erreur lors de la destruction de la session' });
            } else {
                return res.status(201).json({ message: "Session détruite avec succès" })
            }
        });
    } catch (error) {
        console.log(error)
    }
})


module.exports = router