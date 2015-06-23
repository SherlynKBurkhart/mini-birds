var express = require('express'),
  app = express(),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  mongojs = require('mongojs'),
  port = 9007,
  db = mongojs('birds', ['sightings']);

app.use(bodyParser.json());
app.use(cors());

app.post('/api/sightings', function(req, res){
  db.sightings.save(req.body, function(err, response){
    if(err){
      res.status(500).json(err);
    } else {
      res.json(response)
    }
  })
})

app.get('/api/sightings',function(req, res){
  var query = {};
  for(var key in req.query){
    query[key] = req.query[key];
  };
  db.sightings.find(query, function(err, response){
    if(err){
      res.status(500).json(err);
    } else {
      res.json(response);
    }
  })
})

app.put('/api/sightings', function(req, res){
  if(!req.query.id){
    res.status(500).send('hey. you need to send an id, ya big dumb');
  } else {
    db.sightings.findAndModify({
      query: {
        _id: mongojs.ObjectId(req.query.id)
      },
      update: {
        $set: req.body
      }
    }, function(err, response){
      if(err){
        res.status(500).json(err);
      } else {
        res.json(response);
      }
    })
  }
});

app.delete('/api/sightings', function(req, res){
  if(!req.query.id){
    res.status(500).send('hey. you need to send an id, ya big dumb');
  } else {
    db.sightings.remove({
      _id: mongojs.ObjectId(req.query.id)
    }, function(err, response){
      if(err){
        res.status(500).json(err)
      } else {
        res.json(response);
      }
    })
  }
});

app.listen(port, function(){
  console.log('listening at port: ', port);
})
