const express = require("express");
const stripe = require("stripe")(
  "sk_test_51JTMrNLnwdhBHjrq2VaKUCIfMZR4p9wtDgesjdFmU0siKIvOxTojfIiFvYkGxhSDjiZO261Mmgo7FmnU5QR0jQyf002jCs7BBG"
);
const exphbs = require("express-handlebars");

const app = express();

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
    success_url: "http://localhost:5000/thanks",
    cancel_url: "http://localhost:5000/",
  });

  res.redirect(303, session.url);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
