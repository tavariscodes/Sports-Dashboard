import React, { useEffect, useState } from 'react';
// import MainLayout from '../components/MainLayout';
import { useTheme, makeStyles, } from '@mui/styles';
import { Theme, Box, Grid, Container, Paper, Typography, GridSize, IconButton, Menu, MenuItem} from '@mui/material';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import BuildIcon from '@mui/icons-material/Build'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import FlashOnIcon from '@mui/icons-material/FlashOn';

const styles = {
    root: {
        display: 'flex',
        // justifyContent: 'center',
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

    },
       
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


const GET_TEAMS = gql`
    query teams($sport: String!) {
        teams(sport: $sport) {
            name,
        }
    }

`

const Gamebox: React.FC = () => {
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
                <img src="https://a.espncdn.com/i/teamlogos/nba/500/bos.png" style={{height: '38px', width: '40px'}}/>
                <Typography fontSize="14px" >Celtics</Typography>
            </Box>
            <Box style={{display: 'flex', flexDirection: 'column', alignItems:'center',justifyContent: 'center'}}>
                <FlashOnIcon sx={{color:'primary.dark', width: '50px', height: '32px'}}/>
                <Typography fontSize="14px" >7:30pm</Typography>
            </Box>
            <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <img src="https://a.espncdn.com/i/teamlogos/nba/500/bos.png" style={{height: '38px', width: '40px'}}/>
                <Typography fontSize="14px" >Celtics</Typography>
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
    queryItems: string[],
    optionItems: string[],
    children?: React.ReactNode,
}

const DataCard: React.FC<DataCardProps> = ({children, xs, header, queryItems, optionItems}) => {
    const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [getTeams, {loading, error, data}] = useLazyQuery<Team>(GET_TEAMS);
    const classes = useStyles();

    useEffect(() => {
        if (selectedOption) {
            getTeams({variables : {sport: selectedOption.toLowerCase()}})
        }
    }, [selectedOption]);

    useEffect(() => {
        if (selectedQuery) {
            alert(selectedQuery)
        }   
    }, [selectedQuery])

    if (loading) {return <p>Loading...</p>};
    if (error) {return <p>{error}</p>};
    if (data) {
        // if new data returned update queryItems
        queryItems = data.teams.map(team => team.name);
    }
    

    return(
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
    )
}

export default () => { // Dashboard
    const classes = useStyles();
    const theme: Theme = useTheme();
    const {loading, error, data} = useQuery<Team>(GET_TEAMS, {variables: {sport: 'nba'}});
    if (loading) {return <div>"loading"</div>}
    if (error) { return <div>{error}</div> }
    if (!data) {return <p>Couldn't load your webpage</p>}

    const gameOptions = data.teams.map(team => team.name);
    const standingsOptions = [''];
    const gameStatsOptions = [''];
    const optionMenu = ['NFL', 'NBA']
    // console.log(data)

    return(
        <Container maxWidth={false} sx={styles.root}>
            <Grid container className={classes.topContainer} spacing={2} >
                <DataCard xs={8} header="Games" queryItems={gameOptions} optionItems={optionMenu}>
                    <Box className={classes.gameBoxContainer}>
                        <Grid container item style={{ gap: 5 }} >   {/* rows */}
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
                        </Grid>
                    </Box>
                </DataCard>
                <DataCard xs={4} header="Standings" queryItems={standingsOptions} optionItems={optionMenu}>
                </DataCard>
                
            </Grid>
            <Grid container className={classes.topContainer} spacing={6} >
                <DataCard xs={4} header="Game Stats" queryItems={gameStatsOptions} optionItems={optionMenu}></DataCard>
                <DataCard xs={4} header="Game Stats" queryItems={gameStatsOptions} optionItems={optionMenu}></DataCard>
                <DataCard xs={4} header="Game Stats" queryItems={gameStatsOptions} optionItems={optionMenu}></DataCard>
            </Grid>
        </Container>
    )
}

// export default Dashboard;