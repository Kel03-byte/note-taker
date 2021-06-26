// varibables declaring Express, File System, Port, Id and the path
const express = require('express');
const fs = require('fs');
const app = express()
const port = process.env.PORT || 8000
const path = require('path')
const id = require('nanoid');

// Middleware functions that parse the response into json and serve
// static (all ready built) files
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('./public'))

// Function to send the "notes.html" file when the request is made to the server (through a click event)
app.get('/notes', (request, response) => response.sendFile(path.join(__dirname, './public/notes.html')));

// Function that gets the "db.json" file
app.get('/api/notes', (request, response) => response.sendFile(path.join(__dirname, './db/db.json')));

// Function that writes a newly created Note to an Array
app.post('/api/notes', (request, response) => {
    let newnote = request.body
    request.body.id = id.nanoid(10);

    fs.readFile(path.join(__dirname, './db/db.json'), (error, response) => {
        if (error) throw error
        let noteArray = JSON.parse(response)
        noteArray.push(newnote);

        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(noteArray), (error) => {
            if (error) throw error
        })
    })
    response.end()
})

// Function to delete the saved note from the Array
app.delete('/api/notes/:id', (request, response) => {
    const deleteNote = request.params.id;

    fs.readFile('./db/db.json', (error, response) => {
        if (error) throw error
        let noteArray = JSON.parse(response)
        const newNoteArray = noteArray.filter((note) => note.id !== deleteNote)

        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNoteArray), (error) => {
            if (error) throw error
        })
    })
    response.end()
})

// Function to send the "index.html" file when the request is made to the server
app.get('/', (request, response) => response.sendFile(path.join(__dirname, './public/index.html')));

// Lets us know that the server is repsonding and what port number it is repsonding on
app.listen(port, () => console.log(`I'm listening on port ${port}!`));