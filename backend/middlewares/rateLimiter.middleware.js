const rateLimit = require("express-rate-limit");

const limitadorLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: "Demasiados intentos de login. Intenta nuevamente más tarde."
    }
});

module.exports = limitadorLogin;