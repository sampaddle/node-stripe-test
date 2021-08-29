const express = require("express");
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const exphbs = require("express-handlebars");

const app = express();

// change url path if in production or local environment
const production = "https://agile-tor-95344.herokuapp.com";
const development = "http://localhost:5000";
const url = process.env.NODE_ENV ? production : development;

//handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// bodyparser
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

// Set static folder
app.use(express.static(`${__dirname}/public`));

// Index route

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/thanks", (req, res) => {
  res.render("thanks");
});

app.post("/hooks", (req, res) => {
  res.send("recevied!");
});

app.post("/charge", async (req, res) => {
  console.log(req.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Web Development e-book",
          },
          unit_amount: 5000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${url}/thanks`,
    cancel_url: `${url}`,
  });
  console.log(url);
  res.redirect(303, session.url);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
