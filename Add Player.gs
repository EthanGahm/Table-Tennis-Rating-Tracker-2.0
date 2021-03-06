// Adds a player to the database.
// Creates a new player sheet and adds player as a row in the player list.
function addPlayer(){
  var ui = SpreadsheetApp.getUi()
  var text = ""
  var button = ui.Button.OK
  
  // GET NAME
  while (!isValidNameToAdd(text) && button == ui.Button.OK) { // Continually prompts user for name until valid name is given.
    var result = ui.prompt( // Creates dialog box with text field that prompts user to enter a name.
      'Enter player name.',
      '',
      ui.ButtonSet.OK_CANCEL)
    
    button = result.getSelectedButton() // The button the user presses.
    text = result.getResponseText() // The text the user enters.
    if (button == ui.Button.OK) {
      // User clicked "OK".
      if (isValidNameToAdd(text)) {
        var name = text // If the name entered by the user is valid, name variable is set equal to the input.
      } else {
        ui.alert("Invalid name. Either the name field was left blank, or the player already exists.")
      }
    } else {
      return // if a button other than the OK button is pressed, runs return statement to exit the function entirely.
    }
  }
  
  // GET RATING
  while (!isValidInitialRating(text) && button == ui.Button.OK) { // Continually prompts user for rating until valid initial rating is given.
    var result = ui.prompt( // Creates dialog box with text field that prompts user to enter a rating.
      'Enter initial player rating (default 100).',
      '',
      ui.ButtonSet.OK_CANCEL)
    
    button = result.getSelectedButton() // The button the user presses.
    text = result.getResponseText() // The text the user enters.
    if (button == ui.Button.OK) {
      // User clicked "OK".
      if (isValidInitialRating(text)) {
        var rating = parseFloat(text) // If the value entered by the user is valid, rating variable is set equal to a cast version of the entered value
      } else {
        ui.alert("Invalid rating. Rating values must be numerical and greater than zero.")
      }
    } else {
      return // if a button other than the OK button is pressed, runs return statement to exit the function entirely.
    }
  }
  
  // ADD PLAYER TO SYSTEM
  newPlayerSheet(name, rating)  // Once a valid name and rating have been collected, new player is created in the system by
  addToActiveList(name, rating) // adding the player to the player list and adding a new player sheet.
  updateActivePlayerNamesRange() // Ensures that the namedRange called ActivePlayerNames is up to date so that correct options display in drop down menus.
}

// Checks if a certain string is a valid name for a new player.
// Must not appear in the existing list of players and must not be an empty string.
function isValidNameToAdd(text){
  var activePlayerList = getActivePlayers() // An array of player names retrieved from the "Active Players" sheet
  var inactivePlayerList = getInactivePlayers() // An array of player names retrieved from the "Inactive Players" sheet
  if (text != "" && !activePlayerList.includes(text) && !inactivePlayerList.includes(text)){
    return true
  }
  return false
}

// Checks if a string represents a valid initial rating for a player.
// Must be numerical and greater than zero.
function isValidInitialRating(text){
  if (isNumeric(text)){ // isNumeric() function defined in the "Generic" script file.
    if (parseFloat(text) > 0){
      return true
    }
  }
  return false
}

// Creates a new individual player profile sheet for a new player.
// Copies the "Player Sheet Template" sheet.
function newPlayerSheet(name, rating){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var template = ss.getSheetByName("Player Sheet Template")
  var newSheet = ss.insertSheet(name, ss.getSheets().length, {template: template})
  newSheet.showSheet() // Ensures that the new sheet is visible.
  
  // Fills in the name, rating, and matches played boxes on the new player sheet.\
  // Rank box left unfilled for now. Will be filled in later by the addToActiveList() function.
  newSheet.getRange(1, 1).setValue(name)
  newSheet.getRange(1, 3).setValue("Rating: " + rating)
  newSheet.getRange(1, 6).setValue("Matches Played: " + 0) // Matches played set to zero since this is a new player.
  
  // Re-writes the match data on the first line in order to display initial rating on rating history graph.
  newSheet.getRange(4, 1).setValue(Utilities.formatDate(new Date(), "GMT-5", "MM/dd/yyyy"))
  newSheet.getRange(4, 2).setValue("INITIAL RATING")
  newSheet.getRange(4, 5).setValue(rating)
  newSheet.getRange(4, 6).setValue(rating)
  newSheet.getRange(4, 7).setValue(rating)
  
  SpreadsheetApp.setActiveSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Match Recorder"))
}

// Adds a player name to the active players list in the appropriate spot (sorted by rating).
function addToActiveList(name, rating, matchesPlayed = 0){
  var activePlayersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active Players")
  var ratingList = getActivePlayerRatings() // An array of player ratings retrieved from the "Active Players" sheet.
  var rowNum = 0

  for (var i = 0; i < ratingList.length; i++) {
    if (rating > ratingList[i]){
      var rowNum = i + 2 // Because the players start being listed on row number 2, but the list indexes from 0, add 2 to get row number.
      activePlayersSheet.insertRowBefore(rowNum) // Create new row for the player.
      break
    }
  }
  if (rowNum == 0) { // If the player is the lowest rated player on the list so far, add at bottom.
    var rowNum = ratingList.length + 2
    activePlayersSheet.insertRowAfter(rowNum-1) // Create new row for the player.
  }
  activePlayersSheet.getRange(rowNum, 2).setValue(name) // Add name to appropriate cell.
  activePlayersSheet.getRange(rowNum, 3).setValue(rating) // Add rating to appropriate cell.
  activePlayersSheet.getRange(rowNum, 4).setValue(matchesPlayed) // Adds the value 0 to the cell denoting the number of matches played (new player hasn't played any matches)
  activePlayersSheet.getRange(rowNum, 2).setFormula('=HYPERLINK("#gid=' + SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name).getSheetId() + '", "' + name + '")')
  updatePlayerRanks() // Re-writes the rank numbers for all players on the list to "fill in the gap" created by the new row.
  fixPlayerSheetRankValues() // Ensures that the rank values listed on the "Active Players" sheet match the values recorded on the individual player sheets.
}