import axios, {AxiosRequestConfig} from "axios";
import * as cheerio from "cheerio";
import { scriptTagToJson } from './helper';

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

interface EspnStat {
    name: string;
    displayValue: string;
    value: number;
    abbreviation: string;
    dir: string;
    hidesort: boolean;
    category?: string
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
 
    async teamStats(team: EspnTeam, query?: statQuery): Promise<EspnStat[]> {
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
                let statsArray: EspnStat[] = []; 
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

export default Espn;

