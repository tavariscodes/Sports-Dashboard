const { ApolloServer, gql, ValidationError, ApolloError } = require('apollo-server');
import Espn from '../sportsapi/espn'

const espnapi = new Espn({});
// define the schema type definition
const typeDefs = gql`
  # defines the data type to be consumed by the queries
  type Player {
    id: String
    displayName: String
    url: String
    team: String
  }

  type Team {
    id: String
    href: String
    name: String
    shortName: String
    abbrev: String
    logo: String
    conference: String
    stats: [TeamStats]
  }

  type TeamStats {
    name: String
    displayValue: String
    value: String
    abbreviation: String
    dir: String
    hidesort: Boolean
    category: String
  }

  # defines the Query special type object
  type Query {
    teams(sport: String!): [Team]
    team(name: String!, sport: String!): Team
    player(name: String!, sport: String!): Player
  }
`

// create the resolvers
const resolvers = {
    Team: {
      async stats(team) {
        try {
          let stats = await espnapi.teamStats(team)
          return stats;
        } catch (error) {
          throw new ApolloError(error)
        }
      } 
    },
    Query: {
        teams: async (_, args) => {
          try {
            let teams = await espnapi.teams({sport: args.sport})
            return teams || new ValidationError('Incorrect sport: nba | nfl | soccer')
          } catch (error) {
            throw new ApolloError(error)
          }
          
        },
        async team(_, args) {
          try {
            const teams = await espnapi.teams({sport: args.sport})
            const team = teams.find(team => team.name === args.name);
            return team || new ValidationError('Team with name not found')
          } catch (error) {
            throw new ApolloError(error)
          }
        },
        async player(_, args) {
          try {
            const player = await espnapi.player({name: args.name, sport: args.sport})
            return player || new ValidationError('User displayName not found')
          } catch (error) {
            throw new ApolloError(error);
          }
          
        }
    },
};

// define the Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`GraphQL server running at ${url}`);
});