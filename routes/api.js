'use strict';
const Reply = require('../data-model').Reply;
const Thread = require('../data-model').Thread;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
      .post(function(req, res) {
        let newThread = new Thread({
          board: req.params.board,
          text: req.body.text,
          delete_password: req.body.delete_password,
          created_on: new Date(),
          bumped_on: new Date()
        });
        newThread.save((err, savedThread) => {
          if (err) throw err;
        });
        res.json(newThread);
        res.redirect('/b/' + req.params.board);
      })
      .get(function(req, res) {

        Thread.find({}, (err, found) => {
          let re = new RegExp(req.params.board);
          let gotThreads = found.sort((a, b) => b.bumped_on - a.bumped_on)
                              .filter(d => re.test(d.board))
                              .slice(0, 10)
                              .map(d => {
                                return {
                                  _id: d._id,
                                  text: d.text,
                                  created_on: d.created_on,
                                  bumped_on: d.bumped_on,
                                  replies: d.replies.length > 3 ? d.replies.slice(-3) : d.replies
                                };
                              })
          res.json(gotThreads);
        })
      })
      .delete(function(req, res) {
        let re = new RegExp(req.params.board);
        Thread.findById(req.body.thread_id, (err, found) => {
          if (err) throw err;
          if (!found) {
            res.json("Thread ID invalid.");
          } else if (!re.test(found.board)) {
            res.json("There is not any board with such thread.")
          } else if (found.delete_password == req.body.delete_password) {
            found.remove();
            res.json("success");
          } else {
            res.json("incorrect password");
          }
        })
      })
      .put(function(req, res) {
        Thread.findById(req.body.thread_id, (err, found) => {
          if (err) throw err;
          if (!found) {
            res.json("Thread ID invalid");
          } else {
            found.reported = true;
            found.save();
            res.json("success");
          }
        })
      })

    
  app.route('/api/replies/:board')
      .post(function(req, res) {
        let re = new RegExp(req.params.board);
        let newReply = new Reply({
          text: req.body.text,
          created_on: new Date(),
          delete_password: req.body.delete_password
        });
        Thread.findById(req.body.thread_id, (err, found) => {
          if (err) throw err;
          if (!found) {
            res.json("Thread ID invalid.");
          } else if (!re.test(found.board)) {
            res.json("There is not any board with such thread.")
          } else {
            found.replies.push(newReply);
            found.bumped_on = new Date();
            found.save((err, newThread) => {
              if (err) throw err;
            });
            res.json(found);
          }   
        })
      })
      .get(function(req, res) {
        let re = new RegExp(req.params.board);
        Thread.findById(req.body.thread_id, function(err, found) {
          if (err) throw err;
          if (!found) {
            res.json("Thread ID not valid.");
          } else if (!re.test(found.board)) {
            res.json("There is not any board with such thread.")
          } else {
            res.json({
              _id: found._id,
              text: found.text,
              created_on: found.created_on,
              bumped_on: found.bumped_on,
              replies: found.replies
            });
          }
        })
      })
      .delete(function(req, res) {
        let re = new RegExp(req.params.board);
        Thread.findById(req.body.thread_id, function(err, found) {
          if (err) throw err;
          if (!found) {
            res.json("Thread ID invalid");
          } else if (!re.test(found.board)) {
            res.json("There is not any board with such thread");
          } else {
            let foundReply = found.replies.id(reply_id);
            if (foundReply.delete_password == req.body.delete_password) {
              foundReply.text = "[deleted]";
              foundReply.save();
              res.json("success");
            } else {
              res.json("incorrect password");
            }
          }
        })
      })
      .put(function(req, res) {
        Thread.findById(req.body.thread_id, function(err, found) {
          if (err) throw err;
          if (!found) {
            res.json("Thread ID invalid");
          } else {
            let foundReply = found.replies.id(req.body.reply_id);
            if (!foundReply) {
              res.json("Reply ID invalid");
            } else {
              foundReply.reported = true;
              foundReply.save();
              res.json("success");
            }
          }
        })
      })


};
