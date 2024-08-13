const db = require("../model/Models");

const User = db.User;
const Role = db.Role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {

    try {
        const user = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            created_at: new Date(),
        });

        const result = user.setRoles([1])
        if (result) res.status(200).json({ message: "Utilisateur enregistré avec succès!" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            return res.status(404).send({ message: "Utilisateur non trouvé." });
        }

        bcrypt.compare(req.body.password, user.password, async function (err, result) {
            if (err) {
                console.error('Erreur lors de la comparaison :', err);
                return;
            }
            if (result) {
                const payload = {
                    id: user.user_id
                }

                const token = jwt.sign(payload, process.env.SECRET_KEY, {
                    algorithm: 'HS256',
                    expiresIn: '30m'
                });


                let authorities = [];
                const roles = await user.getRoles();
                for (let i = 0; i < roles.length; i++) {
                    authorities.push(roles[i].role_name);
                }

                req.session.token = token;

                return res.status(200).send({
                    id: user.id,
                    email: user.email,
                    roles: authorities,
                    token: token
                });
            } else {
                res.status(403).json({ message: "Mot de passe invalide" });
            }
        });



    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.signout = async (req, res) => {
    try {

        if (!req.session || !req.session.token) return res.status(200).json({ message: "Vous n'êtes pas connecté." }); 

        req.session.destroy((err) => {
            if (err) {
                console.error('Erreur lors de la destruction de la session:', err);
                return res.status(500).json({
                    message: "Erreur lors de la déconnexion."
                });
            }

            // Supprimer le cookie de session côté client
            res.clearCookie('connect.sid'); // 'connect.sid' est le nom par défaut du cookie de session

            return res.status(200).json({
                message: "Vous avez été déconnecté."
            });
        });
    } catch (err) {
        console.error('Erreur interne:', err);
        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
};