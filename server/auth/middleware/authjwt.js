const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../model");
const User = db.User;

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({
            message: "Aucun token n'a été fourni.",
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Vous n'avez pas d'autorisation.",
            });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = async (req, res, next) => {
    try {
        const token = req.session.token;

        if (!token) {
            return res.status(401).send({
                message: "Aucun token n'a été trouvé dans cette session.",
            });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findByPk(decodedToken.id);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].role_name === "admin") {
                return next();
            }
        }

        return res.status(403).send({
            message: "Vous n'avez pas le rôle Admin.",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Erreur dans la validation du rôle utilisateur.",
        });
    }
};

isModerator = async (req, res, next) => {
    try {
        const token = req.session.token;

        if (!token) {
            return res.status(401).send({
                message: "Aucun token n'a été trouvé dans cette session.",
            });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findByPk(decodedToken.id);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].role_name === "moderator") {
                return next();
            }
        }

        return res.status(403).send({
            message: "Vous n'avez pas le rôle Modérateur.",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Erreur dans la validation du rôle modérateur",
        });
    }
};

isModeratorOrAdmin = async (req, res, next) => {
    try {
        const token = req.session.token;

        if (!token) {
            return res.status(401).send({
                message: "Aucun token n'a été trouvé dans cette session.",
            });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findByPk(decodedToken.id);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].role_name === "moderator") {
                return next();
            }

            if (roles[i].role_name === "admin") {
                return next();
            }
        }

        return res.status(403).send({
            message: "Vous n'avez pas le rôle admin ou modérateur.",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Erreur dans la validation du rôle admin ou modérateur.",
        });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
};
module.exports = authJwt;
