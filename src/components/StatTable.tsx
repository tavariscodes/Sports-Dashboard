import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface Stat {
    season: string;
    gp: string;
    min: string;
    ast: string;
    pts: string;
    fgPct: string;
}

interface StatTableProps {
    stats: Stat[]
}

const StatTable = ({stats}: StatTableProps ) => {
    const cellComponents = stats.map((stat, i) => {
        return(<TableRow
        key={stat.season}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}

        >
        <TableCell component="th" scope="row">
          {stat.season}
          </TableCell>
          <TableCell align="center">{stat.pts}</TableCell>
          <TableCell align="center">{stat.ast}</TableCell>
          <TableCell align="center">{stat.ast}</TableCell> {/*change to rebound */}
          <TableCell align="center">{stat.fgPct}</TableCell>
          <TableCell align="center">{stat.min}</TableCell>
        </TableRow>)
      })
    return (
        <TableContainer component={Paper} style={{overflow: "hidden", backgroundColor: '#E57373'}} >
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Season</TableCell>
                <TableCell align="center">PPG</TableCell>
                <TableCell align="center">APG</TableCell>
                <TableCell align="center">RPG</TableCell>
                <TableCell align="center">FG%</TableCell>
                <TableCell align="center">MIN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
                {cellComponents[cellComponents.length - 1]}
                {cellComponents[cellComponents.length - 2]}
                {/* {cellComponents[cellComponents.length - 3]}
                {cellComponents[cellComponents.length - 4]} */}

            </TableBody>
          </Table>
        </TableContainer>
      );
}

export default StatTable;