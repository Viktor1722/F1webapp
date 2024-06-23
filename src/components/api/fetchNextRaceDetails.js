export async function fetchNextRaceDetails(year) {
  try {
    const raceUrl = `https://ergast.com/api/f1/${year}.json`;
    const response = await fetch(raceUrl);

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    const races = data.MRData.RaceTable.Races;

    // Assuming you want to get the next race based on current date
    const currentDate = new Date();
    const nextRace = races.find((race) => new Date(race.date) > currentDate);

    if (!nextRace) {
      throw new Error("No upcoming races found");
    }

    return {
      raceName: nextRace.raceName,
      date: nextRace.date,
      time: nextRace.time, // Added time
      trackName: nextRace.Circuit.circuitName,
      country: nextRace.Circuit.Location.country,
      locality: nextRace.Circuit.Location.locality,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
