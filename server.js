const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET request for notes
app.get('/api/notes', (req, res) => {
  //Send a message to the client
  res.status(200).json(`${req.method} request received to get notes`);

  //Log request to the terminal
  console.info(`${req.method} request received to get notes`);
});

//POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  //Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  //If all the required properties are present
  if (title && text) {
    //Variable for the object to be saved
    const newNote = {
      title,
      text,
    };

    //Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        //Convert into JSON object
        const parsedNotes = JSON.parse(data);

        //Add a new note
        parsedNotes.push(newNote);

        //Write updated note back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated note!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

