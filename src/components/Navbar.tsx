import React from 'react';
import {
    Switch,
    Route,
    Link
} from "react-router-dom";

import { 
    makeStyles, 
    Tabs,
    Tab,
    Box,
    Typography, 
    Icon
} from '@material-ui/core';

import AssessmentIcon from '@material-ui/icons/Assessment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CodeIcon from '@material-ui/icons/Code';
import SettingsIcon from '@material-ui/icons/Settings';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';




function a11yProps(index: any) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  
const useStyles = makeStyles({
    root: {
        display: 'flex',
        backgroundColor: 'white',
        height: '100vh'
    },
    labelContainer: {
        width: "auto",
        padding: 0
      },
      iconLabelWrapper: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignContent: 'center'
      },
    tabs: {
        borderRight: `1px solid black`,
        alignSelf: 'space-betweeen'
    }
})

const Navbar: React.FC = () => {
    const routes = ['/dashboard', '/profile'];
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = React.useState(0);
    

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };
    return(
        <>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    value={selectedTab}
                    onChange={handleChange}
                    aria-label="Vertical tabs"
                    className={classes.tabs}
                >
                    <Tab 
                        label="Dashboard" {...a11yProps(0)} 
                        icon={<AssessmentIcon/>} />
                    <Tab 
                        label="Profile" {...a11yProps(1)} 
                        icon={<AccountCircleIcon/>} />
                    <Tab label="Developer" {...a11yProps(2)} icon={<CodeIcon/>} />
                    <Tab label="Settings" {...a11yProps(3)} icon={<SettingsIcon/>} />
                </Tabs>
            </div>
            {selectedTab === 0 && <Dashboard/> }
            {selectedTab === 1 && <Profile/>}
        </>
    )
}

export default Navbar