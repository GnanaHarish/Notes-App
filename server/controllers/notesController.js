//GET - Homepage
exports.homepage = async (req, res) => {
    const locals = {
        title: 'Notes App',
        description: 'A Perfect Notes App'
    };

    res.render('index', {
        locals,
        layout: "../views/layouts/front-page"
    });

}

//GET - About
exports.about = async (req, res) => {
    const locals = {
        title: 'About Me',
        description: 'Not so much'
    };

    res.render('about', locals);

}