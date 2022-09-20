import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import { ThemeProvider, createTheme } from "@mui/material/styles";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import MainLayout from './components/MainLayout';

// declare module '@mui/material/styles' {
//   interface Theme {
//     palette: {
//       primary: {
//         main: string,
//       }
//     }
   
//   }

//   interface ThemeOptions {
//     palette: {
//       primary: {
//         main: string,
//       }
//     }
//   }
// }

const theme = createTheme({
  palette: {
      primary: {
          main:'#E57373',
          light: '#FFA4A2',
          dark: '#AF4448'
      },
      secondary: {
        main: '#CC2626',
        light: '#FF5E50',
        dark: '#930000'
      }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout >
          {/* <Switch>
            <Route path="/dashboard" component={Dashboard}/>
          </Switch> */}
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
