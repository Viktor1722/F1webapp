import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import { ReactComponent as Logo } from "./f1_logo 1.svg";
import { Select } from "./Select";

import { RaceSelector } from "./RaceSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Header = (props) => {
  const { setSelectedYear, selectedYear, currentYear } = props;

  const [navOpen, setNavOpen] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [subNavOpen, setSubNavOpen] = useState(false);
  const [page, setPage] = useState("Home");
  const [pagePath, setpagePath] = useState("/");
  const [races, setRaces] = useState([]);
  const [isRaceSelected, setIsRaceSelected] = useState(false);

  const navRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setNavOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [headerRef]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setSubNavOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [navRef]);

  useEffect(() => {
    const handleResize = () => {
      setIsLarge(window.innerWidth > 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect(() => {
  //     const fetchRaces = async () => {
  //     const response = await fetch(`https://api.openf1.org/v1/meetings?year=${selectedYear}`);
  //     if (response.ok) {
  //         const data = await response.json();
  //         setRaces(data);
  //     }
  //     };

  //     fetchRaces();
  // }, [selectedYear]);

  useEffect(() => {
    const fetchRacesAndSessions = async () => {
      try {
        // Fetch races
        const racesResponse = await fetch(
          `https://api.openf1.org/v1/meetings?year=${selectedYear}`
        );
        if (!racesResponse.ok) {
          throw new Error("Failed to fetch races");
        }
        const racesData = await racesResponse.json();

        // Fetch sessions
        const sessionsResponse = await fetch(
          `https://api.openf1.org/v1/sessions?year=${selectedYear}&session_name=Race`
        );
        if (!sessionsResponse.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const sessionsData = await sessionsResponse.json();

        // Filter races based on meeting_key presence in sessions
        const filteredRaces = racesData.filter((race) =>
          sessionsData.some(
            (session) => session.meeting_key === race.meeting_key
          )
        );

        setRaces(filteredRaces);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRacesAndSessions();
  }, [selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const generateYears = (startYear) => {
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  // console.log({page})

  const handleNavLinkClick = (page) => {
    setSubNavOpen(false);
    setNavOpen(false);
    setPage(page);

    if (page === "Race Results") {
      setpagePath("/race-results");
    } else if (page === "Constructor Standings") {
      setpagePath("/constructor-standings");
    } else if (page === "Home") {
      setpagePath("/");
    } else {
      setpagePath("/driver-standings");
    }

    setIsRaceSelected(false);
  };

  return (
    <header className="global-header" ref={headerRef}>
      <div className="global-header__main-nav shadow-lg   backdrop-blur-sm">
        <div className="global-header__main-nav__left">
          <div className="flex flex-col items-center w-[50px] mr-40">
            <a href="/">
              <Logo height={30} onClick={() => handleNavLinkClick("Home")} />
            </a>
          </div>
          <div className="flex items-center gap-8">
            {(navOpen || isLarge) && (
              <Select
                label="Year"
                value={selectedYear}
                onChange={handleYearChange}
              >
                {generateYears(2023).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            )}
            <button
              className={classNames(
                "shadow-lg bg-zinc-900 py-[1.2rem] px-16 border-[1px] border-solid border-neutral-800 rounded-md",
                { hidden: isLarge }
              )}
              onClick={() => setNavOpen(!navOpen)}
            >
              {!navOpen ? (
                <FontAwesomeIcon icon="bars" />
              ) : (
                <FontAwesomeIcon icon="xmark" />
              )}
            </button>
          </div>
        </div>

        {(navOpen || isLarge) && (
          <div className="global-header__main-nav__right flex max-sm:flex-col">
            <button
              className="select select--style-for-button text-left max-md:w-full"
              onClick={(e) => {
                e.stopPropagation();
                setSubNavOpen(!subNavOpen);
              }}
            >
              <div className="select__input bg-zinc-900 bg-neutral-800/10 leading-none min-w-[18rem]">
                {isRaceSelected || page === "Home" ? "---" : page}
              </div>
              <div className="select__label tracking-xs uppercase">
                Season Standings
              </div>
              <FontAwesomeIcon
                icon="caret-down"
                className="select__icon text-neutral-400 fa-lg"
              />
            </button>
            <RaceSelector
              races={races}
              selectedYear={selectedYear}
              setIsRaceSelected={setIsRaceSelected}
              isRaceSelected={isRaceSelected}
              pagePath={pagePath}
              page={page}
            />
          </div>
        )}
      </div>

      <nav
        className="global-header__sub-nav text-center flex justify-center
                    border-b-2 border-neutral-800 bg-neutral-900/90 backdrop-blur-sm shadow-xl
                    ease-in-out duration-300 uppercase tracking-xs"
        style={{
          opacity: subNavOpen ? "1" : "0",
          pointerEvents: subNavOpen ? "initial" : "none",
          height: subNavOpen ? "inherit" : "1rem",
        }}
        ref={navRef}
      >
        <NavLink
          activeclassname="active"
          className="navLink"
          to="/race-results"
          onClick={() => handleNavLinkClick("Race Results")}
        >
          Race Results
        </NavLink>
        <NavLink
          activeclassname="active"
          className="navLink"
          to="/constructor-standings"
          onClick={() => handleNavLinkClick("Constructor Standings")}
        >
          Constructor Standings
        </NavLink>
        <NavLink
          activeclassname="active"
          className="navLink"
          to="/driver-standings"
          onClick={() => handleNavLinkClick("Driver Standing")}
        >
          Driver Standings
        </NavLink>
      </nav>
    </header>
  );
};
