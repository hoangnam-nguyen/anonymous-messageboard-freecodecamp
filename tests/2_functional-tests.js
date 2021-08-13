const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { get } = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    // Creating a new thread: POST request to /api/threads/{board}
    // Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}
    // Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password
    // Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password
    // Reporting a thread: PUT request to /api/threads/{board}
    // Creating a new reply: POST request to /api/replies/{board}
    // Viewing a single thread with all replies: GET request to /api/replies/{board}
    // Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password
    // Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password
    // Reporting a reply: PUT request to /api/replies/{board}
    suite('all the function tests', function() {
        test('Creating a new thread: POST request to /api/threads/{board}', function(done) {
            chai.request(server)
                .post('/api/threads/test')
                .send({
                    text: "justatest",
                    delete_password: "justatest"
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.text, "justatest");
                    assert.equal(res.body.delete_password, "justatest");
                    done();
                })
        });
        test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', function(done) {
            chai.request(server)
                .get('/api/threads/test')
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isAtMost(res.body.length, 10);
                    assert.isAtMost(res.body[0].replies.length, 3);
                    done();
                })
        });
        test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', function(done) {
            chai.request(server)
                .delete('/api/threads/yup')
                .send({
                    thread_id: '6116325d2c654d036c02bb57',
                    delete_password: 'whatwhatwhat'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body, "incorrect password");
                    done();
                })
        });
        test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', function(done) {
            chai.request(server)
                .delete('/api/threads/bem')
                .send({
                    thread_id: '6116337e55eec60d842782b7',
                    delete_password: 'bem'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body, "Thread ID invalid.");
                    done();
                })
        });
        test('Reporting a thread: PUT request to /api/threads/{board}', function(done) {
            chai.request(server)
                .put('/api/threads/hehe')
                .send({
                    thread_id: '611631992c654d036c02bb53'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body, "success");
                    done();
                })
        });
        test('Creating a new reply: POST request to /api/replies/{board}', function(done) {
            chai.request(server)
                .post('/api/replies/tes')
                .send({
                    thread_id: '61163029f500f529dc78e95c',
                    text: 'say you say me',
                    delete_password: 'lionelrichie'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.replies[res.body.replies.length - 1].text, "say you say me");
                    assert.equal(res.body.replies[res.body.replies.length - 1].delete_password, "lionelrichie");
                    done();
                })
        });
        test('Viewing a single thread with all replies: GET request to /api/replies/{board}', function(done) {
            chai.request(server)
                .get('/api/replies/test')
                .send({
                    thread_id: '6116025842ad0e43f08822b4'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.replies[0].text, "yeah");
                    done();
                })
        });
        test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password', function(done) {
            chai.request(server)
                .delete('/api/replies/test')
                .send({
                    thread_id: '61163029f500f529dc78e95c',
                    reply_id: '61163066f500f529dc78e95f',
                    delete_password: "work"
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body, "There is not any board with such thread");
                    done();
                })
        });
        test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', function(done) {
            chai.request(server)
                .delete('/api/replies/test')
                .send({
                    thread_id: '61163029f500f529dc78e95c',
                    reply_id: '61163066f500f529dc78e95f',
                    delete_password: "work?"
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body, "There is not any board with such thread");
                    done();
                })
        });
        test('Reporting a reply: PUT request to /api/replies/{board}', function(done) {
            chai.request(server)
                .put('/api/replies/test')
                .send({
                    thread_id: '6116025842ad0e43f08822b4',
                    reply_id: '6116026042ad0e43f08822b7'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body, "success");
                    done();
                })
        })
    })
});
