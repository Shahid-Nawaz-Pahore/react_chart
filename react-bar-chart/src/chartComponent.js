import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { TextField, Box } from "@mui/material";
import dayjs from "dayjs";

const sampleData = {
  categories: {
    "2019-01-23 00:00:00": "B",
    "2019-01-09 00:00:00": "B",
    "2018-10-01 00:00:00": "A",
  },
};

const ChartComponent = () => {
  const [pickedDate, setPickedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const formatData = () => {
    const categories = sampleData.categories;
    const dates = Object.keys(categories).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const now = new Date();
    const data = [];
    let prevDate = now;

    dates.forEach((dateStr, index) => {
      const date = new Date(dateStr);

      // Avoid adding invalid dates
      if (isNaN(date.getTime())) return;

      data.push({
        start: prevDate.getTime(),
        end: date.getTime(),
        label: categories[dateStr],
        key: `bar-${index}-${categories[dateStr]}`, // Ensure unique keys
      });

      prevDate = date;
    });

    // Final data point
    data.push({
      start: prevDate.getTime(),
      end: now.getTime(), // Use current time as the end for the last interval
      label: categories[dates[dates.length - 1]],
      key: `bar-last-${categories[dates[dates.length - 1]]}`, // Ensure unique key for the last bar
    });

    return data;
  };

  const formattedData = formatData();

  const pickedDateObj = dayjs(pickedDate);
  const twoWeeksBefore = pickedDateObj.subtract(2, "week").format("YYYY-MM-DD");
  const fourteenWeeksBefore = pickedDateObj
    .subtract(14, "week")
    .format("YYYY-MM-DD");

  return (
    <Box p={2}>
      <TextField
        label="Pick a Date"
        type="date"
        value={pickedDate}
        onChange={(e) => setPickedDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <BarChart
        width={1000}
        height={400}
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="start"
          type="number"
          domain={["auto", "auto"]}
          scale="time"
          tickFormatter={(tick) => dayjs(tick).format("YYYY-MM-DD")}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="label" fill="#8884d8" />
        <ReferenceLine
          x={new Date(pickedDate).getTime()}
          stroke="red"
          label="Picked Date"
        />
        <ReferenceLine
          x={new Date(twoWeeksBefore).getTime()}
          stroke="orange"
          label="2 Weeks Before"
        />
        <ReferenceLine
          x={new Date(fourteenWeeksBefore).getTime()}
          stroke="yellow"
          label="14 Weeks Before"
        />
      </BarChart>
    </Box>
  );
};

export default ChartComponent;
