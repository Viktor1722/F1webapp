// api/fetchLapData.js
export const fetchLapData = async (id, year) => {
  const fetchAllLaps = async (page = 1, collectedLaps = []) => {
    const lapsUrl = `https://ergast.com/api/f1/${year}/${id}/laps.json?limit=200&offset=${
      (page - 1) * 200
    }`;

    try {
      const response = await fetch(lapsUrl);

      if (!response.ok) {
        console.error(
          `API call failed for round ${id} with status: ${response.status}`
        );
        return [];
      }

      const data = await response.json();
      const races = data.MRData.RaceTable.Races;

      if (races.length > 0) {
        const race = races[0];
        const laps = race.Laps.map((lap) =>
          lap.Timings.map((timing) => ({
            lapNumber: lap.number,
            driverId: timing.driverId,
            position: timing.position,
            time: timing.time,
          }))
        ).flat();

        const newCollectedLaps = collectedLaps.concat(laps);

        const totalLaps = parseInt(data.MRData.total, 10);
        const currentLapCount = newCollectedLaps.length;

        if (currentLapCount < totalLaps) {
          return fetchAllLaps(page + 1, newCollectedLaps);
        } else {
          return newCollectedLaps;
        }
      } else {
        console.log(`No data for round ${id}`);
        return [];
      }
    } catch (error) {
      console.error(`Fetch error for round ${id}:`, error);
      return [];
    }
  };

  return fetchAllLaps();
};
