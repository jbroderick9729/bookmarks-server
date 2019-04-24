const express = require('express')
const bookmarksRouter = express.Router()
const logger = require('../logger')
const bodyParser = express.json();
const uuid = require('uuid/v4')
const {bookmarks} = require('../data')

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res
            .status(200)
            .json(bookmarks);
})
    .post(bodyParser, (req, res) => {
        const { title, url, description, rating } = req.body


        if (!title) {
            logger.error(`Title is required`);
            return res
            .status(400)
            .send('Invalid data');
        }
        
        if (!url) {
            logger.error(`Content is required`);
            return res
            .status(400)
            .send('Invalid data');
        }
        if (!description) {
            logger.error(`Title is required`);
            return res
            .status(400)
            .send('Invalid data');
        }
        
        if (!rating) {
            logger.error(`Rating is required`);
            return res
            .status(400)
            .send('Invalid data');
        }

        const id = uuid()

        const newBookmark = {
            id,
            title,
            url,
            description,
            rating
        }

        bookmarks.push(newBookmark);

        logger.info(`Bookmark with id ${id} created`);
            res
                .status(201)
                .location(`http://localhost:8000/bookmarks/${id}`)
                .json(bookmarks);
    })


bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params
        const bookmark = bookmarks.find(bookmark => {
            bookmark.id == id
        })

    if (!bookmark) {
        logger.error(`Bookmark ${id} not found!`)
        return res
            .status(404)
            .send('Not found')
    }
    res
        .status(200)
        .json(bookmark);
})
.delete((req, res) => {
    const { id } = req.params
    const bookmark = bookmarks.findIndex(bookmark => {
        bookmark.id == id})

    if(!bookmark) {
        logger.error(`Bookmark of ${id} not found`)
        return res
            .status(404)
            .send('Bookmark not found')
    }
    bookmarks.splice(bookmark, 1);
    logger.info(`Bookmark deleted!`)
    res
        .status(204)
        .end();

})

module.exports = bookmarksRouter