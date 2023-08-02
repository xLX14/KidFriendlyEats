const User = require('../model/user');


module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ username, email })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, function (err) {
            if (err) { return next(err); }

            req.flash("success", "Welcome To KidFriendlyRestaurants!")
            res.redirect('/restaurants')
        });
    }
    catch {
        req.flash("error", "A user with the given username is already registered")
        res.redirect("/register")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', `welcome back!`)
    const redirectUrl = res.locals.returnTo || '/restaurants';
    delete req.session.returnTo
    res.redirect(redirectUrl)
}


module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/restaurants');
    });
}