import React from 'react';
// import MainLayout from '../components/MainLayout';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Paper } from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffcccb'
    },
    topContainer: {
        margin: 25,
        display: 'flex',

    },
    medDataCard: {
        display: 'flex',
        height: '50%',
        border: '1px solid black',
        flex: 3,
        marginRight: 10

    },
    smDataCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        border: '1px solid black',

    },
});

interface Team {
    id: string
    href: string
    name: string
    shortName: string
    abbrev: string
    logo: string
    conference: string,
    teams: Team[]
}

const GET_TEAMS = gql`
    query {
    teams(sport: "nba") {
        name,
    }
}
`

const Dashboard: React.FC = () => {
    const classes = useStyles();
    const {loading, error, data} = useQuery<Team>(GET_TEAMS);
    if (loading) {return <div>"loading"</div>}
    if (error) { return <div>{error}</div> }
    if (!data) {return <p>Couldn't load your webpage</p>}
    return(
        <div className={classes.root}>
            <Container className={classes.topContainer}>
                <Paper elevation={3} className={classes.medDataCard}>
                
                </Paper>
                <Paper elevation={3} className={classes.smDataCard}> 
                Teams:
                {data.teams.map(team => {
                    return <div style={{display: 'flex'}}> {team.name} </div>
                })} 
                </Paper>
            </Container>

        </div>
    )
}

export default Dashboard;