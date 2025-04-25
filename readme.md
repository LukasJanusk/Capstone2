Strava Music Service
Project Idea

This app combines the user's workout data and personal traits to generate personalized AI-generated songs and images.

User Traits

During the user signup process, we collect various traits. Each trait is associated with certain biases towards a music genre and multipliers for AI prompt generations. For example:

    Trait: Optimistic
        Bias towards: Pop genre
        Mood multiplier: 1.5

Workout Data

Workout statistics are collected from the Strava API, such as heart rate, speed, calories, pulse, etc. These stats are used to calculate mood, energy, and other multipliers.

The basic values from the workout are processed through these multipliers to generate a prompt for the music generation AI.

Currently, Suno API from apibox is used.

Flow Overview

    User traits and workout data are gathered.
    These values are combined and used to create a prompt for the AI.
    Once the song is generated (or starts generating, depending on the implementation), song url data is sent to user to start listening.

Front-end is built on Vue framework, back-end uses TRPC with express adapter.

Client Views

HomeView
Path: /
Description: Displays message for new user to sign up. For singed up user displays app logo and authorization for Strava button.

WelcomeView
Path: /welcome
Description: Displays welcome message or error message on user signup.

AuthenticatedView
Path: /authenticated
Description: Receives one time code parameter from strava once redirected on callback. Displays Welcome message or Error message upon completing strava authorization.

SignupView
Path: /signup
Description: Sign up form for user sign up. Displays error message if failed to sign up. Redirects to WelcomeView on success.

SigninView
Path: /signin
Description: Redirects to DashboardView on success, displays error message if failed to singin.

DashboardView
Path: /dashboard
Description: Here all user activities with titles and date are displayed. User can click on activity image to go to PlaybackView for that activity. User can reload activities or request songs for yet activities. If there are no activities yet, displays instructions message.

PlaybackView
Path: /playback/:activityId
Description: Displays activity data with generated songs and image for songs. User can play generated songs for that activity.

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

    /user/getUserActivitiesWithSong
        Description: Returns acitvities with songs generated for that activity
        Input: Requires no input (authenticated procedure).
        Returns: ActivityWithSongs object array

    /user/stravaAuthenticated
        Description: Checks if user is Authenticated by Strava
        Input: Requires no input (authenticated procedure).
        Returns: object with authenticated: boolean

    /user/deleteUser
        Description: Deletes user data, cascades for all data. Currently not implemented on Client side.
        Input: Object with user email
        Returns: Object with deleted user Id

    /user/changeEmail
        Description: Changes user email, currently not implemented on Client side
        Input: Object with user email
        Returns: Object with user Id and updated email

Strava Endpoints

    /strava/getAccess
        Description: Retrieves the Strava user's access and refresh tokens and stores them in the database.
        Input: One-time code received from Strava authentication.
        Returns: Public user information.

    /strava/getClientId
        Description: Gets strava applictaion id
        Input: No input required (public endpoint)
        Returns: String with client id

    /strava/getAthlete
        Description: Currently unused on Client side.
        Input: Requires no input (authenticated procedure).
        Returns: Athlete information (ID, first name, last name) from Strava.

    /strava/webhooks
        Description: Listens for activity or user updates from Strava servers.
        Function: Automatically collects user trait data, combines it with activity data, and generates a prompt for the music generation API.

Generator Endpoints

    /generator/getSongByTaskId
        Input: no input required, user must be authorized.
        Returns: AcitvityWithSongs containing audio and image url.

    /generator/storeGenerated
        Description: Listens for songs from Suno API, stores them to db.
        Input: Suno API generated song objects
        Returns:  code: 200, msg: 'Callback received successfully', or code: 400, msg: 'Bad request'

    /generator/requestSong
        Description: currently unused;
        Input: Prompt for api
        Returns: Song generation task

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

Client e2e test:

```bash
npm run test:e2e -w client
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
    Music generation key for APIBOX SUNO API
        API_BOX_KEY

    Strava Webhooks
    Webhooks require subscriptions on Strava. For how to set this up, refer to the Strava Webhooks Documentation: https://developers.strava.com/docs/webhooks/

Additional Notes

Project is hosted: https://capstone2.g5qsj0y7zwc7y.eu-central-1.cs.amazonlightsail.com

Currently only one user is allowed to use the app until strava approval is granted.
In this case when trying to authorize strava, athlete limit reached error will be displayed.

Also prompt generation formula needs work, music genre is currently determined by user traits with each trait having certain bias towards music genre. Weighted average formula is being used to determined music genre for prompt. User selection for music genre during signup of later in settings will be implemented later.
