Strava Music Service
Project Idea

This app combines the user's workout data and personal traits to generate personalized AI-generated songs and images.

User Traits

During the user signup process, we collect various traits. Each trait is associated with certain biases towards a music genre and multipliers for AI prompt generations. For example:

    Trait: Optimistic
        Bias towards: Pop genre
        Mood multiplier: 1.5

Workout Data

We collect workout statistics from the Strava API, such as heart rate, speed, calories, pulse, etc. These stats are used to calculate mood, energy, and other multipliers.

The basic values from the workout are processed through these multipliers to generate a prompt for the music generation AI.

Currently, we are using Topmediai for music generation.

Flow Overview

    User traits and workout data are gathered.
    These values are combined and used to create a prompt for the AI.
    Once the song is generated (or starts generating, depending on the implementation), we send the song URL to the frontend so the user can start listening.

Server Endpoints
User Enpoints

    /user/login
        Input: Object containing email, password
        Returns: User id wrapped in object

    /user/signup
        Input: Object with user data from sing up form
        Returns: User id wrapped in object

    /user/getPublicUser
        Input: Requires no input (authenticated procedure).
        Returns: Public user information. Id, firstName, lastName wrapped in object

    Strava Endpoints

    /strava/getAccess
        Input: One-time code received from Strava authentication.
        Description: Retrieves the Strava user's access and refresh tokens and stores them in the database.
        Returns: Public user information.

    /strava/getAthlete
        Input: Requires no input (authenticated procedure).
        Returns: Athlete information (ID, first name, last name) from Strava.

    /strava/webhooks (WORK IN PROGRESS)
        Description: Listens for activity or user updates from Strava servers.
        Function: Automatically collects user trait data, combines it with activity data, and generates a prompt for the music generation API.

Generator Endpoints

    /generator/getSongs
        Input: Object containing lyric, title, and prompt.
        Returns: Song objects with audio file URL.

Trait Endpoints

    /trait/getAll
        Description: Public procedure to retrieve the currently active traits from the database.
        Function: Used during user registration to later create a user-trait relationship.

Running the Project

Server

To start the server, run:

```bash
npm run dev -w server
```

Client

To start the client, run:

```bash
npm run dev -w client
```

Server Tests

To run the server tests, use:

```bash
npm run test -w server
```

Environment Variables

The project requires the following environment variables:

    Strava Authentication
    You will need to create a Strava developer application to get the client_id and client_secret.
        STRAVA_CLIENT_ID
        STRAVA_CLIENT_SECRET

    To create a new app on Strava, start here: https://www.strava.com/settings/api

    Database
    A PostgreSQL database is required. You must set up the database URL.
        DATABASE_URL

    Token Key
    A secret key for token generation.
        TOKEN_KEY

    Music Generation
    Music generation is still in the early phase but requires an API key for the music service.
        TOP_MEDIAI_KEY

    Strava Webhooks
    Webhooks require subscriptions on Strava. For how to set this up, refer to the Strava Webhooks Documentation: https://developers.strava.com/docs/webhooks/

Additional Notes

Ensure your database is properly set up with the appropriate schema and environment variables.
For trying app, you will need a valid Strava account and API keys. Tests should still pass since they dont use or use mocked strava service. However databas and token key are required since current tests use same key and database. Project still is in early stages of develoment so there will be bugs. There are still quite some unhappy path error handling and testing to be done. Keeping that in mind, im looking forward for further impovements and suggestions for the project.
