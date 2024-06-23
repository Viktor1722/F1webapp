export async function fetchLastRaceDetails(year) {
  try {
    const raceUrl = `https://ergast.com/api/f1/${year}/last/results.json`;
    const response = await fetch(raceUrl);

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    const race = data.MRData.RaceTable.Races[0];

    const results = race.Results.map((result) => ({
      driver: {
        driverId: result.Driver.driverId,
        givenName: result.Driver.givenName,
        familyName: result.Driver.familyName,
        time: result.Time ? result.Time.time : "N/A",
      },
      constructor: result.Constructor.name,
      position: result.position,
    }));

    return {
      raceName: race.raceName,
      date: race.date,
      location: race.Circuit.Location.locality,
      results,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
