// api/fetchRaceById.js
export const fetchRaceById = async (id) => {
  const year = 2024;
  const raceUrl = `https://ergast.com/api/f1/${year}/${id}/results.json`;

  try {
    const response = await fetch(raceUrl);

    if (!response.ok) {
      console.error(
        `API call failed for round ${id} with status: ${response.status}`
      );
      return null;
    }

    const data = await response.json();
    const races = data.MRData.RaceTable.Races;

    if (races.length > 0) {
      const race = races[0];

      const grid = race.Results.map((result, index) => ({
        driver: {
          driverId: result.Driver.driverId,
          givenName: result.Driver.givenName,
          familyName: result.Driver.familyName,
          name_acronym: result.Driver.code,
          time: result.Time ? result.Time.time : "N/A",
          timeDifference:
            index === 0 ? "N/A" : result.Time ? result.Time.time : "N/A",
        },
        constructor: result.Constructor.name,
        position: result.position,
      }));

      return {
        raceName: race.raceName,
        date: race.date,
        location: race.Circuit.Location.locality,
        round: race.round,
        grid,
      };
    } else {
      console.log(`No data for round ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Fetch error for round ${id}:`, error);
    return null;
  }
};
