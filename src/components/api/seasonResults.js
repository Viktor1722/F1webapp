import { fetchDrivers } from "./drivers";

export async function fetchAllRaceResults(year) {
  const raceResults = [];
  const drivers = await fetchDrivers();

  const getDriverHeadshot = (driverId) => {
    if (!driverId) return null;

    if (driverId === "max_verstappen") {
      return "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png";
    }
    console.log(`Fetching headshot for driverId: ${driverId}`);
    const driver = drivers.find(
      (d) => d.last_name && d.last_name.toLowerCase() === driverId.toLowerCase()
    );
    console.log(`Found driver: ${driver ? driver.last_name : "not found"}`);
    return driver ? driver.headshot_url : null;
  };

  for (let round = 1; round <= 24; round++) {
    const raceUrl = `https://ergast.com/api/f1/${year}/${round}/results.json`;

    try {
      const response = await fetch(raceUrl);

      if (!response.ok) {
        console.error(
          `API call failed for round ${round} with status: ${response.status}`
        );
        continue;
      }

      const data = await response.json();
      const races = data.MRData.RaceTable.Races;

      if (races.length > 0) {
        const race = races[0];

        const topThree = race.Results.slice(0, 3).map((result, index) => {
          const headshot_url = getDriverHeadshot(
            result.Driver.driverId.toLowerCase()
          );

          return {
            driver: {
              driverId: result.Driver.driverId,
              givenName: result.Driver.givenName,
              familyName: result.Driver.familyName,
              name_acronym: result.Driver.code,
              time: result.Time ? result.Time.time : "N/A",
              timeDifference:
                index === 0 ? "N/A" : result.Time ? result.Time.time : "N/A",
              headshot_url: headshot_url,
            },
            constructor: result.Constructor.name,
            position: result.position,
          };
        });

        raceResults.push({
          raceName: race.raceName,
          date: race.date,
          location: race.Circuit.Location.locality,
          round: race.round,
          topThree,
        });
      } else {
        console.log(`No data for round ${round}`);
      }
    } catch (error) {
      console.error(`Fetch error for round ${round}:`, error);
    }
  }

  return raceResults;
}
