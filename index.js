const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(morgan("tiny")); //Using a preset format from morgan documentation

app.use(
  //This utilized the data token defined earlier in the page which returns us the request body.
  morgan(
    function (tokens, req, res) {
      return [tokens.data(req, res)];
    },
    {
      skip: function (req, res) {
        return req.method != "POST"; //we are using the skip option to only display body of post requests.
      },
    }
  )
);

app.get("/api/persons/", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people. </br> ${new Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const person = persons.filter(
    (person) => person.id === parseInt(request.params.id)
  );

  if (person.length === 0)
    return response.status(400).json({
      error: `No person with id ${request.params.id} found`,
    });

  response.json(person);
});

app.post("/api/persons", (request, response) => {
  const newPerson = request.body;

  if (newPerson.name && newPerson.number) {
    if (persons.some((person) => person.name === newPerson.name))
      return response.status(400).json({
        error: "Name for new entry must be unique",
      });
    const id = Math.floor(Math.random() * 100);

    newPerson.id = id;

    persons = persons.concat(newPerson);
    response.json(newPerson);
  } else {
    return response.status(400).json({
      error: "Name/number missing fron entry. Please try again!",
    });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
