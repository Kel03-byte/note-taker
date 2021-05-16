const express = require('express');
const fs = require('fs');
const app = express()
const port = process.env.PORT || 8000
const path = require('path')
const id = require('nanoid');

app.use(express.json());
app.use(express.static('./public'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));

app.post('/api/notes', (req, res) => {
    newnote = req.body;
    req.body.id = id.nanoid(10);
    console.log(newnote)

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

app.listen(port, () => console.log(`I'm listening on port ${port}!`));