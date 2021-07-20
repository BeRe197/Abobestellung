# REST API

```/src/api```

## Functions

This folder contains a REST API for the **Abobestellung** Project with the following functions:

Method | HTTP request | Description
------------- | ------------- | -------------
**CalcDistance** | **Get** /functions/getDistanceFromCompanyToDestinationPlz/{customerPLZ} | Calculate the distance between a given PLZ and the company location
**GetLocalVersions** | **Get** /functions/getLocalVersionsForPlz/{customerPLZ} | Get the available local version for a given PLZ

### CalcDistance

**GET**
> localhost:4500/functions/getDistanceFromCompanyToDestinationPlz/{customerPLZ}

#### Responses
- **200**: Ok

#### Return Object
```
{
    "distance": {distance},
    "plzDestination": "{customerPLZ}"
}
```

### GetLocalVersions

**GET**
> localhost:4500/functions/getLocalVersionsForPlz/{customerPLZ}

#### Responses
- **200**: Ok

#### Return Object
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

## How to start

1. Navigate to the folder
2. Install the dependencies `npm install`
3. Start the page with `npm start`
4. The API will run on port `:4500`
