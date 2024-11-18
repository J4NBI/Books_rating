// BOOK RATING JAN BIHL v.2

import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";
// import "./styles/style.css";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

let entries;
// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// USE STATIC FOLDERS
app.use(express.static("public"));


// Home ROUTE
app.get("/", async (req, res) => {
  let docs = [];

  const response = await db.query('Select * FROM booksrated');
  entries = response.rows;
  res.render("index.ejs", {
    docs: docs,
    entries: entries
  });
});

app.get("/books_rated", (req, res) => {
  res.render("books_rated.ejs", {
    // docs: docs
  });
});


// POST ROUTE
app.post("/get", async (req, res) => {
  const searchOption = req.body.searchOption;
  let docs = [];

  if (searchOption === "title") {
    if (req.body.title) {
      const bookSearch = req.body.title;
      try {
        const response = await axios.get('https://openlibrary.org/search.json', {
          params: {
            title: bookSearch 
          }
        });
        docs = response.data.docs;
        res.render("index.ejs", {
          docs: docs,
          entries: entries
       
        });
      } catch (error) {
        console.error(error);
        res.render("index.ejs", {
          title: "Error",
        });
      }
    } else {
      res.render("index.ejs", {
        docs: docs
     
      });
    }
  } else if(searchOption === "author"){

    if (req.body.title) {
      let bookSearch = req.body.title;
      bookSearch = encodeURIComponent(bookSearch);

      try {
        const response = await axios.get(`https://openlibrary.org/search.json?author=${bookSearch}`);
        docs = response.data.docs;
        res.render("author_search.ejs", {
          docs: docs
       
        });
      } catch (error) {
        console.error(error);
        res.render("author_search.ejs", {
          title: "Error",
        });
      }
    } else {
      res.render("index.ejs", {
        docs: docs
     
      });
    }

  }
  
  
});

// POST ROUTE BOOK SELECTET
app.post("/bookSelected", async (req, res) => {
  const title = req.body.title;
  const imgSrc = req.body.imgSrc;
  const author = req.body.author;
  console.log(imgSrc);
  res.render("book_selected.ejs", {
    title: title,
    imgSrc: imgSrc,
    author: author
  })
});

app.post("/postbook", async (req, res) => {
  const name = req.body.name;
  const text = req.body.text;
  const starRate = parseInt(req.body.starRate);
  const date = new Date();
  const img = req.body.imgSrc;
  const title = req.body.title;
  console.log(title);
  try {
    const result = await db.query(
      "INSERT INTO booksrated (name, text, rate, date, img, title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, text, starRate, date , img, title]
    );
    // console.log(result);
    res.redirect("/");
  } catch (err){
    console.error(err);
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});