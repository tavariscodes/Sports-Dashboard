import { queryByTestId } from "@testing-library/react";
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
    career: object; // refactor to careerStat
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

    async playerStats(player: EspnPlayer, query?: statQuery): Promise<EspnPlayerStat> {
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
                    if (query.type === 'career') {
                        let careerStats = {};
                        element.col.forEach((elem, i) => {
                            typeof elem === 'object' ? careerStats[elem.data] = element.car[i]: careerStats[elem] = element.car[i]; // set career stat object property
                        })
                        playerStat.career[element.ttl] = careerStats;
                    } else if (query.type === 'season') {
                        let seasonStats = {};
                        playerStat.season[element.ttl] = [];
                        for (let j = 0; j < element.row.length; j++) {
                            element.col.forEach((elem, i) => {
                                typeof elem === 'object' ? seasonStats[elem.data] = element.row[j][i]: seasonStats[elem] = element.row[j][i]; // set career stat object property   
                            });
                        playerStat.season[element.ttl].push(seasonStats)
                        } 
                    }
                }
                return playerStat;
                // console.log(playerStat.career['Passing']);
            })
            
            .catch(err => {return(err)})
    }
        
}



const TestEspn = new Espn({});
// TestEspn.teams({sport: 'nfl'})
//     .then(teams => console.log(teams.length))
//     .catch(err => console.log(err.message))

// TestEspn.teamStats(
//     {
//         id: '10',
//         href: 'https://www.espn.com/nfl/team/_/name/ten/tennessee-titans',
//         name: 'Tennessee Titans',
//         shortName: 'Titans',
//         abbrev: 'ten',
//         logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/ten.png&w=80&h=80&cquality=40&scale=crop&location=origin&transparent=true',
//         conference: 'AFC South'
//     },
//     // {
//     //     sport: 'nfl',
//     //     type: 'rushing'
//     // }
// )
// .then(stats => console.log(stats))
// .catch(err => console.log(err))

// TestEspn.player({name: 'donovan mitchell', sport: 'nba'})
//     .then(player => console.log(player))
//     .catch(err => console.log(err));
TestEspn.playerStats({
    id: '6482ece5f90392e2ffdd13901fdd3a49',
    uid: 's:40~l:46~a:3908809',
    guid: '6482ece5f90392e2ffdd13901fdd3a49',
    displayName: 'Donovan Mitchell',
    url: 'https://www.espn.com/nba/player/_/id/3908809/donovan-mitchell',
    team: 'Utah Jazz'
  }
  , {sport: 'nba', type: 'season'}
  )
  .then(stats => console.log(stats))
  .catch(err => console.log(err));
export default Espn;

