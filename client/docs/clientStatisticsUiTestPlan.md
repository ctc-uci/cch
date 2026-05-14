# Client Statistics UI Test Plan

## Scope

This test plan covers the UI changes for:

- editing submitted `Client Tracking Statistics (Intake Statistics)` records
- relaxing required fields in `Add Client`
- adding date filters to the forms-history stats table
- adding same-year date filters to the monthly statistics page

## Prerequisites

- the client and server are running locally
- the database includes test data for:
  - at least one existing intake statistics record
  - at least one existing client
  - monthly statistics entries across multiple months in a single year

## 1. Edit Submitted Intake Statistics Records

Goal: confirm staff can edit an existing submitted intake statistics record.

1. Open the forms hub.
2. Locate a `Client Tracking Statistics (Intake Statistics)` record.
3. Open the record preview.
4. Click `Edit Form`.
5. Update the following:
   - `Site`
   - one text field such as `Assigned Case Manager` or `City`
   - one numeric or yes/no field
6. Save the form.

Expected results:

- a success toast appears
- the drawer remains stable after save
- reopening the same record shows the updated values
- the updated values still appear after refreshing the page

Edge checks:

- edit only the `Site` field and save
- save changes to a numeric field
- save changes to a yes/no field

## 2. Add Client Required Fields

Goal: confirm only the fields through case manager are required.

Expected required fields:

- `First Name`
- `Last Name`
- `Status`
- `Unit`
- `Case Manager`

### Happy path

1. Open `Add Client`.
2. Fill only the required fields above.
3. Leave all later fields blank.
4. Submit.

Expected results:

- the client is created successfully
- no validation errors appear for later fields
- the app does not insert obvious placeholder values such as `0`, `false`, or invalid dates in the UI

### Validation check

1. Open `Add Client`.
2. Leave one required field blank, such as `Case Manager`.
3. Submit.

Expected results:

- the form shows validation feedback
- the client is not created

### Follow-up display check

1. Open the newly created client record.
2. Review optional fields that were left blank.

Expected results:

- blank optional values render as blank
- blank optional boolean fields do not display misleading `No` values

## 3. Forms-History Date Filters

Goal: confirm `is after`, `is before`, and `is between` work in the forms-history filter UI.

### Is after

1. Open the forms-history table.
2. Add a filter:
   - `Date`
   - `is after`
   - choose a known date

Expected results:

- only records later than the selected date remain visible

### Is before

1. Add a filter:
   - `Date`
   - `is before`
   - choose a known date

Expected results:

- only records earlier than the selected date remain visible

### Is between

1. Add a filter:
   - `Date`
   - `is between`
   - choose a start date
   - choose an end date

Expected results:

- the UI shows a second date input only for `is between`
- only records inside the selected date range remain visible

### Filter composition

1. Combine a date filter with another filter using `AND`.
2. Combine a date filter with another filter using `OR`.

Example combinations:

- `Date is after ... AND Name contains ...`
- `Date is between ... OR Form Title equals ...`

Expected results:

- combined filters behave consistently with the existing `AND` / `OR` behavior

## 4. Monthly Statistics Date Filters

Goal: confirm the monthly statistics page supports same-year date filtering without breaking the Jan-Dec layout.

### Baseline

1. Open `Monthly Statistics`.
2. Select a year.

Expected results:

- the report loads normally for the selected year

### Is after

1. Select a year.
2. Set the date operator to `Is after`.
3. Choose a date within that same year.

Expected results:

- the report reloads successfully
- only months after that date contribute data
- export still works

### Is before

1. Select a year.
2. Set the date operator to `Is before`.
3. Choose a date within that same year.

Expected results:

- the report reloads successfully
- only months before that date contribute data
- export still works

### Is between

1. Select a year.
2. Set the date operator to `Is between`.
3. Choose two dates within that same year.

Expected results:

- the report reloads successfully
- only months inside the selected range contribute data
- export still works

### Year-boundary behavior

1. Apply a date filter.
2. Change the selected year.

Expected results:

- the filter resets cleanly when the year changes
- date input values remain constrained to the selected year

## 5. Final Smoke Test

1. Open forms hub.
2. Edit an intake statistics record.
3. Add a client with only the required fields.
4. Use forms-history date filters.
5. Use monthly statistics date filters.
6. Export monthly statistics.

Expected results:

- no broken navigation
- no blank-screen routes
- no obvious UI regressions in the touched flows
