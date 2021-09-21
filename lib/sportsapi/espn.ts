import axios, {AxiosRequestConfig} from "axios";
import * as cheerio from "cheerio";
import { scriptTagToJson, createPlayer } from './helper';

// create types and methods for espn.com api
interface ApiOptions {}

interface EspnApi {
    getDomain(): string; // PROPERTY
}

type Sport = "nba" | "nfl" | "soccer";

interface Query {
    name?: string;
    sport: Sport;
}

// refactor later :)
interface EspnObjectType {
    teams: Array<EspnTeam>;
}

interface EspnTeam {
    id: string;
    href: string;
    name: string;
    shortName: string;
    abbrev: string;
    logo: string;
    conference: string;
}

interface statQuery extends Query {
    type?: string;   // type of stat i.e. rushing, passing, etc...
}

interface EspnTeamStat {
    name: string;
    displayValue: string;
    value: number;
    abbreviation: string;
    dir: string;
    hidesort: boolean;
    category?: string
}

export interface EspnPlayer { 
    id: string;
    uid: string;
    guid: string;
    displayName: string;
    team: string;
    url: string;
}

interface EspnPlayerStat {
    season: object; // refactor to seasonStat
    career: object; // refactor to careerStat <- would actually probably need to create stattypes for each sport 
}

interface EspnOpponentObject {
    name: string;
    abbrev: string;
    logo: string;
    isHomeTeam: boolean;
}

interface EspnTeamSchedule {
    date: string, // convert to date type 
    opponent: EspnOpponentObject,
}


// soo temporary

interface EspnNbaPlayerStat {
    season: string;
    gp: string;
    min: string;
    ast: string;
    pts: string;
   'fg%': string;
}

class Espn implements EspnApi {
    private domain: string
    private headers: {[key: string]: string};
    public getDomain() {
        return this.domain;
    }
    constructor(options: ApiOptions) {
        this.domain = 'https://espn.com';
        this.headers = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36' }
    }
    /**
     * Returns list of teams by sport
     */
    async teams(query: Query): Promise<EspnTeam[]> {
        let options: AxiosRequestConfig = {
            url: `${this.domain}/${query.sport}/teams`,
            headers: this.headers,
        }
        return axios(options)
            .then(response => {
                let $ = cheerio.load(response.data);
                let teamsObject: EspnObjectType = scriptTagToJson($);
                let conferenceArray = teamsObject.teams[`${query.sport}`]
                let allTeams: Array<EspnTeam> = [];
                for (let x  = 0; x < conferenceArray.length; x++) {
                    let conferenceName = conferenceArray[x].name;
                    allTeams = allTeams.concat( conferenceArray[x].teams.map((team: EspnTeam) => {
                        team.conference = conferenceName;
                        return team;
                    }));
                }
                return allTeams;
            })
            .catch(err => {return(err)});
    }
 
    async teamStats(team: EspnTeam, query?: statQuery): Promise<EspnTeamStat[]> {
        // refactor
        let url: string | string[] = team.href.split('/'); url.splice(5, 0, 'stats'); url = url.join('/');
        let options: AxiosRequestConfig = {
            url,
            headers: this.headers,
        }
        return axios(options)
            .then(response => {
                let $ = cheerio.load(response.data);
                let statsObject: any = scriptTagToJson($);  // refactor
                let teamStats: any[] = statsObject.stats.teamStats.team;    // refactor
                let statsArray: EspnTeamStat[] = []; 
                if (typeof query !== 'undefined') {
                    statsArray = teamStats.filter(stat => stat.type === query.type)[0].stats;
                } else {
                    // return all stats
                    statsArray = teamStats.reduce((acc, statObj) => {
                        statObj.stats.forEach(stat => stat.category = statObj.title);
                        acc = acc.concat(statObj.stats); 
                        return acc
                    }, statsArray);
                }
                return statsArray;
            })
            .catch(err => {return(err)})
    }

    async schedule(team: EspnTeam): Promise<EspnTeamSchedule[]> {
        let seasonType: string = "2"; // regular season, pre-season or playoffs
        let url: string | string[] = team.href.split('/'); url.splice(5, 0, 'schedule'); url[url.length - 1] = `seasontype/${seasonType}`; url = url.join('/');
        let options = {
            url,
            headers: this.headers
        }

        return axios(options) 
            .then(response => {
                let $  = cheerio.load(response.data);
                let scheduleObject: any = scriptTagToJson($);  // refactor type 'any' here
                // scheduleObject.scheduleData.teamSchedule[0].events.pre // scheduled games that haven't taken place;
                // scheduleObject.scheduleData.teamSchedule[0].events.post // games that have concluded. 
                // console.log(scheduleObject.scheduleData.teamSchedule[0].events.pre[0].group);   // array holding matchups 
                let matchups; 
                if (team.href.split('/')[3] === 'nba') {
                    matchups =  scheduleObject.scheduleData.teamSchedule[0].events.pre[0].group
                } else {
                    matchups= scheduleObject.scheduleData.teamSchedule[0].events.pre
                }                
                let scheduleArray = matchups.reduce((acc, matchup) => {
                    if (typeof matchup.date !== 'undefined') {
                        let schedule: EspnTeamSchedule = {
                            date: matchup.date.date,
                            opponent: {
                                name: matchup.opponent.displayName,
                                logo: matchup.opponent.logo,
                                abbrev: matchup.opponent.abbrev,
                                isHomeTeam: matchup.opponent.homeAwaySymbol === 'vs' ? false : true
                            }
                        }
                        acc.push( schedule )
                    } return acc;
                }, []);
                return scheduleArray
            })
    }

    async player(query: Query): Promise<EspnPlayer> {
        let options: AxiosRequestConfig = {
            url: 'https://site.web.api.espn.com/apis/search/v2',    // relies on api search endpoint vs web scraping
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
                'type':'player'
            } 
        }
       return axios(options)
            .then(res => {
                if (typeof res.data.results === 'undefined') {
                    throw Error('no results try new query')
                }
                let player = createPlayer(res.data.results[0].contents[0]);
                return player
            })
            .catch(err => {return(err)}); 
    }

    async playerStats(player: EspnPlayer, seasonType: string = "career"): Promise<EspnNbaPlayerStat[]> {
        // refactor to return both career and season stats in one object :)
        let url: string | string[] = player.url.split('/'); url.splice(5, 0, 'stats'); url = url.join('/'); // create stats url 
        let options: AxiosRequestConfig = {
            url,
            headers: this.headers
        }
        return axios(options)
            .then(response => {
                let $ = cheerio.load(response.data);
                let statsObject: any = scriptTagToJson($); 
                let playerStat: EspnPlayerStat = {career: {}, season: {}};
                for( let x = 0; x < statsObject.player.stat.tbl.length; x++ ) { // loop thru each stat table
                    let element = statsObject.player.stat.tbl[x];  // get each table element
                        let careerStats = {};
                        element.col.forEach((elem, i) => {
                            typeof elem === 'object' ? careerStats[elem.data.toLowerCase()] = element.car[i]: careerStats[elem] = element.car[i]; // set career stat object property
                        })
                        playerStat.career[element.ttl] = careerStats;
                        playerStat.season[element.ttl] = [];
                         for (let j = 0; j < element.row.length; j++) { // for each year 
                            let seasonStats = {};
                            element.col.forEach((stat, i) => { // for each stat
                                typeof stat === 'object' ? seasonStats[stat.data.toLowerCase()] = element.row[j][i]: seasonStats[stat] = element.row[j][i]; // set career stat object property   
                            });
                            playerStat.season[element.ttl].push(seasonStats)
                        } 
                }
                // check if player nba or nfl
                if (seasonType === 'career') {
                    console.log(playerStat.season);
                    return playerStat.season['Regular Season Averages'];
                } else{ 
                    return playerStat
                }
            })
            
            .catch(err => {return(err)})
    }
        
}

const TestEspn = new Espn({});
TestEspn.playerStats( {
    "displayName": "Ezekiel Elliott",
    "url": "http://www.espn.com/nfl/player/_/id/3051392/ezekiel-elliott",
    "id": "74394a0b53f256565b7b1c69c62600c6",
    "team": "Dallas Cowboys",
    "uid": "",
    "guid":""
  }
  )
  .then(careerStats => {
    //   console.log(c)
      careerStats.map(stat => {
        console.log(stat)
      })
    // console.log(careerStats)
  })
  .catch(err => console.log(err));
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

export default Espn;

