const MAPKEY = 'AIzaSyBzxbu5AjBh5LWI3Ns5L_vJvdKawxV-w98';
const MILE_RANGE = 1;

let surveyIdString = document.getElementById('survey-id').textContent;
let surveyId = parseInt(surveyIdString);
console.log("Survey ID:", surveyId);

// Load the Google Maps API
function loadGoogleMapsApi() {
  return new Promise((resolve, reject) => {
    if (window.google && google.maps) {
      resolve(); // Already loaded
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPKEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("✅ Google Maps API loaded");
      resolve();
    };

    script.onerror = () => {
      reject(new Error("❌ Failed to load Google Maps API"));
    };

    document.head.appendChild(script);
  });
}

// Geocode an address
async function geocodeAddress(Address, City, State) {
  let parts = [Address, City, State].filter(part => part && part.trim() !== '');
  let RealAddress = parts.join(', ');
  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode({ address: RealAddress }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const latitude = results[0].geometry.location.lat();
        const longitude = results[0].geometry.location.lng();
        resolve({ latitude, longitude });
      } else {
        console.error('Geocoding failed:', status);
        resolve({ latitude: null, longitude: null });
      }
    });
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options); // Uses browser locale, or you can hardcode e.g. 'en-US'
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getNearbySurveys(surveyId) {
  try {
    showLoadingOverlay();

    await loadGoogleMapsApi();

    const response = await fetch('/static/data.json');
    const data = await response.json();

    const targetSurvey = data.find(item => item.id === surveyId);
    if (!targetSurvey) {
      console.warn("No survey found with the given ID.");
      hideLoadingOverlay();
      return [];
    }

    const { latitude, longitude } = await geocodeAddress(
      targetSurvey.Address, targetSurvey.City, targetSurvey.State
    );

    if (!latitude || !longitude) {
      console.error("Failed to geocode the target survey address.");
      hideLoadingOverlay();
      return [];
    }

    const nearbySurveys = [];
    for (const survey of data) {
      if (survey.id === surveyId) continue;

      // 🆕 Only compare surveys in the same city
      if (!survey.City || survey.City.trim().toLowerCase() !== targetSurvey.City.trim().toLowerCase()) {
        continue;
      }

      const { latitude: surveyLat, longitude: surveyLng } = await geocodeAddress(
        survey.Address, survey.City, survey.State
      );

      if (!surveyLat || !surveyLng) continue;

      const distance = haversine(latitude, longitude, surveyLat, surveyLng);

      if (distance <= MILE_RANGE) {
        nearbySurveys.push(survey);
      }
    }

    return nearbySurveys;

  } catch (error) {
    console.error("Error getting nearby surveys:", error);
    return [];
  } finally {
    hideLoadingOverlay();
  }
}

function showLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'flex';
}
function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'none';
}

function renderNearbySurveys(surveys) {
  const container = document.getElementById('nearby-survey-cards');
  if (!container) return;

  container.innerHTML = ''; // Clear previous cards

  if (surveys.length === 0) {
    container.innerHTML = '<p>No nearby surveys found.</p>';
    return;
  }

  surveys.forEach(survey => {
    const col = document.createElement('div');
    col.className = 'col-sm-12';
    col.innerHTML = `
      <div class="card" style="border: 2px solid rgb(52, 103, 52); margin-bottom: 20px;">
        <div class="card-header">
          <h5 style="color: rgb(77, 175, 77); font-size: 15pt;">${survey.Number || 'Unknown Number'}</h5>
        </div>
        <div class="card-body">
          <p>
          <strong id="space-between-words" class="date-ordered-surveys">${survey.DateOrdered ? `Date Ordered: ${formatDate(survey.DateOrdered)}<br/>` : ''}</strong>
            <br />
            <strong id="space-between-words" >Address: ${survey.Address || 'N/A'}${survey.City ? ' - ' + survey.City : ''}${survey.State ? ' - ' + survey.State : ''}</strong>
            <br />
            <strong id="space-between-words" >Client: ${survey.Client || 'Unknown'} ${survey.PhoneNumber ? ' - ' + survey.PhoneNumber : ''}</strong>
            <br />
           <strong id="space-between-words" >${survey.Description ? `Description: ${survey.Description}<br/>` : ''}</strong>
            <strong id="space-between-words" >${survey.Comments ? `Comments: ${survey.Comments}` : ''}</strong>
          </p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Fetching nearby surveys...');
  getNearbySurveys(surveyId).then(surveys => {
    console.log('Nearby surveys:', surveys);
    renderNearbySurveys(surveys);
  });
});