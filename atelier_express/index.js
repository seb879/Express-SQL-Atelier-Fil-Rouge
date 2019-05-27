/* eslint-disable import/newline-after-import */
import express from 'express';
const app = express();
const port = 3000;
const connection = require('./conf');

const bodyParser = require('body-parser');
// Support JSON-encoded bodies
app.use(bodyParser.json());
// Support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

// GET - Récupération de l'ensemble des données de la table movie //

app.get('/api/movies', (req, res) => {
  connection.query('SELECT * FROM movie', (err, results) => {
      if (err) {
          res.status(500).send('An error occured whilst trying to obtain your movies');
      } else {
          res.json(results);
      }
  });
});

// Start ==>  GET (light) - Récupération de quelques champs spécifiques 

app.get('/api/movies/name', (req, res) => {
  connection.query('SELECT name, date, FROM movie', name, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des noms des films');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/movies/:name', (req, res) => {
  const name = req.params.name;
  connection.query('SELECT * FROM movie WHERE name=?', name, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des noms des films');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/movies/name/:name', (req, res) => {
  connection.query(`SELECT * FROM movie WHERE name LIKE '${req.params.name}%'`, (err, result) => {
    if (err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  });
});

app.get('/api/search/:date', (req, res) => {
  connection.query('SELECT * FROM movie WHERE date > ?', req.params.date, (err, result) => {
    if (err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  });
});

app.get('/api/order', (req, res) => {
  const type = req.query.type;
  const sql = (type === 'desc') ?
    'SELECT * FROM movie ORDER BY age DESC' :
    'SELECT * FROM movie ORDER BY age ASC';
  connection.query(sql, (err, result) => {
    if (err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  });
});

//post
app.post('/api/movies/movie', (req, res) => {
  const formData = req.body;

  connection.query('INSERT INTO movie SET ?', formData, (err, result) => {
    if (err) {
      console.log('Erreur : ', err);
      res.status(500).send('Erreur lors de l\'ajout...');
    } else {
      res.sendStatus(200);
    }
  });
});

//put

app.put('/api/movies/movie/:id', (req, res) => {
  const formData = req.body;
  const idmovie = req.params.id;

  connection.query('UPDATE movie SET ? WHERE id=?', [formData, idmovie], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

app.put('/api/movies/movie/actif/:id', (req, res) => {
  const movieId = req.params.id;

  connection.query('UPDATE movie SET `En activité` = 1 ^ `En activité` WHERE id = ?', movieId, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Erreur lors de la modification');
    } else {
      res.sendStatus(200);
    }
  });
});

//delete
app.delete('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;

  connection.query('DELETE FROM movie WHERE id = ?', movieId, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});
app.delete('/api/movies/actif', (req, res) => {
  connection.query('DELETE FROM movie WHERE `En activité` = 0', (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

  
  app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }

    console.log(`Server is listening on ${port}`);
});