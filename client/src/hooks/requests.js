const API_URL = 'http://localhost:5000';

// Load planets and return as JSON.
async function httpGetPlanets() {
  return (await fetch(`${API_URL}/planets`)).json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  return (await fetch(`${API_URL}/launches`))
    .json()
    .sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
