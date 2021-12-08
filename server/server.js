const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');

const { ApolloServer } = require('apollo-server-express');


// used in the REST API version of the site
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    const authorization = req.headers.authorization || "";
    return { authorization }; 
  },
});

server.applyMiddleware({ app });

// routes is used for the REST API version of the site
// app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
