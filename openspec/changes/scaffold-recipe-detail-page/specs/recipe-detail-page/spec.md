# Spec Delta

## Purpose

Shows a single stored recipe on its own page at `/recipes/{id}`, the page every recipe link in the app points to. Defines how an id in the URL resolves to a recipe, how the page responds when it does not, and what the page takes from the recipe.

## ADDED Requirements

### Requirement: Recipe page is served at its id

The system SHALL serve a page for each stored recipe at `/recipes/{id}`. `{id}` is the recipe's id as a 24-character hexadecimal string, the same form the home page's recipe links already use. Access SHALL NOT depend on the recipe's visibility.

#### Scenario: Stored recipe

- **WHEN** a request is made for `/recipes/{id}` and `{id}` is the id of a stored recipe
- **THEN** the system responds with HTTP 200 and that recipe's page

#### Scenario: Following a recipe link from the home page

- **WHEN** a user activates a recipe card, or the featured recipe's "View Full Recipe" link, on the home page
- **THEN** that recipe's page is shown, not a not-found page

#### Scenario: Private recipe

- **WHEN** `{id}` belongs to a stored recipe whose visibility is `private`
- **THEN** the page is served exactly as it would be for a `public` recipe

### Requirement: Page heading is the recipe name

The recipe page SHALL render exactly one top-level heading (`h1`), and its text SHALL be the stored recipe's name.

#### Scenario: Heading shows the stored name

- **WHEN** the page for a stored recipe is rendered
- **THEN** the page contains a single `h1` whose text equals the recipe's stored `name`

### Requirement: Page reflects the recipe as currently stored

Every request for a recipe page SHALL reflect the recipe as stored at the time of that request. The system SHALL NOT serve a copy rendered or cached for an earlier request.

#### Scenario: Recipe renamed after a previous visit

- **WHEN** a recipe's page has been requested, the recipe's `name` is then changed in the database, and the page is requested again
- **THEN** the page's heading shows the new name

#### Scenario: Recipe deleted after a previous visit

- **WHEN** a recipe's page has been requested, the recipe is then deleted, and the page is requested again
- **THEN** the system responds as it does for an unknown id

### Requirement: Unknown recipe ids respond as not found

When `{id}` is a well-formed recipe id that matches no stored recipe, the system SHALL respond with HTTP 404 and the application's not-found page instead of a recipe page.

#### Scenario: Well-formed id with no matching recipe

- **WHEN** a request is made for `/recipes/000000000000000000000000` and no stored recipe has that id
- **THEN** the system responds with HTTP 404 and the not-found page, and renders no recipe heading

### Requirement: Malformed recipe ids respond as not found

When `{id}` is not a 24-character hexadecimal string, the system SHALL respond exactly as it does for an unknown id: HTTP 404 and the not-found page. It SHALL NOT respond with any other client-error or server-error status.

#### Scenario: Id that is not hexadecimal

- **WHEN** a request is made for `/recipes/not-a-recipe`
- **THEN** the system responds with HTTP 404 and the not-found page

#### Scenario: Hexadecimal id of the wrong length

- **WHEN** a request is made for `/recipes/` followed by 23 hexadecimal characters
- **THEN** the system responds with HTTP 404 and the not-found page

### Requirement: Load failures are errors, not "not found"

When a recipe cannot be loaded because something failed, such as the database being unreachable, the system SHALL respond with HTTP 500. It SHALL NOT respond with the not-found page or a 404 status, so an outage is never reported as a missing recipe.

#### Scenario: Database unavailable

- **WHEN** the database is unreachable and a request is made for `/recipes/{id}` with a well-formed id
- **THEN** the system responds with HTTP 500 and does not render the not-found page

### Requirement: Document metadata comes from the recipe

The recipe page's document title SHALL be the recipe's name, and its meta description SHALL be the recipe's description.

#### Scenario: Title and description

- **WHEN** the page for a stored recipe is rendered
- **THEN** the document's `<title>` is the recipe's `name`, and the `<meta name="description">` content is the recipe's `description`
