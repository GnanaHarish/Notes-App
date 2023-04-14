const Notes = require('../models/Notes');
const Note = require('../models/Notes');
const mongoose = require('mongoose');

exports.homepage = async (req, res) => {

    const perPage = 12;
    const page = req.query.page || 1;
    const locals = {
        title: "Dasboard",
        description: "A Perfect Notes App"
    }


    try {

        Note.aggregate([
            {
                $sort: {
                    updatedAt: -1,
                }
            },
            {
                $match: { user: new mongoose.Types.ObjectId(req.user.id) },

            },
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] },
                }
            }
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec().then((notes) => {
                Note.count().exec().then((count, er) => {
                    if (er) console.log(er);
                    res.render('dashboard/index', {
                        userName: req.user.firstName,
                        locals,
                        notes,
                        layout: '../views/layouts/dashboard',
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })

    } catch (error) {
        console.log(error);
    }

}


//Get Specific Note

exports.homepageViewNote = async (req, res) => {
    const note = await Note.findById({ _id: req.params.id })
        .where({ user: req.user.id })
        .lean();
    if (note) {
        res.render('dashboard/view-notes', {
            noteId: req.params.id,
            note,
            layout: '../views/layouts/dashboard'
        }
        )
    }
    else {
        res.render('/404');
    }
}


//Post - Update sepcific Note
exports.homepageUpdateNote = async (req, res) => {
    //console.log(req.params.id);
    try {
        const id = req.params.id;
        await Note.findByIdAndUpdate(id, { title: req.body.title, body: req.body.body, updatedAt: Date.now() }).where({ user: req.user.id });
        res.redirect('/dashboard');

    } catch (err) {
        res.render('/404');
    }
}

//Delete - Delete a Note
exports.homepageDeleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete({
            _id: req.params.id
        })
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}


//Get Add Notes
exports.dashboardAddNote = async (req, res) => {
    res.render('dashboard/add', {
        layout: '../views/layouts/dashboard'
    })
}

//Create a Note - POST
exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Note.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}


//search - GET
exports.homepageSearch = async (req, res) => {
    try {
        res.render('dashboard/search', {
            searchResult: '',
            layout: '../views/layouts/dashboard'
        })
    } catch (error) {
        console.log(error);
    }
}

//Search - POST
exports.homepageSearchSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let goodStr = searchTerm.replace(/[^\w\s]/gi, '');
        const searchResult = await Note.find({
            $or: [
                { title: { $regex: new RegExp(goodStr, 'i') } },
                { body: { $regex: new RegExp(goodStr, 'i') } }
            ]
        }).where({ user: req.user.id });
        res.render('dashboard/search', {
            searchResult,
            layout: '../views/layouts/dashboard'
        })
    } catch (error) {
        console.log(error);
    }
}