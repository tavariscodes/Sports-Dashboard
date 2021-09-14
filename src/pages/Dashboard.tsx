import React from 'react';
// import MainLayout from '../components/MainLayout';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Paper } from '@material-ui/core';

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
        flex: 1,
        border: '1px solid black',

    },
});

const Dashboard: React.FC = () => {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <Container className={classes.topContainer}>
                <Paper elevation={3} className={classes.medDataCard}> hi </Paper>
                <Paper elevation={3} className={classes.smDataCard}> hi </Paper>
            </Container>

        </div>
    )
}

export default Dashboard;