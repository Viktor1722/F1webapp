// pages/api/positions.js

export default async function handler(req, res) {
  // Extract query parameters from the request
  const { meeting_key, driver_number, max_position } = req.query;

  // Construct the API URL with the provided query parameters
  const apiUrl = `https://api.openf1.org/v1/position?meeting_key=${meeting_key}&driver_number=${driver_number}&position<=${max_position}`;

  try {
    // Fetch data from the external API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from the API" });
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data as JSON
    res.status(200).json(data);
  } catch (error) {
    // Handle any errors that occurred during the fetch
    res.status(500).json({ error: "Internal Server Error" });
  }
}
