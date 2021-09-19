"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var _a = require('apollo-server'), ApolloServer = _a.ApolloServer, gql = _a.gql, ValidationError = _a.ValidationError, ApolloError = _a.ApolloError;
var espn_1 = require("../sportsapi/espn");
var espnapi = new espn_1["default"]({});
// define the schema type definition
var typeDefs = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  # defines the data type to be consumed by the queries\n  type Player {\n    id: String\n    displayName: String\n    url: String\n    team: String\n  }\n\n  type Team {\n    id: String\n    href: String\n    name: String\n    shortName: String\n    abbrev: String\n    logo: String\n    conference: String\n    schedule: [Schedule],\n    stats: [TeamStats]\n  }\n\n  type TeamStats {\n    name: String\n    displayValue: String\n    value: String\n    abbreviation: String\n    dir: String\n    hidesort: Boolean\n    category: String\n  }\n  \n  type Opponent {\n    name: String,\n    abbrev: String,\n    logo: String,\n    isHomeTeam: Boolean,\n  }\n\n  type Schedule {\n    date: String,\n    opponent: Opponent,\n  }\n\n  # defines the Query special type object\n  type Query {\n    teams(sport: String!): [Team]\n    team(name: String!, sport: String!): Team\n    player(name: String!, sport: String!): Player\n    schedule(team: String!, sport: String!): Schedule\n  }\n"], ["\n  # defines the data type to be consumed by the queries\n  type Player {\n    id: String\n    displayName: String\n    url: String\n    team: String\n  }\n\n  type Team {\n    id: String\n    href: String\n    name: String\n    shortName: String\n    abbrev: String\n    logo: String\n    conference: String\n    schedule: [Schedule],\n    stats: [TeamStats]\n  }\n\n  type TeamStats {\n    name: String\n    displayValue: String\n    value: String\n    abbreviation: String\n    dir: String\n    hidesort: Boolean\n    category: String\n  }\n  \n  type Opponent {\n    name: String,\n    abbrev: String,\n    logo: String,\n    isHomeTeam: Boolean,\n  }\n\n  type Schedule {\n    date: String,\n    opponent: Opponent,\n  }\n\n  # defines the Query special type object\n  type Query {\n    teams(sport: String!): [Team]\n    team(name: String!, sport: String!): Team\n    player(name: String!, sport: String!): Player\n    schedule(team: String!, sport: String!): Schedule\n  }\n"
    // create the resolvers
])));
// create the resolvers
var resolvers = {
    Team: {
        stats: function (team) {
            return __awaiter(this, void 0, void 0, function () {
                var stats, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, espnapi.teamStats(team)];
                        case 1:
                            stats = _a.sent();
                            return [2 /*return*/, stats];
                        case 2:
                            error_1 = _a.sent();
                            throw new ApolloError(error_1);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        schedule: function (team) {
            return __awaiter(this, void 0, void 0, function () {
                var schedule, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, espnapi.schedule(team)];
                        case 1:
                            schedule = _a.sent();
                            return [2 /*return*/, schedule];
                        case 2:
                            error_2 = _a.sent();
                            throw new ApolloError(error_2);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    },
    // Schedule: {
    //   async opponent(mathcup) {
    //     schedule
    //   }
    // },
    Query: {
        teams: function (_, args) { return __awaiter(void 0, void 0, void 0, function () {
            var teams, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, espnapi.teams({ sport: args.sport })];
                    case 1:
                        teams = _a.sent();
                        return [2 /*return*/, teams || new ValidationError('Incorrect sport: nba | nfl | soccer')];
                    case 2:
                        error_3 = _a.sent();
                        throw new ApolloError(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        team: function (_, args) {
            return __awaiter(this, void 0, void 0, function () {
                var teams, team, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, espnapi.teams({ sport: args.sport })];
                        case 1:
                            teams = _a.sent();
                            team = teams.find(function (team) { return team.name === args.name; });
                            return [2 /*return*/, team || new ValidationError('Team with name not found')];
                        case 2:
                            error_4 = _a.sent();
                            throw new ApolloError(error_4);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        player: function (_, args) {
            return __awaiter(this, void 0, void 0, function () {
                var player, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, espnapi.player({ name: args.name, sport: args.sport })];
                        case 1:
                            player = _a.sent();
                            return [2 /*return*/, player || new ValidationError('User displayName not found')];
                        case 2:
                            error_5 = _a.sent();
                            throw new ApolloError(error_5);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    }
};
// define the Apollo Server instance
var server = new ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
server.listen().then(function (_a) {
    var url = _a.url;
    console.log("GraphQL server running at " + url);
});
var templateObject_1;
