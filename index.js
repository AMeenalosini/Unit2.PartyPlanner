const COHORT = "2411-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// === State ===

const state = {
  events: [],
};

/** Updates state with artists from API */
async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();

        state.events = json.data;

        renderEvents();
      } catch (error) {
        console.error(error);
      } 
      finally {console.log(state.events);}
}

/** Asks the API to create a new artist based on the given `artist` */
async function addEvents(artist) {
  // TODO
}

// === Remove the events ===

const removeEvents = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    getEvents();
  } catch (error) {
    console.log("ERROR in removeRecipe", error);
  }
};

// === Create new events ===

const createNewEvents = async (name, description, date, location) => {
  try {
     console.log("date", date);
     console.log("typeof date", typeof date);
     console.log("ISO date", new Date(date).toISOString());

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        date: new Date(date).toISOString(),
        location
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    getEvents();
  } catch (error) {
    console.log("ERROR in createNewEvent", error);
  }
};

// === Render ===

/** Renders artists from state */
function renderEvents() {
  const eventsContainer = document.getElementById("events-container");
  const eventList = state.events;

  if (!eventList || eventList.length === 0) {
    eventsContainer.innerHTML = "<h3>No events found</h3>";
    return;
  }

  //resets html of all events
  eventsContainer.innerHTML = "";

  //creates a card for each events
  eventList.forEach((events) => {
    const eventElement = document.createElement("div");
    eventElement.classList.add("events-card");
    eventElement.innerHTML = `
            <h4>${events.name}</h4>
            <p>${events.description}</p>
            <p>${events.date}</p>
            <p>${events.location}</p>
            <button class="delete-button" data-id="${events.id}">Remove</button>
        `;
    eventsContainer.appendChild(eventElement);

    const deleteButton = eventElement.querySelector(".delete-button");
    //add events listener to the delete button so we can delete a events
    deleteButton.addEventListener("click", (event) => {
      try {
        event.preventDefault();
        removeEvents(events.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

//  adds a listener to our form so when we submit the form we create a new new
const addListenerToForm = () => {
  const form = document.querySelector("#new-events-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await createNewEvents(
      form.name.value,
      form.description.value,
      form.date.value,
      form.location.value
    );

    //clears the form after we create the new recipe
    form.name.value = "";
    form.description.value = "";
    form.date.value = "";
    form.location.value = "";
  });
};

/** Syncs state with the API and rerender */
async function render() {
  await getEvents();
  addListenerToForm();
}

// === Script ===

render();

// TODO: Add artist with form data when the form is submitted