const db = require("../model");

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
        });

        const result = user.setRoles([1])
        if (result) res.send({ message: "User registered successfully!" });

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

        const passwordIsValid = bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Mot de passe invalide",
            });
        }


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
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).json({
            message: "Vous avez été déconnecté."
        });
    } catch (err) {
        this.next(err);
    }
};
