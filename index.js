const express = require('express');
const app = express();
const cafes = require("./cafes.json");

app.listen(3000, console.log("SERVER ON en puerto 3000")); //o PORT 4000

app.use(express.json());

app.get("/cafes", (req, res) => {
  res.status(200).send(cafes);
});

app.post("/cafes", (req, res) => {
  const cafe = req.body;
  const { id } = cafe;
  if (cafes.some(c => c.id == id)) {
    res.status(400).send({ message: "Ya existe un cafe con ese id" });
  } else {
    cafes.push(cafe);
    res.status(201).send(cafes);
  }
});

app.put("/cafes/:id", (req, res) => {
  const cafe = req.body;
  const { id } = req.params;
  if (id != cafe.id) {
    return res.status(400).send({ message: "El id del parámetro no coincide con el id del café recibido" });
  }

  const index = cafes.findIndex(c => c.id == id);
  if (index >= 0) {
    cafes[index] = cafe;
    res.send(cafes);
  } else {
    res.status(404).send({ message: "No se encontró ningún café con ese id" });
  }
});

app.delete("/cafes/:id", (req, res) => {
  const jwt = req.header("Authorization");
  const { id } = req.params;

  if (jwt) {
    const index = cafes.findIndex(c => c.id == id);
    if (index >= 0) {
      cafes.splice(index, 1);
      res.send(cafes);
    } else {
      res.status(404).send({ message: "No se encontró ningún cafe con ese id" });
    }
  } else {
    res.status(400).send({ message: "No recibió ningún token en las cabeceras" });
  }
});

module.exports = app;
