import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Autocomplete,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LineChart from "../components/LineChart";
import { processStockData } from "../helper/helper";
import _ from "lodash";
import clsx from "clsx";

const useStyles = makeStyles({
  sections: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 12,
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  paperRoot: {
    backgroundColor: "#FFF !important",
  },
  search: {
    minWidth: 80,
  },
  chart: {
    display: "flex",
    justifyContent: "center",
    marginTop: 32,
  },
  title: {
    color: "#f0b90b",
    marginTop: 0,
    marginBottom: 2,
    display: "flex",
    justifyContent: "center",
  },
  graphTitle: {
    color: "#f0b90b",
    marginTop: 0,
    marginBottom: 2,
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto",
  },
  input: {
    color: "white",
    fontFamily: "Roboto",
  },
  buttons: {
    marginRight: 8,
    marginLeft: 8,
  },
  graphSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 12,
  },
});

let timeout;

function Home() {
  const classes = useStyles();

  const [data, setData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [recordsToFilter, setRecordsToFilter] = useState(null);
  const [hasFetchError, setHasFetchError] = useState(false);
  const [graphTitle, setGraphTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const graphData = processStockData(data?.["Time Series (Daily)"]);
    if (graphData)
      setStockData({ source: graphData, filteredStockData: graphData });
  }, [data]);

  useState(() => {
    if (!_.isEmpty(stockData)) {
      setRecordsToFilter(stockData.filteredStockData);
    }
  }, [recordsToFilter]);

  const handleSearch = async (symbol) => {
    try {
      const res = await fetch(
        `https://sleepy-everglades-14883.herokuapp.com/https://alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=A3U8E3F7N3A85K86`
      ).then((res) => res.json());

      // check response
      if (Object.keys(res).includes("Error Message")) {
        setHasFetchError(true);
        setErrorMessage("Please enter a valid stock symbol");
      } else if (Object.keys(res).includes("Note")) {
        setHasFetchError(true);
        setErrorMessage("API has been exhausted, please give it a minute...");
      } else {
        console.log({ res });
        const stockSymbol = res["Meta Data"]["2. Symbol"];

        setHasFetchError(false);
        setData(res);
        setGraphTitle(`Monthly stock data for ${stockSymbol}`);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const handleChange = (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => handleSearch(e.target.value), 500);
  };

  const handleFilter = (number) => {
    const filteredStock = stockData.source.slice(
      stockData.source.length - number
    );
    setStockData({
      source: stockData.source,
      filteredStockData: filteredStock,
    });
  };

  return (
    <Paper
      className={classes.paper}
      classes={{ root: classes.paperRoot }}
      elevation={3}
    >
      <div className={classes.sections}>
        <Typography
          gutterBottom
          classes={{ root: classes.graphTitle }}
          variant={"h6"}
        >
          Search
        </Typography>
      </div>
      <div className={classes.sections}>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <ShowChartIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <Autocomplete
            className={classes.search}
            freeSolo
            disableClearable
            options={[].map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                id="input-with-sx"
                label=""
                variant="standard"
                inputProps={{
                  ...params.inputProps,
                  type: "search",
                  style: { textAlign: "center" },
                }}
                InputProps={{
                  classes: {
                    Input: classes.input,
                  },
                }}
                onChange={handleChange}
                error={hasFetchError}
                helperText={hasFetchError ? errorMessage : ""}
              />
            )}
          />
        </Box>
      </div>

      {stockData && !hasFetchError && (
        <div className={clsx(classes.sections, classes.buttons)}>
          <Button
            classes={{ root: classes.buttons }}
            variant="outlined"
            onClick={() => handleFilter(6)}
          >
            6 months
          </Button>
          <Button
            style={{ outlined: classes.buttons }}
            variant="outlined"
            onClick={() => handleFilter(12)}
          >
            1 year
          </Button>
          <Button
            sx={{ root: classes.buttons }}
            classes={{ root: classes.buttons }}
            variant="outlined"
            onClick={() => handleFilter(stockData.source.length)}
          >
            Lifetime
          </Button>
        </div>
      )}

      <div className={classes.chart}>
        {stockData && !hasFetchError && (
          <div className={classes.graphSection}>
            <Typography
              gutterBottom
              classes={{ root: classes.graphTitle }}
              variant={"subtitl1"}
            >
              {graphTitle}
            </Typography>
            <LineChart data={stockData.filteredStockData} />
          </div>
        )}
      </div>
    </Paper>
  );
}

export default Home;
