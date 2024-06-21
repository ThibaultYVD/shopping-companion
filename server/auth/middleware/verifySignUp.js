const db = require("../model/Models");
const ROLES = db.ROLES;
const User = db.User;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        // Email
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (user) {
            return res.status(400).send({
                message: "L'addresse mail est déjà utilisée."
            });
        }

        next();
    } catch (error) {
        return res.status(500).send({
            message: "Erreur dans la validation de l'utilisateur"
        });
    }
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Ce rôle n'existe pas: " + req.body.roles[i]
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;
