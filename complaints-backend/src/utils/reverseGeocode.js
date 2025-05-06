const axios = require("axios");

const reverseGeocode = async (lat, lng) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;
    if (results.length > 0) {
      return results[0].formatted_address;
    } else {
      return "Unknown location";
    }
  } catch (error) {
    console.error("Reverse Geocoding failed:", error.message);
    return "Location fetch error";
  }
};

module.exports = reverseGeocode;

// ✅ Test block – run this file directly: node utils/reverseGeocode.js
if (require.main === module) {
  reverseGeocode(12.9716, 77.5946)
    .then(address => console.log("Reverse geocoded address:", address))
    .catch(err => console.error("Error:", err.message));
}
