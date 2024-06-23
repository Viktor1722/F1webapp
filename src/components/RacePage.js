import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import { Loading } from "./Loading";
import { Select } from "./Select";

import {
  fetchDriversAndTires,
  fetchRaceResultsByCircuit,
  fetchQualifyingResultsByCircuit,
  fetchLocationData,
} from "../utils/api";

import { DriverCard } from "./DriverCard";
import { ThreeCanvas } from "./ThreeCanvas.js";
import { LapChart } from "./LapChart";
import { TireStrategy } from "./TireStrategy";

export function RacePage() {
  const { state } = useLocation();
  const { raceName, meetingKey, year, location } = state || {};
  const [drivers, setDrivers] = useState([]);
  const [laps, setLaps] = useState([]);
  const [driversDetails, setDriversDetails] = useState({});
  const [driverSelected, setDriverSelected] = useState(false);
  const [driverCode, setDriverCode] = useState("");
  const [driverNumber, setDriverNumber] = useState("");
  const [driversColor, setDriversColor] = useState({});
  const [startingGrid, setStartingGrid] = useState([]);
  const [animatedMap, setAnimatedMap] = useState("");
  const [MapPath, setMapPath] = useState("");
  const [raceResults, setRaceResults] = useState([]);
  const [locData, setLocData] = useState({});
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [speedFactor, setSpeedFactor] = useState(0.2);
  const [isPaused, setIsPaused] = useState(false);
  const [haloView, setHaloView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState("Race");
  const [hasRaceSession, sethasRaceSession] = useState(false);
  const [hasQualifyingSession, sethasQualifyingSession] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  // console.log(selectedSession);

  const selectedDriverData = drivers.find(
    (obj) => obj["acronym"] === driverCode
  );
  const selectedDriverRaceData = raceResults.find(
    (obj) => obj["number"] === driverNumber
  );

  // console.log(startingGrid)

  useEffect(() => {
    const fetchData = async () => {
      if (!meetingKey) return;

      try {
        setDriverSelected(false);
        setActiveButtonIndex(null);

        const locationMap = {
          Melbourne: "albert_park",
          Austin: "americas",
          Sakhir: "bahrain",
          Baku: "baku",
          Budapest: "hungaroring",
          Imola: "imola",
          "São Paulo": "interlagos",
          Jeddah: "jeddah",
          "Marina Bay": "marina_bay",
          Monaco: "monaco",
          Spielberg: "red_bull_ring",
          "Mexico City": "rodriguez",
          Shanghai: "shanghai",
          Silverstone: "silverstone",
          "Spa-Francorchamps": "spa",
          Suzuka: "suzuka",
          "Las Vegas": "vegas",
          Montréal: "villeneuve",
          Zandvoort: "zandvoort",
          Miami: "miami",
          Monza: "monza",
          Barcelona: "catalunya",
          Lusail: "losail",
          "Yas Island": "yas_marina",
        };

        setIsLoading(true);

        const circuitId = locationMap[location];
        const sessionsResponse = await fetch(
          `https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`
        );
        const sessionsData = await sessionsResponse.json();

        const hasRaceSession = sessionsData.some(
          (session) => session.session_name === "Race"
        );
        sethasRaceSession(hasRaceSession);
        const hasQualifyingSession = sessionsData.some(
          (session) => session.session_name === "Qualifying"
        );
        sethasQualifyingSession(hasQualifyingSession);

        if (selectedSession === "Race") {
          setIsLoading(true);

          setMapPath(
            `${process.env.PUBLIC_URL + "/map/" + circuitId + ".gltf"}`
          );
          setAnimatedMap(
            `${
              process.env.PUBLIC_URL +
              "/mapsAnimated/" +
              circuitId +
              "Animated.mp4"
            }`
          );

          if (circuitId) {
            const results = await fetchRaceResultsByCircuit(year, circuitId);
            setRaceResults(results);
            // console.log(results);
          }

          const raceSession = sessionsData.find(
            (session) => session.session_name === "Race"
          );
          if (!raceSession) throw new Error("Race session not found");
          const sessionKey = raceSession.session_key;

          const [driverDetailsData, startingGridData, driversData, lapsData] =
            await Promise.all([
              fetch(
                `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`
              ).then((res) => res.json()),
              fetch(
                `https://api.openf1.org/v1/position?session_key=${sessionKey}`
              ).then((res) => res.json()),
              fetchDriversAndTires(sessionKey),
              fetch(
                `https://api.openf1.org/v1/laps?session_key=${sessionKey}`
              ).then((res) => res.json()),
            ]);

          const driverDetailsMap = driverDetailsData.reduce(
            (acc, driver) => ({
              ...acc,
              [driver.driver_number]: driver.name_acronym,
            }),
            {}
          );

          setDriversDetails(driverDetailsMap);

          const driverColorMap = driverDetailsData.reduce(
            (acc, driver) => ({
              ...acc,
              [driver.name_acronym]: driver.team_colour,
            }),
            {}
          );

          setDriversColor(driverColorMap);

          const latestDate = startingGridData[0].date;
          const firstDifferentDate = startingGridData.find(
            (item) => item.date !== latestDate
          )?.date;
          const date = new Date(firstDifferentDate);
          date.setMinutes(date.getMinutes() - 1);
          const updatedDate = date.toISOString();

          setStartTime(updatedDate);
          setEndTime(startingGridData[startingGridData.length - 1].date);

          const earliestDateTime = startingGridData[0]?.date;
          const filteredStartingGrid = startingGridData.filter(
            (item) => item.date === earliestDateTime
          );
          setStartingGrid(filteredStartingGrid);

          setDrivers(driversData);

          setLaps(
            lapsData.map((lap) => ({
              ...lap,
              driver_acronym: driverDetailsMap[lap.driver_number],
            }))
          );

          setIsLoading(false);
        } else if (selectedSession === "Qualifying") {
          setIsLoading(true);

          setMapPath(
            `${process.env.PUBLIC_URL + "/map/" + circuitId + ".gltf"}`
          );
          setAnimatedMap(
            `${
              process.env.PUBLIC_URL +
              "/mapsAnimated/" +
              circuitId +
              "Animated.mp4"
            }`
          );

          if (circuitId) {
            const results = await fetchQualifyingResultsByCircuit(
              year,
              circuitId
            );
            setRaceResults(results);
            // console.log(results);
          }

          const raceSession = sessionsData.find(
            (session) => session.session_name === "Qualifying"
          );
          if (!raceSession) throw new Error("Race session not found");
          const sessionKey = raceSession.session_key;

          const [driverDetailsData, startingGridData, driversData, lapsData] =
            await Promise.all([
              fetch(
                `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`
              ).then((res) => res.json()),
              fetch(
                `https://api.openf1.org/v1/position?session_key=${sessionKey}`
              ).then((res) => res.json()),
              fetchDriversAndTires(sessionKey),
              fetch(
                `https://api.openf1.org/v1/laps?session_key=${sessionKey}`
              ).then((res) => res.json()),
            ]);

          const driverDetailsMap = driverDetailsData.reduce(
            (acc, driver) => ({
              ...acc,
              [driver.driver_number]: driver.name_acronym,
            }),
            {}
          );

          setDriversDetails(driverDetailsMap);

          const driverColorMap = driverDetailsData.reduce(
            (acc, driver) => ({
              ...acc,
              [driver.name_acronym]: driver.team_colour,
            }),
            {}
          );

          setDriversColor(driverColorMap);

          const latestDate = startingGridData[0].date;
          const firstDifferentDate = startingGridData.find(
            (item) => item.date !== latestDate
          )?.date;
          const date = new Date(firstDifferentDate);
          date.setMinutes(date.getMinutes() - 1);
          const updatedDate = date.toISOString();

          setStartTime(updatedDate);
          setEndTime(startingGridData[startingGridData.length - 1].date);

          const earliestDateTime = startingGridData[0]?.date;
          const filteredStartingGrid = startingGridData.filter(
            (item) => item.date === earliestDateTime
          );
          setStartingGrid(filteredStartingGrid);

          setDrivers(driversData);

          setLaps(
            lapsData.map((lap) => ({
              ...lap,
              driver_acronym: driverDetailsMap[lap.driver_number],
            }))
          );

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [meetingKey, year, location, selectedSession]);

  const handleDriverSelectionClick = (index) => {
    // console.log(raceResults[index].Driver.code); // Log the driver code
    // console.log(raceResults[index].number);

    if (activeButtonIndex === index) {
      setLocData({});
      setDriverSelected(false);
      setActiveButtonIndex(null); // Reset the active button index
      setDriverCode("");
    } else {
      setLocData({});
      setDriverSelected(true);
      setDriverCode(raceResults[index].Driver.code);
      setDriverNumber(raceResults[index].number);
      setActiveButtonIndex(index); // Set new active button index

      (async () => {
        try {
          // Fetch sessions to find the race session
          const sessionsResponse = await fetch(
            `https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`
          );
          const sessionsData = await sessionsResponse.json();
          const raceSession = sessionsData.find(
            (session) => session.session_name === "Race"
          );
          if (!raceSession) throw new Error("Race session not found");
          const sessionKey = raceSession.session_key;

          const scaleFactor = 1500;

          // Fetch location data using sessionKey, driverId (from state), startTime, and endTime
          const locationData = await fetchLocationData(
            sessionKey,
            raceResults[index].number,
            startTime,
            endTime,
            scaleFactor
          );
          setLocData(locationData);
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      })();
    }
  };

  const getTireCompound = (driverCode, lap) => {
    const driver = drivers.find((d) => d.acronym === driverCode);
    if (driver && driver.tires) {
      for (const tire of driver.tires) {
        if (lap <= tire.lap_end) {
          return tire.compound; // Return the first character of the tire compound
        }
      }
    }
    return "?";
  };

  return isLoading ? (
    <Loading
      className="mt-[20rem] mb-[20rem]"
      message={`Loading ${raceName} ${year} ${selectedSession}`}
    />
  ) : (
    <body className="">
      <div className="pt-[10rem]">
        <div className="flex flex-col items-center justify-center mb-32">
          {raceName && (
            <p className="heading-2 text-center text-neutral-400 mb-8">
              {raceName} {year}
            </p>
          )}
          <Select
            className="w-fit"
            label="Select Session"
            onChange={handleOptionChange}
            value={selectedSession}
          >
            {hasRaceSession && <option value="Race">Race</option>}
            {hasQualifyingSession && (
              <option value="Qualifying">Qualifying</option>
            )}
          </Select>
        </div>

        {selectedSession === "Race" && (
          <>
            <div className="race-display mb-64 relative">
              <ul className="flex flex-col absolute top-1 left-1 z-10">
                {raceResults.map((result, index) => (
                  <button
                    key={index}
                    className="block w-full mb-2 relative "
                    onClick={() => handleDriverSelectionClick(index)}
                  >
                    <DriverCard
                      hasHover
                      isActive={activeButtonIndex === index}
                      index={index}
                      driver={result.Driver}
                      driverColor={driversColor[driverCode]}
                      startPosition={parseInt(result.grid, 10)}
                      endPosition={parseInt(result.position, 10)}
                      year={year}
                      time={result.Time?.time || result.status}
                      fastestLap={result.FastestLap}
                      layoutSmall={index > 2}
                      mobileSmall
                    />
                  </button>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="page-container-centered flex flex-col justify-center sm:flex-row mt-32 mr-12">
          {selectedSession === "Race" && (
            <div className="sm:w-[26rem]">
              {driverSelected && (
                <div className="mb-32">
                  <div className="flex items-end relative">
                    <img
                      alt=""
                      src={`${
                        process.env.PUBLIC_URL +
                        "/images/" +
                        year +
                        "/drivers/" +
                        selectedDriverData.acronym +
                        ".png"
                      }`}
                      width={120}
                      height={120}
                      className="-ml-8"
                    />
                    <img
                      alt=""
                      className="absolute -bottom-16 left-32"
                      src={`${
                        process.env.PUBLIC_URL +
                        "/images/" +
                        year +
                        "/cars/" +
                        selectedDriverRaceData.Constructor.constructorId +
                        ".png"
                      }`}
                      width={150}
                    />
                    <div className="-ml-32 w-full">
                      <h3 className="tracking-xs text-sm uppercase gradient-text-medium -mb-8">
                        {selectedDriverData.first_name}
                      </h3>
                      <h3 className="font-display gradient-text-light text-[2rem]">
                        {selectedDriverData.last_name}
                      </h3>
                      <p className="font-display gradient-text-dark text-[6.4rem] mr-16 leading-none text-right">
                        {selectedDriverData.driver_number}
                      </p>
                    </div>
                  </div>
                  <div className="  px-24 pt-24 pb-24 rounded-xlarge">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="uppercase tracking-xs text-xs">
                          Finshed
                        </div>
                        <div>
                          <span className="font-display text-[3.2rem]">
                            {selectedDriverRaceData.position}
                          </span>
                          <span className="uppercase tracking-xs text-xs ml-4">
                            {selectedDriverRaceData.status === "Finished"
                              ? selectedDriverRaceData.Time.time
                              : selectedDriverRaceData.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="uppercase tracking-xs text-xs">
                          Started
                        </div>
                        <div className="font-display text-[3.2rem]">
                          {selectedDriverRaceData.grid}
                        </div>
                      </div>
                    </div>

                    <div className="divider-glow-dark mt-16 mb-10" />

                    <p className="font-display text-center mb-16 ml-24">
                      fastest lap
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="uppercase tracking-xs text-xs">
                          Time
                        </div>
                        <div className="font-display">
                          {selectedDriverRaceData.FastestLap.Time.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="uppercase tracking-xs text-xs">Lap</div>
                        <div className="font-display">
                          {selectedDriverRaceData.FastestLap.lap}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-16">
                      <div>
                        <div className="uppercase tracking-xs text-xs">
                          avg speed
                        </div>
                        <div>
                          <span className="font-display">
                            {
                              selectedDriverRaceData.FastestLap.AverageSpeed
                                .speed
                            }
                          </span>
                          <span className="uppercase tracking-xs text-xs">
                            {
                              selectedDriverRaceData.FastestLap.AverageSpeed
                                .units
                            }
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="uppercase tracking-xs text-xs">
                          Rank
                        </div>
                        <div className="font-display">
                          {selectedDriverRaceData.FastestLap.rank}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <h3 className="heading-4 mb-16 text-neutral-400 ml-24"></h3>
            </div>
          )}

          <div className="sm:grow-0">
            <LapChart
              laps={laps}
              setLaps={() => setLaps}
              driversDetails={driversDetails}
              driversColor={driversColor}
              raceResults={raceResults}
              className="lap-chart"
              driverCode={driverSelected ? driversDetails[driverNumber] : null}
            />
            <TireStrategy
              drivers={drivers}
              raceResults={raceResults}
              driverCode={driverSelected ? driversDetails[driverNumber] : null}
              driverColor={driversColor[driverCode]}
            />
            {!driverSelected && selectedSession === "Race" && (
              <>
                <h3 className="heading-4 mb-16 mt-32 text-neutral-400 ml-24">
                  Fastest Laps
                </h3>
                <div className=" h-fit p-32 mb-16 rounded-xlarge">
                  <div className="grid grid-cols-4 gap-4 mb-16 text-neutral-400">
                    <span className="tracking-xs uppercase">Driver</span>
                    <span className="tracking-xs uppercase text-left">
                      Time
                    </span>
                    <span className="tracking-xs uppercase text-center">
                      Lap
                    </span>
                    <span className="tracking-xs uppercase text-right">
                      Tyre
                    </span>
                  </div>

                  <ul>
                    {raceResults
                      .filter(
                        (result) => result.FastestLap && result.FastestLap.rank
                      )
                      .sort(
                        (a, b) =>
                          parseInt(a.FastestLap.rank) -
                          parseInt(b.FastestLap.rank)
                      )
                      .map((result, index) => (
                        <React.Fragment key={index}>
                          <li
                            key={index}
                            className="grid grid-cols-4 gap-4 mb-8"
                          >
                            <div>
                              <span className="font-display">
                                {result.Driver.code}
                              </span>
                              <span className="text-sm ml-8 text-neutral-400 tracking-xs max-sm:hidden">
                                {result.Constructor.name}
                              </span>
                            </div>
                            <span className="text-left">
                              {result.FastestLap.Time.time}
                            </span>
                            <span className="text-center">
                              {result.FastestLap.lap}
                            </span>
                            <span className="text-right">
                              {getTireCompound(
                                result.Driver.code,
                                result.FastestLap.lap,
                                drivers
                              )}
                            </span>
                          </li>
                          <div className="divider-glow-medium" />
                        </React.Fragment>
                      ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </body>
  );
}
