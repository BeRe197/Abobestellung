# Abobestellung
KFRU Course - Front-End Development

This monorepository contains two parts:

## GitHub Pages
[![Build and Deploy to GitHub Pages](https://github.com/BeRe197/Abobestellung/actions/workflows/build_deploy_GitHub-Pages.yml/badge.svg)](https://github.com/BeRe197/Abobestellung/actions/workflows/build_deploy_GitHub-Pages.yml)
> bere197.github.io/abobestellung/

*Not recommended because the REST API is not running/working there*
**Please run the entire project locally**
[How to start webpage] (###-How-to-start)
[How to start rest api] (###-How-to-start)

## Abobestellung Webpage

```/src/webpage```

### Functions

This folder contains a React Webapp for the **Abobestellung** Project with the following functions:
* Register a user
  * Email + Password will be registered with Firebase Authorization
  * **Remaining Userdata will be stored within the Firestore (document oriented database)**
* Login with Email + Password with Firebase Authorization
* Abonnement Wizard:
  * Choose printed Newspaper and provide delivery address (after login the delivery address will be prefilled from the user data but the user can change it if needed)
  * API call for distance calculation (between customer plz and company location)
  * API call to get the available local versions for the provided PLZ
  * PLZ calculation is only available for German cities. If the user is in a foreign country there will be a delivery fees added and all version have to be sent by a post
  * The user can choose different parameter for his abonnement:
    * Different Version (City, Sport, Culture) (if Version is not available for the provided PLZ the version will be sent by post)
    * Payment: Annual, monthly
    * Delivery frequenz: Daily, Weekend
    * Start Day of the Abonnement (the soonest day will be in two days)
    * Hint for the delivery man (option not available if the version will be sent by post)
  * The user see the billng address from his profile data and can change it if needed
  * Choose Billing type: Invoice or direct debit (Lastschrift)
  * The user will see a summary of his abonnement and can order it after accepting the privacy terms
  * **All abos will be stored in the Firestore database**
* Profile Area to see all Profile Information and change information or delete the own user
* Abonnement overview to see all own abos and cancel existing subscription

### How to start

1. Navigate to the folder
2. Start the page with `yarn start`


## REST API

```/src/api```

### Functions

This folder contains a REST API for the **Abobestellung** Project with the following functions:

#### Calculate the distance between a given PLZ and the company location

**GET**
> localhost:4500/functions/getDistanceFromCompanyToDestinationPlz/{customerPLZ}

##### Responses
- **200**: Ok

##### Return Object
```
{
    "distance": {distance},
    "plzDestination": "{customerPLZ}"
}
```

#### Get the available local version for a given PLZ

**GET**
> localhost:4500/functions/getLocalVersionsForPlz/{customerPLZ}

##### Responses
- **200**: Ok

##### Return Object
*Below will be a full answer. If only one version is available then only one version will be returned*
```
{
    "1": {
        "id": 1,
        "name": "Stadtausgabe",
        "picture": ""
    },
    "2": {
        "id": 2,
        "name": "Sportversion",
        "picture": ""
    },
    "3": {
        "id": 3,
        "name": "Landkreisinfos",
        "picture": ""
    }
}
```

### How to start

1. Navigate to the folder
2. Start the page with `npm start`
