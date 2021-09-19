import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useTheme, makeStyles, } from '@mui/styles';
import { Theme, Box, Grid, Container, Paper, Typography, GridSize, IconButton, Menu, MenuItem} from '@mui/material';
// icons
import BuildIcon from '@mui/icons-material/Build'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import FlashOnIcon from '@mui/icons-material/FlashOn';
// Data context
import { DataProvider, useData, useUpdateData } from '../components/DataContext';

// Styling for dashboard components. 
const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'primary.dark'
    },
    dataCard: {
        
        width: '100%', backgroundColor: 'primary.main', display: 'flex', flexDirection: 'column',
    },
    smDataCard: {
        width: '100%', backgroundColor: 'primary.light', display: 'flex', flexDirection: 'column',

    }
       
} as const

const useStyles = makeStyles((theme: Theme) => ({
    topContainer: {
        minWidth: '100%',
        flex: 1,
        marginTop: '15px',
        marginBottom: '15px'

    },
    dataCard: {
        width: '100%', backgroundColor: theme.palette.primary.light, display: 'flex', flexDirection: 'column',
        overflowX: 'hidden'
    },
    dataCardHeader: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px',},
    gameBoxContainer: {
        margin: '5px 10px 10px ', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-evenly',
        gap: 2,
        height: '100%'}
}));

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

// Data Card Queries

const GET_TEAMS = gql`
    query teams($sport: String!) {
        teams(sport: $sport) {
            name,
        }
    }
`

const GET_SCHEDULE = gql`
    query($teamName: String!, $teamSport: String!) {
        team(name: $teamName, sport: $teamSport) {
            abbrev,
            name,
            logo,
            schedule {
                date,
                opponent {
                 name,
                 abbrev,
                 isHomeTeam,
                 logo
            } 
        }
    }
}
`


// Components and Interfaces

interface GameboxContainerProps {
    
    
}

const GameboxContainer: React.FC = () => {
    // relies on DataContext for populating 
    const classes = useStyles();
    const contextData = useData();
    if (contextData) {
        let currentTeam = contextData.team
        let teamSchedule = contextData.team.schedule;
        teamSchedule = teamSchedule.map((game: any, i: number) => {
            let gameDate: Date | string = new Date(game.date)
            gameDate = gameDate.getMonth().toString() + '/' + gameDate.getDate().toString();
            return(<Gamebox key={i} team1={currentTeam.abbrev} team2={game.opponent.abbrev} date={gameDate} isHome={!game.opponent.isHome} team1Logo={currentTeam.logo} team2Logo={game.opponent.logo}/>)
        })
        // console.log(teamSchedule)
        return (
        <Box className={classes.gameBoxContainer}>
            <Grid container item style={{ gap: 5 }} >   {/* rows */}
            {teamSchedule.filter((team: any, i: any) => i < 4)}
            </Grid>
            <Grid container item style={{ gap: 5}}>
            {teamSchedule.filter((team: any, i: any) => i > 4 && i <= 8)}
            </Grid>
            <Grid container item style={{ gap: 5}}>
            {teamSchedule.filter((team: any, i: any) => i > 8 && i <= 12)}
            </Grid>
            <Grid container item style={{ gap: 5}} >
            {teamSchedule.filter((team: any, i: any) => i > 12 && i <= 16)}
            </Grid>
            <Grid container item style={{ gap: 5}} >
            {teamSchedule.filter((team: any, i: any) => i > 16 && i <= 20)}
            </Grid>
        </Box>)
    }
    return (
        <Box className={classes.gameBoxContainer}>
            sorry give us a moment
            {/* <Grid container item style={{ gap: 5 }} >   

                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
            </Grid>
            <Grid container item style={{ gap: 5}}>
                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
            </Grid>
            <Grid container item style={{ gap: 5}}>
                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
            </Grid>
            <Grid container item style={{ gap: 5}} >
                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
            </Grid>
            <Grid container item style={{ gap: 5}} >
                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
                <Gamebox/>
            </Grid> */}
        </Box>
    )
}

interface GameboxProps {
    team1: string,
    team2: string,
    isHome: boolean,
    date: string,
    team1Logo: string,
    team2Logo: string
}

const Gamebox: React.FC<GameboxProps> = ({team1, team2, isHome, date, team1Logo, team2Logo}) => {
    const themes: Theme = useTheme()
    return (
        <Grid style={{
            display: 'flex',
            justifyContent: 'space-between',
            height: '65px', 
            backgroundColor: themes.palette.primary.light, 
            borderRadius: '5px', 
            border: '1px solid #AF4448',
            padding: '5px'
            }} item xs>
             <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <img src={team1Logo} style={{height: '38px', width: '40px'}}/>
                <Typography fontSize="14px" >{team1.toUpperCase()}</Typography>
            </Box>
            <Box style={{display: 'flex', flexDirection: 'column', alignItems:'center',justifyContent: 'center'}}>
                <FlashOnIcon sx={{color:'primary.dark', width: '50px', height: '32px'}}/>
                <Typography fontSize="14px" >{date}</Typography>
            </Box>
            <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <img src={team2Logo} style={{height: '38px', width: '40px'}}/>
                <Typography fontSize="14px" >{team2.toUpperCase()}</Typography>
            </Box>
        </Grid>
    )
}

interface DataCardMenuProps {
    name: string,
    iconComponent: JSX.Element,
    selectedHandler: React.Dispatch<string | null>,
    menuItems: string[],
    children?: React.ReactNode,
}

const DataCardMenu: React.FC<DataCardMenuProps> = ({name, iconComponent, menuItems, selectedHandler}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);



    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        let selectedItem = menuItems[index];
        selectedHandler(selectedItem)
        setAnchorEl(null)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    return(
        <div>
            <IconButton
                edge="end" 
                style={{color: 'white', }}
                id="filter-button"
                aria-controls="filter-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true': undefined}
                onClick={handleClick}
            >
                {iconComponent}
            </IconButton>
            <Menu 
                id={`${name}-menu`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': `${name}-button`
                }}
            >
                {menuItems.map((item, index) => {
                    return <MenuItem key={index} onClick={(event) => handleMenuItemClick(event, index)} >{item}</MenuItem>
                })}
            </Menu>
        </div>
    )
}
 
interface DataCardProps {
    xs: GridSize,
    header: string,
    // queryItems: string[],
    optionItems: string[],
    children?: React.ReactNode,
}

const DataCard: React.FC<DataCardProps> = ({children, xs, header, optionItems}) => {
    const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>('nba');
    
    const [dataToRender, setDataToRender] = useState<object | null>(null);
    const [getTeams, {loading, error, data}] = useLazyQuery<Team>(GET_TEAMS);   // render this programmatically - change getTeams to getData ?
    const [getData, {loading: scheduleLoading, error: scheduleError, data:scheduleData }] = useLazyQuery<Team>(GET_SCHEDULE)
    const classes = useStyles();
    let queryItems: string[] = [];

    useEffect(() => {
        getTeams({variables: {sport: 'nba'}})
    }, [])

    useEffect(() => {
        if (selectedOption) {
            getTeams({variables : {sport: selectedOption.toLowerCase()}})
        }
    }, [selectedOption]);

    useEffect(() => {
        if (selectedQuery) {
            // Query data and render to component
            // setDataToRender
            getData({variables: {teamName: selectedQuery, teamSport: selectedOption?.toLowerCase()}})
        }   
    }, [selectedQuery])

    useEffect(() => {
        if (scheduleData) {
            setDataToRender(scheduleData)
        }
    }, [scheduleData])
    // if (scheduleData) {console.log(scheduleData);}
    if (loading || scheduleLoading) {
        return(
            <DataProvider data={dataToRender} setData={setDataToRender}>
                <Grid container item xs={xs} style={{marginTop: '5px', height: '100%'}}>
                    <Paper sx={styles.dataCard} elevation={6}>
                        Loading...
                    </Paper>
                </Grid>
            </DataProvider>    
        )
    };
    if (error || scheduleError) {return <p>{error || scheduleError}</p>};
    if (data) {
        // if new data return update queryItems
        queryItems = data.teams.map(team => team.name);     
    }
    return(
        <DataProvider data={dataToRender} setData={setDataToRender}>
            <Grid container item xs={xs} style={{marginTop: '5px', height: '100%'}}>
                <Paper sx={styles.dataCard} elevation={6}>
                    <Box component="span" className={classes.dataCardHeader}>
                        <Typography sx={{color: 'white'}} variant="h4">
                            {header}
                        </Typography>
                        <Box style={{display: 'flex'}}>
                            <DataCardMenu name="filter" selectedHandler={setSelectedQuery} menuItems={queryItems} iconComponent={<ArrowDropDownCircleIcon/>}/>
                            <DataCardMenu name="options" selectedHandler={setSelectedOption} menuItems={optionItems} iconComponent={<BuildIcon/>}/>       
                        </Box>
                    </Box>
                    {children}
                </Paper>
            </Grid>
        </DataProvider>
    )
}

export default () => { // Dashboard
    const classes = useStyles();
    const theme: Theme = useTheme();
    // if (loading) {return <div>"loading"</div>}
    // if (error) { return <div>{error}</div> }
    // if (!data) {return <p>Couldn't load your webpage</p>}

    // const gameOptions = data.teams.map(team => team.name);
    const standingsOptions = [''];
    const gameStatsOptions = [''];
    const optionMenu = ['NFL', 'NBA']
    // console.log(data)

    return(
        <Container maxWidth={false} sx={styles.root}>
            <Grid container className={classes.topContainer} spacing={2}>
                <DataCard xs={8} header="Games" optionItems={optionMenu}>
                    <GameboxContainer />
                </DataCard>
                <DataCard xs={4} header="Standings" optionItems={optionMenu}>
                </DataCard>
                
            </Grid>
            <Grid container className={classes.topContainer} spacing={6} >
                <DataCard xs={4} header="Game Stats"optionItems={optionMenu}></DataCard>
                <DataCard xs={4} header="Game Stats"  optionItems={optionMenu}></DataCard>
                <DataCard xs={4} header="Game Stats" optionItems={optionMenu}></DataCard>
            </Grid>
        </Container>
    )
}

// export default Dashboard;