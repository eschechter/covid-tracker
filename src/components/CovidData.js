import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const options = {
  scales: {
    xAxes: [
      {
        ticks: {
          min: 0,
        },
        type: "time",
        time: {
          unit: "week",
        },
      },
    ],
  },
};

const initData = {
  labels: [],
  datasets: [
    {
      label: "New Covid-19 cases",
      fill: false,
      lineTension: 0.5,
      backgroundColor: "rgba(75,192,192,1)",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 2,
      data: [],
    },
  ],
};

export default function CovidData(props) {
  const [covidData, setCovidData] = useState(initData);
  const [dataType, setDataType] = useState("positiveIncrease");

  function toggleDataType() {
    if (dataType === "positiveIncrease") {
      setDataType("positive");
    } else {
      setDataType("positiveIncrease");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.covidtracking.com/v1/states/${props.abbr}/daily.json`;
      const res = await fetch(url);
      const days = await res.json();
      const newData = {
        labels: days
          .map((d) => {
            const date = String(d.date);
            const strDate = `${date.substr(0, 4)}-${date.substr(
              4,
              2
            )}-${date.substr(6, 2)}`;
            return strDate;
          })
          .reverse(),
        datasets: [
          {
            label:
              dataType === "positive"
                ? "Cumulative Covid-19 cases"
                : "New Covid-19 cases",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(255,0,0,1)",
            borderColor: "rgba(0,0,0,1)",
            borderWidth: 2,
            data: days.map((d) => d[dataType]).reverse(),
          },
        ],
      };
      setCovidData(newData);
    };
    fetchData();
  }, [props.abbr, dataType]);

  return (
    <div className={"graph"}>
      <p>State: {props.abbr}</p>
      <button onClick={toggleDataType}>Toggle data type</button>
      <Line options={options} data={covidData}></Line>
    </div>
  );
}
