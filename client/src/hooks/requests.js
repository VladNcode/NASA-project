const API_URL = 'v1';

// Load planets and return as JSON.
async function httpGetPlanets() {
  return (await fetch(`${API_URL}/planets`)).json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const res = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await res.json();
  return fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
  } catch (e) {
    return { ok: false };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'DELETE',
    });
  } catch (e) {
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
