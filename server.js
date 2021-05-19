// varibables declaring Express, File System, Port, Id and the path
const express = require('express');
const fs = require('fs');
const app = express()
const port = process.env.PORT || 8000
const path = require('path')
const id = require('nanoid');

// Middleware functions that parse the response into json and serve
// static (all ready built) files
app.use(express.json());
app.use(express.static('./public'))

// Function to send the "index.html" file when the request is made to the server
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

// Function to send the "notes.html" file when the request is made to the server (through a click event)
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// Function that gets the "db.json" file
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));

// Function that sends the newly created note to the sever body with an unique id
app.post('/api/notes', (req, res) => {
    newnote = req.body;
    req.body.id = id.nanoid(10);
    console.log(newnote)

    // Function to get the "db.json" file and saves the new note to the array in the file
    fs.readFile('./db/db.json', (error, data) => {
        if (error) throw error;
        let noteArray = JSON.parse(data)
        noteArray.push(newnote)

        
        fs.writeFile(
            "./db/db.json",
            JSON.stringify(noteArray),
            function (error) {
                if (error) throw error;
                console.log("The Note was saved!");
            }
        )
    })
})

// Function to delete the saved note from the Array
app.delete('/api/notes/:id', (req, res) => {
    const deleteNote = req.params.id

    fs.readFile('./db/db.json', (error, data) => {
        if (error) throw error;
        let noteArray = JSON.parse(data)
        const newNoteArray = noteArray.filter((note) => note.id !== deleteNote)

        fs.writeFile("./db/db.json",
            JSON.stringify(newNoteArray),
            function (error) {
                if (error) throw error;
                console.log("The Note was deleted!")
            })

    })
})

// Lets us know that the server is repsonding and what port number it is repsonding on
app.listen(port, () => console.log(`I'm listening on port ${port}!`));