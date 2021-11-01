import _ from "lodash";

export const processStockData = (stockData) => {
  if (stockData) {
    const rawStocks = Object.entries(stockData);
    const processedStocks = rawStocks
      .map((ds) => {
        return {
          date: ds[0],
          high: ds[1]["1. open"],
          low: ds[1]["3. low"],
          average: parseFloat(
            (parseFloat(ds[1]["1. open"], 10) +
              parseFloat(ds[1]["3. low"], 10)) /
              2
          ).toFixed(4),
        };
      })
      .reverse((ds) => ds.date);

    const stockInMonths = daysToMonths(processedStocks);

    return stockInMonths;
  } else return null;
};

const removeDay = (date) => {
  return date.substring(0, 7);
};

const daysToMonths = (data) => {
  const flatten = data.reduce((acc, cur) => {
    const month = removeDay(cur.date);
    const result = { ...acc, [month]: [...(acc[month] || []), cur.high] };
    return result;
  }, []);

  const monthlyStockData = Object.entries(flatten);

  const processedStocks = monthlyStockData.map((t) => {
    return {
      month: t[0],
      high: _.max(t[1]),
      low: _.min(t[1]),
      average: parseFloat(
        t[1].reduce((acc, curr) => {
          return parseFloat(acc, 10) + parseFloat(curr, 10);
        }, 0) / t[1].length
      ).toFixed(4),
    };
  });

  return processedStocks;
};
