import React, { useState, useEffect } from "react";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { PolygonLayer } from "@deck.gl/layers";
import { stateData } from "../helpers/generateStateContours";

function CovidMap(props) {
  const [data, setData] = useState(stateData);
  const [dataType, setDataType] = useState("positive");

  function toggleDataType() {
    if (dataType === "positiveIncrease") {
      setDataType("positive");
    } else {
      setDataType("positiveIncrease");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const infectionRates = {};
      let worstInfectionRate = 0;
      for (let ele of stateData) {
        const res = await fetch(
          `https://api.covidtracking.com/v1/states/${ele.name}/current.json`
        );
        const resObj = await res.json();
        const infectionRate = resObj[dataType] / ele.pop;
        if (infectionRate > worstInfectionRate) {
          worstInfectionRate = infectionRate;
        }
        infectionRates[ele.name] = infectionRate;
      }
      const newData = [];
      for (let ele of stateData) {
        const newOtherColors =
          255 * (1 - infectionRates[ele.name] / worstInfectionRate);
        newData.push({ ...ele, color: [255, newOtherColors, newOtherColors] });
      }
      console.log(newData);
      setData(newData);
    };
    fetchData();
  }, [dataType]);

  const viewport = {
    latitude: 39.0119,
    longitude: -98.4842,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  };

  return (
    <>
      <button onClick={toggleDataType}>Toggle data type</button>
      <p>
        {dataType === "positive"
          ? "Cumulative Covid-19 cases"
          : "New Covid-19 cases"}
      </p>
      <div className={"CovidMap"}>
        <DeckGL
          height={"50%"}
          width={"90%"}
          layers={[
            new PolygonLayer({
              id: "poly-layers",
              data: data,
              getPolygon: (d) => d.contours,
              getFillColor: (d) => d.color,
              lineWidthMinPixels: 1,
              getLineColor: [0, 0, 0],
              getLineWidth: 250,
              opacity: 0.5,
              pickable: true,
              onClick: (info, _) => props.clickHandler(info.object.name),
            }),
          ]}
          initialViewState={viewport}
          controller={true}
        >
          <StaticMap
            mapboxApiAccessToken={
              "pk.eyJ1IjoiZXNjaGVjaHRlciIsImEiOiJjanp2ZHltdHowa3gxM2hwNG5wcTIzd3N1In0.cFNxF0BjtiRL_VZNdEx40g"
            }
          />
        </DeckGL>
      </div>
    </>
  );
}

export default CovidMap;
