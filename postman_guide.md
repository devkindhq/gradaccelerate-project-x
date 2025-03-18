# Postman Testing Guide for Notes API

This guide will help you test the Notes API endpoints using Postman.

## Setting Up Postman

1. Open Postman
2. Create a new Collection (e.g., "Notes API")
3. Create a variable for your base URL:
   - Click on "Environment quick look" (eye icon in top right)
   - Add a new variable called `baseUrl` with the value `http://localhost:3333`

## Comprehensive Testing Steps

### Step 1: Verify Database Connection

1. **Method**: GET
2. **URL**: {{baseUrl}}/debug/db-check
3. **Expected Response**: JSON with `success: true`

### Step 2: Check Notes API Status

1. **Method**: GET
2. **URL**: {{baseUrl}}/debug/notes-api
3. **Expected Response**: JSON with details about the Notes controller

### Step 3: Create a Test Note

1. **Method**: POST
2. **URL**: {{baseUrl}}/api/notes
3. **Headers**: Content-Type: application/json
4. **Body**:
```json
{
  "title": "Test Note",
  "content": "This is a test note with **markdown** formatting",
  "pinned": false
}
```
5. **Expected Response**: 201 Created with the new note object

### Step 4: Get All Notes

1. **Method**: GET
2. **URL**: {{baseUrl}}/api/notes
3. **Expected Response**: Array of notes including the one you just created

### Step 5: Get Specific Note

1. **Method**: GET
2. **URL**: {{baseUrl}}/api/notes/1 (use the ID from Step 3)
3. **Expected Response**: Single note object with rendering HTML

### Step 6: Update a Note

1. **Method**: PUT
2. **URL**: {{baseUrl}}/api/notes/1 (use the ID from Step 3)
3. **Headers**: Content-Type: application/json
4. **Body**:
```json
{
  "title": "Updated Note",
  "content": "This note has been updated with **bold** text and *italics*.",
  "pinned": true
}
```
5. **Expected Response**: Updated note object

### Step 7: Toggle Pin Status

1. **Method**: PATCH
2. **URL**: {{baseUrl}}/api/notes/1/toggle-pin (use the ID from Step 3)
3. **Expected Response**: Note object with toggled pinned status

### Step 8: Delete a Note

1. **Method**: DELETE
2. **URL**: {{baseUrl}}/api/notes/1 (use the ID from Step 3)
3. **Expected Response**: 204 No Content

## Debugging Routes

### Create a Direct Debug Test Note

- **Method**: GET
- **URL**: {{baseUrl}}/debug/notes-direct
- **Description**: Creates a test note and verifies controller functionality

### Check Notes Count

- **Method**: GET
- **URL**: {{baseUrl}}/debug/notes-count
- **Description**: Returns the count of notes in the database

## Troubleshooting Common Issues

### Issue: "Cannot find package 'marked'"
**Solution**: Run `npm run install-marked` and restart the server

### Issue: "Cannot read properties of undefined (reading 'map')"
**Solution**: Check if notes are being properly initialized as an empty array when undefined

### Issue: Database Connection Problems
**Solution**: Verify your .env configuration and check `/debug/db-check` endpoint

### Issue: 404 Not Found for API Routes
**Solution**: Ensure routes are properly defined and the controller is correctly imported

## Checking Client-Side Rendering

After testing the API with Postman, visit:
- http://localhost:3333/notes (for the notes UI)

This should display your notes if everything is working correctly.
