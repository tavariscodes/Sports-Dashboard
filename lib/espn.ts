import axios, {AxiosRequestConfig} from "axios";
import * as cheerio from "cheerio";

// create types and methods for espn.com api

interface ApiOptions {
    
}

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
    teams: any;
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

class Espn implements EspnApi {
    private domain: string
    public getDomain() {
        return this.domain;
    }
    constructor(options: ApiOptions) {
        this.domain = 'https://espn.com';
    }
    /**
     * Returns list of teams by sport
     */
    async teams(query: Query): Promise<EspnTeam[]> {
        let options: AxiosRequestConfig = {
            url: `${this.domain}/${query.sport}/teams`,
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36' },
        }
        return axios(options)
            .then(response => {
                let $ = cheerio.load(response.data);
                let teamsObject: EspnObjectType;
                $('script').each(function () {
                    const scriptTagContents = $(this).html()
                    const regex = /(?<=window\[.*?\=).*$/gm
                    if (scriptTagContents.match(regex)) {
                        teamsObject = JSON.parse(scriptTagContents.match(regex)[0].replace(/;/g, '')).page.content;    // remove trailing semi colon
                    }
                })
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
}


const TestEspn = new Espn({});
TestEspn.teams({sport: 'nfl'})
    .then(teams => console.log(teams.length))
    .catch(err => console.log(err.message))

export default Espn;

