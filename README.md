<h1 align="center">Spark Bytes</h1>
<h6 align="center">Brought to you by Group 1</h6>


# Table of Contents
 - [Introduction](#introduction)
 - [Features](#features)
 - [How to (Developers)](#how-to-developers)
 - [Technology](#technology)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Schema](#schema)
   - [Database](#database)
 - [Contributors](#contributors)
 - [License](#license)

# Introduction
Spark Bytes is a platform to help Boston University students find events
with free food on campus. The platform allows students to search for events
based on their preferences and dietary restrictions. Students can also view
event details on a map to see where to go.

# Features
- [x] Set dietary restrictions
- [x] View events on Google Maps
- [x] List view of all events
- [x] Create and edit your own events

# How to (Developers)
Looking to run the project?
1. Get API keys 
   1. Get [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
   2. Get [Google Auth API Key](https://developers.google.com/identity/sign-in/web/sign-in)

```yaml
# ./backend/.env
google_client_id=xx-xxxx.apps.googleusercontent.com
google_client_secret=xx-xxxx
google_secret_key=iamsecure
```

```yaml
# ./frontend/.env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxx
```

2. Starting the backend
   1. Install [PDM](https://pdm.fming.dev/).

```bash
cd backend
pdm i 
pdm start
```

A local server will be running on `http://localhost:8000`. A new database
will be created in the backend directory.

You can navigate to `http://localhost:8000/docs` to view the API documentation,
and interact with the API in a user-friendly manner. 

3. Starting the frontend
   1. Install [Node.js](https://nodejs.org/en/).

```bash
cd frontend
npm install
npm run dev
```

A local server will be running on `http://localhost:3000`.

# Technology
### Frontend
The frontend is a simple Next.js project

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview)

### Backend
The backend is a FastAPI project, with PDM to manage dependencies and uvicorn. 
We wrote a custom OAuth2 scheme to authenticate users with Google.

Uniquely, we have a custom "database endpoint generator" that automatically:
1. Creates a new SQLAlchemy model
2. Creates a new Pydantic model
3. Creates a new endpoints for CRUD operations

Off of a single model. This allows us to quickly add new tables
to the database.

- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Google Auth](https://developers.google.com/identity/sign-in/web/sign-in)

## Schema

<details>
   <summary>OpenAPI JSON Schema</summary>

```json
{
   "openapi": "3.1.0",
   "info": {
      "title": "FastAPI",
      "version": "0.1.0"
   },
   "paths": {
      "/database/users": {
         "post": {
            "tags": [
               "datastream"
            ],
            "summary": "Create and save new users",
            "operationId": "create_database_users_post",
            "requestBody": {
               "content": {
                  "application/json": {
                     "schema": {
                        "items": {
                           "$ref": "#/components/schemas/User"
                        },
                        "type": "array",
                        "title": "Items"
                     }
                  }
               },
               "required": true
            },
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "items": {
                              "$ref": "#/components/schemas/User"
                           },
                           "type": "array",
                           "title": "Response Create Database Users Post"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         }
      },
      "/database/users/{item_id}": {
         "put": {
            "tags": [
               "datastream"
            ],
            "summary": "Update users by id",
            "operationId": "put_item_database_users__item_id__put",
            "parameters": [
               {
                  "name": "item_id",
                  "in": "path",
                  "required": true,
                  "schema": {
                     "type": "string",
                     "title": "Item Id"
                  }
               }
            ],
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/User"
                     }
                  }
               }
            },
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/User"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         },
         "get": {
            "tags": [
               "datastream"
            ],
            "summary": "Get users by id",
            "operationId": "get_item_database_users__item_id__get",
            "parameters": [
               {
                  "name": "item_id",
                  "in": "path",
                  "required": true,
                  "schema": {
                     "type": "string",
                     "title": "Item Id"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/User"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         },
         "delete": {
            "tags": [
               "datastream"
            ],
            "summary": "Delete users by id",
            "operationId": "delete_item_database_users__item_id__delete",
            "parameters": [
               {
                  "name": "item_id",
                  "in": "path",
                  "required": true,
                  "schema": {
                     "type": "string",
                     "title": "Item Id"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/User"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         }
      },
      "/database/users/list": {
         "post": {
            "tags": [
               "datastream"
            ],
            "summary": "List all users items",
            "operationId": "list_items_database_users_list_post",
            "requestBody": {
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/ListRequest"
                     }
                  }
               },
               "required": true
            },
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "items": {
                              "$ref": "#/components/schemas/User"
                           },
                           "type": "array",
                           "title": "Response List Items Database Users List Post"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         }
      },
      "/database/events": {
         "post": {
            "tags": [
               "datastream"
            ],
            "summary": "Create and save new events",
            "operationId": "create_database_events_post",
            "requestBody": {
               "content": {
                  "application/json": {
                     "schema": {
                        "items": {
                           "$ref": "#/components/schemas/Event"
                        },
                        "type": "array",
                        "title": "Items"
                     }
                  }
               },
               "required": true
            },
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "items": {
                              "$ref": "#/components/schemas/Event"
                           },
                           "type": "array",
                           "title": "Response Create Database Events Post"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         }
      },
      "/database/events/{item_id}": {
         "put": {
            "tags": [
               "datastream"
            ],
            "summary": "Update events by id",
            "operationId": "put_item_database_events__item_id__put",
            "parameters": [
               {
                  "name": "item_id",
                  "in": "path",
                  "required": true,
                  "schema": {
                     "type": "string",
                     "title": "Item Id"
                  }
               }
            ],
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/Event"
                     }
                  }
               }
            },
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/Event"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         },
         "get": {
            "tags": [
               "datastream"
            ],
            "summary": "Get events by id",
            "operationId": "get_item_database_events__item_id__get",
            "parameters": [
               {
                  "name": "item_id",
                  "in": "path",
                  "required": true,
                  "schema": {
                     "type": "string",
                     "title": "Item Id"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/Event"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         },
         "delete": {
            "tags": [
               "datastream"
            ],
            "summary": "Delete events by id",
            "operationId": "delete_item_database_events__item_id__delete",
            "parameters": [
               {
                  "name": "item_id",
                  "in": "path",
                  "required": true,
                  "schema": {
                     "type": "string",
                     "title": "Item Id"
                  }
               }
            ],
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/Event"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         }
      },
      "/database/events/list": {
         "post": {
            "tags": [
               "datastream"
            ],
            "summary": "List all events items",
            "operationId": "list_items_database_events_list_post",
            "requestBody": {
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/ListRequest"
                     }
                  }
               },
               "required": true
            },
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "items": {
                              "$ref": "#/components/schemas/Event"
                           },
                           "type": "array",
                           "title": "Response List Items Database Events List Post"
                        }
                     }
                  }
               },
               "422": {
                  "description": "Validation Error",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/HTTPValidationError"
                        }
                     }
                  }
               }
            }
         }
      },
      "/login": {
         "get": {
            "summary": "Login",
            "operationId": "login_login_get",
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {}
                     }
                  }
               }
            }
         }
      },
      "/auth/callback": {
         "get": {
            "summary": "Auth Callback",
            "operationId": "auth_callback_auth_callback_get",
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {}
                     }
                  }
               }
            }
         }
      },
      "/protected": {
         "get": {
            "summary": "Protected Route",
            "operationId": "protected_route_protected_get",
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/User"
                        }
                     }
                  }
               }
            }
         }
      },
      "/logout": {
         "get": {
            "summary": "Logout",
            "operationId": "logout_logout_get",
            "responses": {
               "200": {
                  "description": "Successful Response",
                  "content": {
                     "application/json": {
                        "schema": {}
                     }
                  }
               }
            }
         }
      }
   },
   "components": {
      "schemas": {
         "Event": {
            "properties": {
               "user_id": {
                  "type": "string",
                  "title": "User Id",
                  "description": "The unique identifier for the user that this data belongs to"
               },
               "id": {
                  "type": "string",
                  "title": "Id",
                  "description": "The unique identifier for this item of data"
               },
               "created_at": {
                  "type": "integer",
                  "title": "Created At",
                  "description": "The unix timestamp of when this item of data was created, used internally for sorting"
               },
               "name": {
                  "type": "string",
                  "title": "Name"
               },
               "description": {
                  "type": "string",
                  "title": "Description"
               },
               "location": {
                  "type": "string",
                  "title": "Location"
               },
               "latitude": {
                  "type": "number",
                  "title": "Latitude"
               },
               "longitude": {
                  "type": "number",
                  "title": "Longitude"
               },
               "start_time": {
                  "type": "string",
                  "title": "Start Time"
               },
               "end_time": {
                  "type": "string",
                  "title": "End Time"
               },
               "is_vegan": {
                  "type": "boolean",
                  "title": "Is Vegan"
               },
               "is_halal": {
                  "type": "boolean",
                  "title": "Is Halal"
               },
               "is_vegetarian": {
                  "type": "boolean",
                  "title": "Is Vegetarian"
               },
               "is_gluten_free": {
                  "type": "boolean",
                  "title": "Is Gluten Free"
               }
            },
            "type": "object",
            "required": [
               "user_id",
               "name",
               "description",
               "location",
               "latitude",
               "longitude",
               "start_time",
               "end_time",
               "is_vegan",
               "is_halal",
               "is_vegetarian",
               "is_gluten_free"
            ],
            "title": "Event"
         },
         "HTTPValidationError": {
            "properties": {
               "detail": {
                  "items": {
                     "$ref": "#/components/schemas/ValidationError"
                  },
                  "type": "array",
                  "title": "Detail"
               }
            },
            "type": "object",
            "title": "HTTPValidationError"
         },
         "ListRequest": {
            "properties": {
               "user_id": {
                  "anyOf": [
                     {
                        "type": "string"
                     },
                     {
                        "type": "null"
                     }
                  ],
                  "title": "User Id",
                  "description": "The unique identifier for the user that this data belongs to",
                  "examples": [
                     "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
                  ]
               },
               "limit": {
                  "type": "integer",
                  "maximum": 100.0,
                  "title": "Limit",
                  "description": "The maximum number of items to return",
                  "default": 100,
                  "examples": [
                     100
                  ]
               },
               "order": {
                  "type": "string",
                  "enum": [
                     "asc",
                     "desc"
                  ],
                  "title": "Order",
                  "description": "The order in which to return the items",
                  "default": "desc",
                  "examples": [
                     "desc"
                  ]
               },
               "order_by": {
                  "type": "string",
                  "title": "Order By",
                  "description": "The field to order the items by",
                  "default": "created_at",
                  "examples": [
                     "created_at"
                  ]
               },
               "after_id": {
                  "anyOf": [
                     {
                        "type": "string"
                     },
                     {
                        "type": "null"
                     }
                  ],
                  "title": "After Id",
                  "description": "The id of the item to start the list from (this item will not be included in the response)",
                  "examples": [
                     "abcdefghijklmnopqrstuvwxyz"
                  ]
               },
               "before_id": {
                  "anyOf": [
                     {
                        "type": "string"
                     },
                     {
                        "type": "null"
                     }
                  ],
                  "title": "Before Id",
                  "description": "The id of the item to end the list at (this item will not be included in the response)",
                  "examples": [
                     "abcdefghijklmnopqrstuvwxyz"
                  ]
               }
            },
            "type": "object",
            "title": "ListRequest"
         },
         "User": {
            "properties": {
               "user_id": {
                  "type": "string",
                  "title": "User Id",
                  "description": "The unique identifier for the user that this data belongs to"
               },
               "id": {
                  "type": "string",
                  "title": "Id",
                  "description": "The unique identifier for this item of data"
               },
               "created_at": {
                  "type": "integer",
                  "title": "Created At",
                  "description": "The unix timestamp of when this item of data was created, used internally for sorting"
               },
               "is_vegan": {
                  "type": "boolean",
                  "title": "Is Vegan"
               },
               "is_halal": {
                  "type": "boolean",
                  "title": "Is Halal"
               },
               "is_vegetarian": {
                  "type": "boolean",
                  "title": "Is Vegetarian"
               },
               "is_gluten_free": {
                  "type": "boolean",
                  "title": "Is Gluten Free"
               }
            },
            "type": "object",
            "required": [
               "user_id",
               "is_vegan",
               "is_halal",
               "is_vegetarian",
               "is_gluten_free"
            ],
            "title": "User"
         },
         "ValidationError": {
            "properties": {
               "loc": {
                  "items": {
                     "anyOf": [
                        {
                           "type": "string"
                        },
                        {
                           "type": "integer"
                        }
                     ]
                  },
                  "type": "array",
                  "title": "Location"
               },
               "msg": {
                  "type": "string",
                  "title": "Message"
               },
               "type": {
                  "type": "string",
                  "title": "Error Type"
               }
            },
            "type": "object",
            "required": [
               "loc",
               "msg",
               "type"
            ],
            "title": "ValidationError"
         }
      }
   }
}
```

</details>

### Database
We are using SQLite for the database. This is a simple database that
is easy to set up and use. We are using SQLAlchemy to interact with the
database. We interact with the database asynchronously to prevent blocking
the main thread (should Spark Bytes ever need that level of scalability).

The database is stored in the backend directory:
```
./backend/database.db
```

# Contributors
You can find the contributors to this project on the 
[CONTRIBUTORS.md](https://github.com/vmulu/Spark-Bytes-Group-1-/graphs/contributors) page.

If you'd like to contribute, check out the [CONTRIBUTING.md](./CONTRIBUTING.md) page.

# License
This project is licensed under the MIT License. You can find the license in the
[LICENSE](./LICENSE) file.
