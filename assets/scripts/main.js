import { personIcon } from "./constants.js";
import { getNoteIcon, getStatus } from "./helpers.js";
import elements from "./ui.js";

// Global Variables
let map;
let clickedCoords;
let layer;

// Get notes from local storage
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Initialize the map with the user's current location or a default location if geolocation fails

window.navigator.geolocation.getCurrentPosition(
  (e) => {
    loadMap([e.coords.latitude, e.coords.longitude], "Current Location");
  },
  (e) => {
    loadMap([39.927286, 32.834852], "Default Location"); // Ankara default location
  }
);

// Attempt to get user's current location and initialize map at that location.
// If geolocation fails, use a default location (Ankara) to initialize the map.

function loadMap(currentPosition, msg) {
  map = L.map("map", { zoomControl: false }).setView(currentPosition, 12);

  // Render the map
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Fix the zoom control to the bottom right corner
  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);

  // Add a layer to the map
  layer = L.layerGroup().addTo(map);

  // Add a marker at the user's current location
  L.marker(currentPosition, { icon: personIcon }).addTo(map).bindPopup(msg);

  // Listen for clicks on the map
  map.on("click", onMapClick);

  // Render the notes
  renderNotes();

  renderMarkers();
}

// When the user clicks on the map, get the coordinates of the click
function onMapClick(e) {
  clickedCoords = [e.latlng.lat, e.latlng.lng];

  elements.aside.classList.add("add");
}

// Add a new note
elements.form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  const newNote = {
    id: new Date().getTime(),
    title,
    date,
    status,
    coords: clickedCoords,
  };

  // Add the new note to the notes array
  notes.push(newNote);

  // Add the new note to the local storage
  localStorage.setItem("notes", JSON.stringify(notes));

  // Clear the form
  e.target.reset();

  // Close the form
  elements.aside.classList.remove("add");

  // Render the notes
  renderNotes();

  // Render the markers
  renderMarkers();
});

// Close the form
elements.cancelBtn.addEventListener("click", () => {
  elements.aside.classList.remove("add");
});

// Delete a note
elements.noteList.addEventListener("click", (e) => {
  if (e.target && e.target.id === "delete-btn") {
    const id = e.target.dataset.id;
    deleteNote(id);
  }
});

elements.noteList.addEventListener("click", (e) => {
  if (e.target && e.target.id === "fly-btn") {
    const id = e.target.dataset.id;
    flyToNote(id);
  }
});

elements.arrowIcon.addEventListener("click", () => {
  elements.aside.classList.toggle("hide");
});

// Render the notes
function renderNotes() {
  // I used en locale and numeric, long, numeric options to get a date format like "January 1, 2020"
  const noteCard = notes
    .map((note) => {
      const date = new Date(note.date).toLocaleDateString("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // getStatus function returns the appropriate expression based on the given status value
      return `<li>
          <div>
            <p>${note.title}</p>
            <p>${date}</p>
            <p>${getStatus(note.status)}</p>
          </div>

          <div class="icons">
            <i data-id="${
              note.id
            }" class="bi bi-airplane-fill" id="fly-btn"></i>
            <i data-id="${note.id}" class="bi bi-trash" id="delete-btn"></i>
          </div>
        </li>`;
    })
    .join("");

  elements.noteList.innerHTML = noteCard;
}

// Render the markers
function renderMarkers() {
  layer.clearLayers();
  notes.map((note) => {
    const icon = getNoteIcon(note.status);

    L.marker(note.coords, { icon }).addTo(layer).bindPopup(note.title);
  });
}

// Delete a note
function deleteNote(id) {
  const res = confirm("Are you sure you want to delete this note?");

  if (res) {
    notes = notes.filter((note) => note.id != id);

    localStorage.setItem("notes", JSON.stringify(notes));

    renderNotes();

    renderMarkers();
  }
}

function flyToNote(id) {
  const foundedNote = notes.find((note) => note.id == id);

  map.flyTo(foundedNote.coords, 17);
}
