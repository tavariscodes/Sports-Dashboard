"use strict";
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
var axios_1 = require("axios");
var cheerio = require("cheerio");
var helper_1 = require("./helper");
var Espn = /** @class */ (function () {
    function Espn(options) {
        this.domain = 'https://espn.com';
        this.headers = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36' };
    }
    Espn.prototype.getDomain = function () {
        return this.domain;
    };
    /**
     * Returns list of teams by sport
     */
    Espn.prototype.teams = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                options = {
                    url: this.domain + "/" + query.sport + "/teams",
                    headers: this.headers
                };
                return [2 /*return*/, (0, axios_1["default"])(options)
                        .then(function (response) {
                        var $ = cheerio.load(response.data);
                        var teamsObject = (0, helper_1.scriptTagToJson)($);
                        var conferenceArray = teamsObject.teams["" + query.sport];
                        var allTeams = [];
                        var _loop_1 = function (x) {
                            var conferenceName = conferenceArray[x].name;
                            allTeams = allTeams.concat(conferenceArray[x].teams.map(function (team) {
                                team.conference = conferenceName;
                                return team;
                            }));
                        };
                        for (var x = 0; x < conferenceArray.length; x++) {
                            _loop_1(x);
                        }
                        return allTeams;
                    })["catch"](function (err) { return (err); })];
            });
        });
    };
    Espn.prototype.teamStats = function (team, query) {
        return __awaiter(this, void 0, void 0, function () {
            var url, options;
            return __generator(this, function (_a) {
                url = team.href.split('/');
                url.splice(5, 0, 'stats');
                url = url.join('/');
                options = {
                    url: url,
                    headers: this.headers
                };
                return [2 /*return*/, (0, axios_1["default"])(options)
                        .then(function (response) {
                        var $ = cheerio.load(response.data);
                        var statsObject = (0, helper_1.scriptTagToJson)($); // refactor
                        var teamStats = statsObject.stats.teamStats.team; // refactor
                        var statsArray = [];
                        if (typeof query !== 'undefined') {
                            statsArray = teamStats.filter(function (stat) { return stat.type === query.type; })[0].stats;
                        }
                        else {
                            // return all stats
                            statsArray = teamStats.reduce(function (acc, statObj) {
                                statObj.stats.forEach(function (stat) { return stat.category = statObj.title; });
                                acc = acc.concat(statObj.stats);
                                return acc;
                            }, statsArray);
                        }
                        return statsArray;
                    })["catch"](function (err) { return (err); })];
            });
        });
    };
    Espn.prototype.schedule = function (team) {
        return __awaiter(this, void 0, void 0, function () {
            var seasonType, url, options;
            return __generator(this, function (_a) {
                seasonType = "2";
                url = team.href.split('/');
                url.splice(5, 0, 'schedule');
                url[url.length - 1] = "seasontype/" + seasonType;
                url = url.join('/');
                options = {
                    url: url,
                    headers: this.headers
                };
                return [2 /*return*/, (0, axios_1["default"])(options)
                        .then(function (response) {
                        var $ = cheerio.load(response.data);
                        var scheduleObject = (0, helper_1.scriptTagToJson)($); // refactor type 'any' here
                        // scheduleObject.scheduleData.teamSchedule[0].events.pre // scheduled games that haven't taken place;
                        // scheduleObject.scheduleData.teamSchedule[0].events.post // games that have concluded. 
                        // console.log(scheduleObject.scheduleData.teamSchedule[0].events.pre[0].group);   // array holding matchups 
                        var matchups;
                        if (team.href.split('/')[3] === 'nba') {
                            matchups = scheduleObject.scheduleData.teamSchedule[0].events.pre[0].group;
                        }
                        else {
                            matchups = scheduleObject.scheduleData.teamSchedule[0].events.pre;
                        }
                        var scheduleArray = matchups.reduce(function (acc, matchup) {
                            if (typeof matchup.date !== 'undefined') {
                                var schedule = {
                                    date: matchup.date.date,
                                    opponent: {
                                        name: matchup.opponent.displayName,
                                        logo: matchup.opponent.logo,
                                        abbrev: matchup.opponent.abbrev,
                                        isHomeTeam: matchup.opponent.homeAwaySymbol === 'vs' ? false : true
                                    }
                                };
                                acc.push(schedule);
                            }
                            return acc;
                        }, []);
                        return scheduleArray;
                    })];
            });
        });
    };
    Espn.prototype.player = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                options = {
                    url: 'https://site.web.api.espn.com/apis/search/v2',
                    headers: this.headers,
                    params: {
                        'region': 'us',
                        'lang': 'en',
                        'section': query.sport,
                        'limit': '10',
                        'page': '1',
                        'query': query.name,
                        'dtciVideoSearch': 'true',
                        'iapPackages': 'ESPN_PLUS,ESPN_PLUS_MLB,ESPN_PLUS_UFC_PPV_266',
                        'type': 'player'
                    }
                };
                return [2 /*return*/, (0, axios_1["default"])(options)
                        .then(function (res) {
                        if (typeof res.data.results === 'undefined') {
                            throw Error('no results try new query');
                        }
                        var player = (0, helper_1.createPlayer)(res.data.results[0].contents[0]);
                        return player;
                    })["catch"](function (err) { return (err); })];
            });
        });
    };
    Espn.prototype.playerStats = function (player, seasonType) {
        if (seasonType === void 0) { seasonType = "career"; }
        return __awaiter(this, void 0, void 0, function () {
            var url, options;
            return __generator(this, function (_a) {
                url = player.url.split('/');
                url.splice(5, 0, 'stats');
                url = url.join('/'); // create stats url 
                options = {
                    url: url,
                    headers: this.headers
                };
                return [2 /*return*/, (0, axios_1["default"])(options)
                        .then(function (response) {
                        var $ = cheerio.load(response.data);
                        var statsObject = (0, helper_1.scriptTagToJson)($);
                        var playerStat = { career: {}, season: {} };
                        var _loop_2 = function (x) {
                            var element = statsObject.player.stat.tbl[x]; // get each table element
                            var careerStats = {};
                            element.col.forEach(function (elem, i) {
                                typeof elem === 'object' ? careerStats[elem.data.toLowerCase()] = element.car[i] : careerStats[elem] = element.car[i]; // set career stat object property
                            });
                            playerStat.career[element.ttl] = careerStats;
                            playerStat.season[element.ttl] = [];
                            var _loop_3 = function (j) {
                                var seasonStats = {};
                                element.col.forEach(function (stat, i) {
                                    typeof stat === 'object' ? seasonStats[stat.data.toLowerCase()] = element.row[j][i] : seasonStats[stat] = element.row[j][i]; // set career stat object property   
                                });
                                playerStat.season[element.ttl].push(seasonStats);
                            };
                            for (var j = 0; j < element.row.length; j++) {
                                _loop_3(j);
                            }
                        };
                        for (var x = 0; x < statsObject.player.stat.tbl.length; x++) {
                            _loop_2(x);
                        }
                        // check if player nba or nfl
                        if (seasonType === 'career') {
                            console.log(playerStat.season);
                            return playerStat.season['Regular Season Averages'];
                        }
                        else {
                            return playerStat;
                        }
                    })["catch"](function (err) { return (err); })];
            });
        });
    };
    return Espn;
}());
var TestEspn = new Espn({});
TestEspn.playerStats({
    "displayName": "Ezekiel Elliott",
    "url": "http://www.espn.com/nfl/player/_/id/3051392/ezekiel-elliott",
    "id": "74394a0b53f256565b7b1c69c62600c6",
    "team": "Dallas Cowboys",
    "uid": "",
    "guid": ""
})
    .then(function (careerStats) {
    //   console.log(c)
    careerStats.map(function (stat) {
        console.log(stat);
    });
    // console.log(careerStats)
})["catch"](function (err) { return console.log(err); });
// TestEspn.teams({sport: 'nba'})
//     .then(teams => console.log(teams))
//     .catch(err => console.log(err));
// TestEspn.schedule(
//     // {
//     //     "id": "2",
//     //     "href": "https://www.espn.com/nba/team/_/name/bos/boston-celtics",
//     //     "name": "Boston Celtics",
//     //     "shortName": "Celtics",
//     //     "abbrev": "bos",
//     //     "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/bos.png&w=80&h=80&cquality=40&scale=crop&location=origin&transparent=true",
//     //     "conference": "Atlantic"
//     //   }
//     {
//         "id": "2",
//         "href": "https://www.espn.com/nfl/team/_/name/buf/buffalo-bills",
//         "name": "Buffalo Bills",
//         "shortName": "Bills",
//         "abbrev": "buf",
//         "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/buf.png&w=80&h=80&cquality=40&scale=crop&location=origin&transparent=true",
//         "conference": "AFC East"
//       }
// )
//     .then(schedule => console.log(schedule))
//     .catch(err => console.log(err));
exports["default"] = Espn;
