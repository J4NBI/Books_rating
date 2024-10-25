// BOOK RATING JAN BIHL v.1

import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
// import "./styles/style.css";

const app = express();
const port = 3000;



// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// USE STATIC FOLDERS
app.use(express.static("public"));


// Home ROUTE
app.get("/", (req, res) => {
  let docs = [];
  res.render("index.ejs", {
    docs: docs
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
          docs: docs
       
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});