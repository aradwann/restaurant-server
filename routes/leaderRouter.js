const express = require('express')
const Leader = require('../models/leader.js')
const leaderRouter = express.Router()
const authenticate = require('../authenticate')
const cors = require('./cors')

leaderRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.cors, (req, res, next) => {
    Leader.find({})
      .then((leaders) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leaders)
      })
      .catch((err) => {
        next(err)
      })
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leader.create(req.body)
        .then((leader) => {
          console.log('Leader created', leader)
          res.statusCode = 201
          res.setHeader('Content-Type', 'application/json')
          res.json(leader)
        })
        .catch((err) => {
          next(err)
        })
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403
      res.end('PUT operation not supported on /Leaders')
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leader.deleteMany({})
        .then((resp) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(resp)
        })
        .catch((err) => {
          next(err)
        })
    }
  )

leaderRouter
  .route('/:leaderId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.cors, (req, res, next) => {
    Leader.findById(req.params.leaderId)
      .then((leader) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
      })
      .catch((err) => {
        next(err)
      })
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403
      res.end('POST operation not supported on /leader/' + req.params.leaderId)
    }
  )

  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leader.findByIdAndUpdate(
        req.params.leaderId,
        { $set: req.body },
        { new: true }
      )
        .then((leader) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(leader)
        })
        .catch((err) => {
          next(err)
        })
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leader.findByIdAndDelete(req.params.leaderId)
        .then((resp) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(resp)
        })
        .catch((err) => {
          next(err)
        })
    }
  )
module.exports = leaderRouter
