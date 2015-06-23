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
  // To query by mongo ids, the id needs to be converted from a string to a mongo id.
  // That's what line 26 is doing.
  if(req.query._id){
    req.query._id = mongojs.ObjectId(req.query._id);
  }
  db.sightings.find(req.query, function(err, response){
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
