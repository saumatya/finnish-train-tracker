# Finnish Train Tracker App

## Overview

The app is a React-based application that allows users to view the live trains running in Finland and their details. The user can select a train or a station from the map and find more information. The app consumes the API from [DigiTraffic API](https://www.digitraffic.fi/en/railway-traffic/).

## Features

- **Live Train Tracking**  
  View real-time locations of trains displayed dynamically on the map.

- **Station Visualization**  
  See all train stations clearly marked on the map.

- **Station Search**  
  Easily search and locate stations using the search bar.

- **Basic Train Information**  
  Click on a train to view essential details such as:

  - Speed
  - Category (e.g., Intercity, Commuter)
  - Operator

- **Detailed Train Route Information**  
  View the complete route of a train, including:

  - All stations it passes through
  - Arrival and departure times at each station
  - Track number used at each stop

- **Station-specific Train Details**  
  Select a station to view:
  - All arriving and departing trains
  - Scheduled arrival/departure times
  - Track numbers for each train

## ⚙️ Setup Instructions

### 🧰 Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- [npm (Node Package Manager)](https://www.npmjs.com/)

### 📥 Steps

#### 1. Clone the repository

Open your terminal and run the following commands:

```bash
git clone https://github.com/saumatya/finnish-train-tracker.git
cd finnish-train-tracker
```

#### 2. Install dependencies

Open your terminal and run the following commands:

```bash
npm install
```

#### 3. Start application

Open your terminal and run the following commands:

```bash
npm run dev
```

## 🛠️ Technical Overview

### 🌐 Frontend

- Built using:
  - **React**
  - **Redux Toolkit** (with Redux Thunk for async logic)
  - **Leaflet.js** for interactive map rendering
  - **Axios** for fetching API
  - **Tailwind CSS** for styling
  - **MUI (Material-UI)** components for inputs, alerts, loaders, etc.
  - **React Hooks** such as:
    - `useState`, `useEffect`, `useDispatch`, `useSelector`, `useRef`
  - **React-Toastify** for displaying error messages

### 🗺️ Map Visualization

- Map displays:
  - **Live train locations** marked with popups showing train ID and speed
  - **Station locations** with popups showing station code and country
  - **Markers** are clickable

### 📊 Train & Station Details

- Details were fetched using REST API provided by DigiTraffic.
- Sidebar shows **detailed information**:
  - For each **train**, displays full route info: arrival/departure times and tracks at each station
  - For each **station**, shows all **arriving and departing trains**
- Sidebar and UI transitions were smoothed for better UX

### 🧼 Code Enhancements

- Cleaned and refactored:
  - Redux reducer logic
  - React component structures
- Improved UI responsiveness and state management across components

### 📡 Backend (initial version - later removed)

- Created a simple backend using **Python** and **FastAPI** to:
  - Fetch and rearrange data from the [Digitraffic API](https://rata.digitraffic.fi/)
  - Provide REST APIs to the frontend
- Later realized that all required data can be fetched directly from the frontend, so the backend was removed.

## Methodologies

### Postman Testing

Before development, Postman was used extensively to validate API endpoints, including the proper handling of API and understanding the response. Key aspects tested include:

- Correct responses to different queries and understanding their relations

The **JSON Tree Viewer** was primarily used for:

- **Drilling down** into deeply nested JSON objects and arrays of the API response.
- **Visually navigating** large datasets, making it easier to identify key information like arrival, departure time, track number, station names.
- **Debugging and Validation** by comparing raw API responses with expected values and ensuring correct data parsing in the app.

### Chrome Dev Tools Usage

Chrome Developer Tools were instrumental for testing and debugging:

- **Console**: `console.log()` statements were used for debugging the application and checking data responses.
- **Network Tab**: API requests and responses were monitored in real-time to ensure correct data fetching and error handling. Easy to check if the endpoint url , parameters is correct, checking HTTP status response code.
- **Sources Tab**: The Sources Tab was used to add breakpoints in the source code, step in and out of functions to investigate errors, evaluate variables, and debug the application.

These testing methods ensured the app's functionality and robustness, confirming that weather data was accurate and the UI was user-friendly.

## Prototype and Requirement Analysis

### API Documentation Review

- The DigiTraffic API swagger was used to view able api functions and documentation was reviewed in detail to find our necessary information.

### Brainstorming Ideas

- Identified user requirements such as viewing trains and stations or with search.
- Understood the business logic behind train systems and the data required for users.
- Decided to use **Leaflet.js** for displaying the map using lattitude and longitude.

### Prototype Development

- A rough prototype was developed in **Figma**, focusing on core UI elements and the overall user experience.
- Hand sketches were created and components created based on it for UI development.

### Limitations

- The live trains are updated only once every 3 second since frequent fetch to the API gives error 429 (Too Many Requests)
- The arrivals and departures API has been limited to 5 for each.

## Future Enhancements

- Add markers clutering to map so that the markers on map donot look crowded.
- Add the ability to see delays, maintenance blockage on map.
- Add option to browse using route of two cities.
- Finding nearest stations with user location.
- Reminders to board/unboard and notifications for delay or blockage.
