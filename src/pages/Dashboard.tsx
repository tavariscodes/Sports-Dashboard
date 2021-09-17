import React from 'react';
// import MainLayout from '../components/MainLayout';
import { useTheme, makeStyles, } from '@mui/styles';
import { Theme, Box, Grid, Container, Paper, Typography, GridSize, IconButton, Menu, MenuItem} from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import BuildIcon from '@mui/icons-material/Build'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import FlashOnIcon from '@mui/icons-material/FlashOn';
// const largeDataCard = styled('Paper')(({ theme }) => ({
//     backgroundColor: theme.palette.primary.main

// }))

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
    query {
    teams(sport: "nba") {
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
    menuItems: string[],
    children?: React.ReactNode
}

const DataCardMenu: React.FC<DataCardMenuProps> = ({name, iconComponent, menuItems}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        let selectedItem = menuItems[index];
        console.log(selectedItem)
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
    children?: React.ReactNode
}

const DataCard: React.FC<DataCardProps> = ({children, xs, header}) => {
    const filterMenu = ['Profile', 'Login', 'Myaccount']
    const classes = useStyles();
    return(
        <Grid container item xs={xs} style={{marginTop: '5px', height: '100%'}}>
            <Paper sx={styles.dataCard} elevation={6}>
                <Box component="span" className={classes.dataCardHeader}>
                    <Typography sx={{color: 'white'}} variant="h4">
                        {header}
                    </Typography>
                    <Box style={{display: 'flex'}}>
                        <DataCardMenu name="filter" menuItems={filterMenu} iconComponent={<ArrowDropDownCircleIcon/>}/>
                        <DataCardMenu name="options" menuItems={filterMenu} iconComponent={<BuildIcon/>}/>       
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
    const {loading, error, data} = useQuery<Team>(GET_TEAMS);
    if (loading) {return <div>"loading"</div>}
    if (error) { return <div>{error}</div> }
    if (!data) {return <p>Couldn't load your webpage</p>}
    return(
        <Container maxWidth={false} sx={styles.root}>
                <Grid container className={classes.topContainer} spacing={2} >
                    <DataCard xs={8} header="Games">
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
                    <DataCard xs={4} header="Standings">
                    </DataCard>
                   
                </Grid>
                <Grid container className={classes.topContainer} spacing={6} >
                    <DataCard xs={4} header="Game Stats"></DataCard>
                    <DataCard xs={4} header="Game Stats"></DataCard>
                    <DataCard xs={4} header="Game Stats"></DataCard>
                </Grid>
                
        </Container>
    )
}

// export default Dashboard;