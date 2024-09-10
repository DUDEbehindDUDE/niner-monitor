# UNC Charlotte Occupancy Tracker

This project aims to be a dashboard style website that serves as a one-stop shop for you to look at most of the things you'll want to know about UNC Charlotte, including how busy places are, what's open, and more. This project was heavily inspired by a discord bot showing occupancy levels made by `@ironton` on discord.

## About the Site

You can access the site at [https://dudebehinddude.github.io/uncc-occupancy-tracker-frontend/](https://dudebehinddude.github.io/uncc-occupancy-tracker-frontend/). The site is built using React, and occupancy data is gathered from other sites through an external API. The code for this API can be found [here](https://github.com/dudebehinddude/uncc-occupancy-tracker-backend/).

## Issues and Suggestions

If you encounter any issues or have suggestions for improvements, feel free to open an issue on this repository and provide details about the problem or feature request.

## Build 

### Prerequisites

This project is built with Node.JS and Yarn. Ensure these are installed before preceeding.

### Installation

1. Clone the repository
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Start up the development server. The server should be accessable at [localhost:3000/uncc-occupancy-tracker-frontend](https://localhost:3000/uncc-occupancy-tracker-frontend) (setup this way for GitHub Pages)
   ```sh
   yarn start
   ```
4. Alternatively, you can generate a production build of the project:
   ```sh
   yarn build
   ```

### Local Backend API

By default, the project uses a hosted version of the API. To run the project with a local API:
1. Visit the backend repo [here](https://github.com/dudebehinddude/uncc-occupancy-tracker-backend/) and follow the instructions to setup the backend API.
2. If instructions are followed correctly, the server should be hosted at `http://localhost:5096`. Visiting here should take you to the Swagger API documentaion page if you are in a development environment. If this doesn't work, make sure you followed the setup instructions correctly.
3. Further instructions will be added in the future.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/DUDEbehindDUDE/uncc-occupancy-tracker-frontend/blob/main/LICENSE) file for more information.
