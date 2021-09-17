import React from 'react';
import {
    Switch,
    Route,
    Link
} from "react-router-dom";

import { 
    Tabs,
    Tab,
    Box,
    Typography, 
    Icon,
    Theme
} from '@mui/material';

import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import { useTheme,  } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';


const a11yProps = (index: any) => {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
}
const styles = {
    tabText: {
        color: 'white',
    }
}  

const useStyles = makeStyles( (theme: Theme) => ({
    root: {
        display: 'flex',
        backgroundColor:  theme.palette.secondary.dark ,

        height: '100vh'
    },
    labelContainer: {
        width: "auto",
        padding: 0,

      },
      iconLabelWrapper: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        
        alignContent: 'center',
      },
    tabs: {
        borderRight: `1px solid black`,
        alignSelf: 'space-betweeen',
    },
    tabText: {
        color: 'white',
    }
}))

const Navbar: React.FC = () => {
    const routes = ['/dashboard', '/profile'];
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = React.useState(0);
    

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };
    return(
        <>
            <div  className={classes.root}>
                <Tabs
                    orientation="vertical"
                    value={selectedTab}
                    onChange={handleChange}
                    aria-label="Vertical tabs"
                    className={classes.tabs}
                >
                    <Tab 
                        label="Dashboard" {...a11yProps(0)} 
                        style={styles.tabText}
                        icon={<AssessmentIcon/>} />
                    <Tab 
                        label="Profile" {...a11yProps(1)} 
                        style={styles.tabText}
                        icon={<AccountCircleIcon/>} />
                    <Tab label="Developer" style={styles.tabText} {...a11yProps(2)} icon={<CodeIcon/>} />
                    <Tab label="Settings" style={styles.tabText} {...a11yProps(3)} icon={<SettingsIcon/>} />
                </Tabs>
            </div>
            {selectedTab === 0 && <Dashboard/> }
            {selectedTab === 1 && <Profile/>}
        </>
    )
}

export default Navbar