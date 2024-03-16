const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// Imports Apollo Server and expressMiddleware
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
// Imports graphQL
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers
});
// Starts apollo server 
const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/index.html')));
  }
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
  
};
startApolloServer(); 

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// if we're in production, serve client/build as static assets


// app.use(routes);


