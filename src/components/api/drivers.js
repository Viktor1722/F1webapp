// api/fetchDrivers.js
export async function fetchDrivers() {
  const driverUrl = "https://api.openf1.org/v1/drivers";

  try {
    const response = await fetch(driverUrl);

    if (!response.ok) {
      console.error(`API call failed with status: ${response.status}`);
      return [];
    }

    const drivers = await response.json();
    return drivers;
  } catch (error) {
    console.error(`Fetch error:`, error);
    return [];
  }
}
