// Removes a player from the database
// Deletes player sheet and removes name from player list
function deletePlayer(){
  var ui = SpreadsheetApp.getUi()
  var text = "NO INPUT"
  var button = ui.Button.OK
  
  // GET NAME
  while (!isValidNameToDelete(text) && button == ui.Button.OK) { // Continually prompts user for name until valid name is given.
    var result = ui.prompt( // Creates dialog box with text field that prompts user to enter a name.
      'Enter the name of the player who you would like to remove.',
      '',
      ui.ButtonSet.OK_CANCEL)
    
    button = result.getSelectedButton() // The button the user presses.
    text = result.getResponseText() // The text the user enters.
    if (button == ui.Button.OK) {
      // User clicked "OK".
      if (isValidNameToDelete(text)) {
        var name = text // If the name entered by the user is valid, name variable is set equal to the input.
      } else {
        ui.alert("Invalid name. A player by the name " + text + " is not present in the system.")
      }
    } else {
      return // if a button other than the OK button is pressed, runs return statement to exit the function entirely.
    }
  }
    
  var result = ui.alert( // Checks to make sure the user would really like to delete the player from the system.
    'Are you sure that you would like to delete ' + name + ' from the system?',
    'Removing players can break things if you are not careful. The "Remove Player" option should be used almost exclusively for when a player was JUST added to the system with an error in their name or initial rating. In nearly all other scenarios, the "Mark Inactive" option should be used instead.',
    ui.ButtonSet.YES_NO);
  
  if (result != ui.Button.YES) { // If the user presses a button other than YES (either NO or the x in the top right), cancels operation.
    return
  } 
    
  deletePlayerSheet(name) // Deletes the personal player sheet of the specified player.
  deleteFromActiveList(name) // Removes the row containing the name and information of the specified player from the Active Players sheet.
  deleteFromInactiveList(name) // Tries to remove the player from the inactive players sheet. The player should only really be present on one of the sheets, but try both anyway.
  updateActivePlayerNamesRange() // Ensures that the namedRange called ActivePlayerNames is up to date so that correct options display in drop down menus.
}

// Deletes the personal player profile sheet for a given player. 
function deletePlayerSheet(name){
  var personalPlayerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name)
  if (personalPlayerSheet){
    SpreadsheetApp.getActiveSpreadsheet().deleteSheet(personalPlayerSheet) // Will only run this line, deleting the sheet, if the sheet exists (per the if statement).
  }
}

// Removes a specified player's row from the players list.
function deleteFromActiveList(name){
  var activePlayersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active Players")
  var playerList = getActivePlayers() // An array of player ratings retrieved from the "Active Players" sheet.
  for (var i = 0; i < playerList.length; i++){ // Iterates through rows in the "Active Players" sheet until the row is found that contains the players name.
    if (playerList[i] == name){
      activePlayersSheet.deleteRow(i+2) // Deletes row.
      break
    }
  }
  
  updatePlayerRanks() // Re-writes the rank numbers for all players on the list to "fill in the gap" created by deleting the old row.
  fixPlayerSheetRankValues() // Ensures that the rank values listed on the "Active Players" sheet match the values recorded on the individual player sheets.
}

// Removes a specified player's row from the inactive players list.
function deleteFromInactiveList(name){
  var inactivePlayersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inactive Players")
  var playerList = getInactivePlayers() // An array of player ratings retrieved from the "Active Players" sheet.
  for (var i = 0; i < playerList.length; i++){ // Iterates through rows in the "Active Players" sheet until the row is found that contains the players name.
    if (playerList[i] == name){
      inactivePlayersSheet.deleteRow(i+2) // Deletes row.
      break
    }
  }
}

// Checks if a certain string is a valid name for a new player.
// Must appear in the existing list of players.
function isValidNameToDelete(text){
  if (getActivePlayers().includes(text) || getInactivePlayers().includes(text)){
    return true
  }
  return false
}