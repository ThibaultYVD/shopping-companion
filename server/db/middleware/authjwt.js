const jwt = require("jsonwebtoken");

const db = require("../model/Models");
const User = db.User;

verifyToken = (req, res, next) => {
    try {
        if (req.session.token) {
            token = req.session.token;
        } else if (req.headers.authorization) {
            token = req.headers.authorization;

            if (!token.startsWith('Bearer ')) return res.status(403).send({ message: "Format de token invalide." });
            
            token = token.slice(7, token.length);
            req.session.token = token;
        } else {
            return res.status(403).send({ message: "Aucun token n'a été fourni." });
        }

        console.log(token)

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(401).send({
                    message: "Vous n'avez pas d'autorisation.",
                });
            }

            req.userId = decoded.id;
            next();
        });
    } catch (error) {
        console.error("Erreur dans la validation du token:", error);
        return res.status(500).send({
            message: "Erreur dans la validation du token.",
        });
    }
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
        console.log(error)
        return res.status(500).send({
            message: "Erreur dans la validation du rôle utilisateur.",
        });
    }
};



const authJwt = {
    verifyToken,
    isAdmin
};
module.exports = authJwt;
