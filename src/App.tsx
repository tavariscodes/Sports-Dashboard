import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      {/* <title>Sports Dashboard</title> */}
      <MainLayout >
        {/* <Switch>
          <Route path="/dashboard" component={Dashboard}/>
        </Switch> */}
        {/* Connect switch later */}
      </MainLayout>
    </Router>
  );
}

export default App;
