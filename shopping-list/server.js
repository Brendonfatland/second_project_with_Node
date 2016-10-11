var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  delete: function(id){
    var index = this.items.indexOf(id);
    this.items.splice(index, 1);
    return this.items;
  },
  put: function(id, name){
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id == id) {
        this.items[i].name = name;
        return this.items[i];
      }
     }
    }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();



var app = express();
app.use(express.static('public'));

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
  var deleted = storage.delete(req.params.id);
  if (deleted) {
    res.status(201).json(deleted);
  } else {
    res.status(400).json({"error": "no item found"});
  }
});

app.put('/items/:id', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  var item = storage.put(req.params.id, req.body.name);
  res.status(201).json(item);
});

app.get('/items', function(request, response) {
    response.json(storage.items);
});


app.listen(process.env.PORT || 8080, process.env.IP);
