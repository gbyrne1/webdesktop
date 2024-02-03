const express = require('express');
const model = require('../models/users');
const router = express.Router();

router
    .get('/',  (req, res, next) => {
        model.getAll(+req.query.page, +req.query.pageSize)
            .then(list => {
                const data = { data: list.items, total: list.total, isSuccess: true };
                res.send(data)
            }).catch(next);
    })
