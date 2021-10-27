const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/pod-hw' // change this as needed

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

const Schema = mongoose.Schema;
const favoriteSchema = new Schema({
  url: String,
  date: String
})

const favoritePODS = mongoose.model("FavoritePODS", favoriteSchema);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;

var router = express.Router();

let date = new Date();
date.setDate(date.getDate() + 1);
let month = ['01', '02', '03', '04', '05', '06', '07','08', '09', '10', '11', '12'];
let day = ['00', '01', '02', '03', '04', '05', '06', '07','08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];


// The method of the root url. Be friendly and welcome our user :)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the APOD app.' });   
});

function getNextImage(req, res) {
  date.setDate(date.getDate() - 1);
  let link = `https://api.nasa.gov/planetary/apod?api_key=9Eh2D6BZUGOMQCMbLTDqC3hq7iFlMjnwpAFcL9l4&date=${date.getFullYear()}-${month[date.getMonth()]}-${day[date.getDate()]}`;
  axios.get(link).then(response => {
    if (response.data.media_type === "image") {
      res.send(response.data.url);  
    } else {
      getNextImage(req, res);
    }
  }).catch(error => {
    res.send(error);
  })
}
router.get('/pod/image', (req, res) => {
  getNextImage(req,res);
});

router.get('/pod/date', (req, res) => {
  let link = `https://api.nasa.gov/planetary/apod?api_key=9Eh2D6BZUGOMQCMbLTDqC3hq7iFlMjnwpAFcL9l4&date=${date.getFullYear()}-${month[date.getMonth()]}-${day[date.getDate()]}`;
  axios.get(link).then(response => {
    res.send(response.data.date);  
  }).catch(error => {
    res.send(error);
  })
});

router.get('/pod/description', (req, res) => {
  let link = `https://api.nasa.gov/planetary/apod?api_key=9Eh2D6BZUGOMQCMbLTDqC3hq7iFlMjnwpAFcL9l4&date=${date.getFullYear()}-${month[date.getMonth()]}-${day[date.getDate()]}`;
  axios.get(link).then(response => {
    res.send(response.data.explanation);  
  }).catch(error => {
    res.send(error);
  })
});

router.get('/pod/title', (req, res) => {
  let link = `https://api.nasa.gov/planetary/apod?api_key=9Eh2D6BZUGOMQCMbLTDqC3hq7iFlMjnwpAFcL9l4&date=${date.getFullYear()}-${month[date.getMonth()]}-${day[date.getDate()]}`;
  axios.get(link).then(response => {
    res.send(response.data.title);  
  }).catch(error => {
    res.send(error);
  })
});

router.put('/pod/updatefavorite', async function (req, res) {
   let exists = await favoritePODS.exists({date: req.body.date});
   if (exists) {
     favoritePODS.findOneAndDelete({date: req.body.date}, (error, document) => {
       if (error) {
         res.json({status: "failure to delete"});
       } else {
         res.json({status: "successfully removed from favorites",
                   doc: document
        })
       }
     })
   } else {
     let favorite = new favoritePODS({
       url: req.body.url,
       date: req.body.date
     });
     favorite.save((error, document) => {
       if (error) {
         res.json({
           status: "failure to add to favorites",
           doc: document
          });
       } else {
         res.json({
           status: "successfully added to favorites",
           doc: document
         });
       }
     })
   }
  
})

router.get('/pod/favorites', (req, res) => {
  favoritePODS.find().then((pods) => {
    res.json({
      status: "successfully retreived all favorites",
      pods: pods
    })
  })
});

router.get
app.use('/api', router); // API Root url at: http://localhost:8080/api


app.listen(port);
console.log('Server listenning on port ' + port);