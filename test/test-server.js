var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
  it('should list items on GET', function(done) {
      chai.request(app)
          .get('/items')
          .end(function(err, res) {
              should.equal(err, null);
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.should.have.lengthOf(0);
              res.body[0].should.be.a('object');
              res.body[0].should.have.property('id');
              res.body[0].should.have.property('name');
              res.body[0].id.should.be.a('number');
              res.body[0].name.should.be.a('string');

              done();
          });
  });

    it('should add an item on post', function() {
      chai.request(app) // only works in node.js with express.
      .post('/items')
      .send({'name': 'Chips'})
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.length.within(0,10);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        storage.items.should.be.a('array');
        storage.items.should.have.length(0);
        storage.items[1].should.be.a('object');
        storage.items[1].should.have.property('id');
        storage.items[1].should.have.property('name');
        storage.items[1].id.should.be.a('number');
        storage.items[1].name.should.be.a('string');
        storage.items[1].name.should.equal('Chips');
        done();
      });
    });
    it('should edit an item on put', function(done) {
    chai.request(app)
      .put('/items/1')
      .send({'name': 'Lipstick', id: "1"})
      .end(function(err, res) {
        should.equal(err, null);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('id');
        res.body.name.should.be.a('string');
        res.body.id.should.be.a('number');
        res.body.name.should.equal('Lipstick');
        storage.items.should.be.a('array');
        storage.items.should.have.length(4);
        storage.items[1].should.be.a('object');
        storage.items[1].should.have.property('id');
        storage.items[1].should.have.property('name');
        storage.items[1].id.should.be.a('number');
        storage.items[1].name.should.be.a('string');
        storage.items[1].name.should.equal('Lipstick');
        done();
      });
  });
  it('should delete an item on delete', function(done) {
   chai.request(app)
     .delete('/items/2')
     .end(function(err, res) {
       should.equal(err, null);
       res.should.have.status(200);
       res.should.be.json;
       res.body.should.be.a('object');
       res.body.should.have.property('name');
       res.body.should.have.property('id');
       res.body.name.should.be.a('string');
       res.body.id.should.be.a('number');
       res.body.name.should.equal('Chips');
       storage.items.should.be.a('array');
       storage.items.should.have.length(2);
       storage.items[1].name.should.equal('Lipstick');
       storage.items[2].name.should.equal('Chips');
       done();
     });
 });

exports.app = app;
exports.storage = storage;
