function markInactive(){
  var ui = SpreadsheetApp.getUi()
  var text = ""
  var button = ui.Button.OK
  
  // GET NAME
  while (!getActivePlayers().includes(text) && button == ui.Button.OK) { // Continually prompts user for name until valid name is given.
    var result = ui.prompt( // Creates dialog box with text field that prompts user to enter a name.
      'Enter the name of the player who you would like to mark as inactive.',
      '',
      ui.ButtonSet.OK_CANCEL)
    
    button = result.getSelectedButton() // The button the user presses.
    text = result.getResponseText() // The text the user enters.
    if (button == ui.Button.OK) {
      // User clicked "OK".
      if (getActivePlayers().includes(text)) {
        var name = text // If the name entered by the user is valid, name variable is set equal to the input.
      } else {
        ui.alert("There is no currently active player with the name " + text + ".")
      }
    } else {
      return // if a button other than the OK button is pressed, runs return statement to exit the function entirely.
    }
  }
  moveActiveToInactive(name)
}

// Deletes a player from the active players list and adds them to the inactive players list.
function moveActiveToInactive(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var activePlayersSheet = ss.getSheetByName("Active Players")
  setRankInactive(name) // Updates a given player's rank on their player sheet to say "Rank: INACTIVE"
  var activePlayerData = [].concat(...activePlayersSheet.getRange(getRowNumByValue(name, 2, activePlayersSheet), 1, 1, 4).getValues()) // An array containing the data from the row in the active players sheet corresponding to the player in question
  
  deleteFromActiveList(name) // Removes the row containing the name and information of the specified player from the Active Players sheet.
  updateActivePlayerNamesRange() // Ensures that the namedRange called ActivePlayerNames is up to date so that correct options display in drop down menus.
  addToInactiveList(activePlayerData)
}

// Updates a given player's rank on their player sheet to say "Rank: INACTIVE"
function setRankInactive(name){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var playerSheet = ss.getSheetByName(name)
  playerSheet.getRange(1, 5).setValue("Rank: INACTIVE")
}

// Takes in a row of data from the active players sheet and uses that data to add an entry in the inactive players sheet
function addToInactiveList(activePlayerData){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var inactivePlayersSheet = ss.getSheetByName("Inactive Players")
  
  inactivePlayersSheet.insertRowAfter(inactivePlayersSheet.getMaxRows()) // Creates a new row at the end of the list.
  var rowNum = inactivePlayersSheet.getMaxRows() // The number of the last row in the list. The row that we will be adding to.
  inactivePlayersSheet.getRange(rowNum, 1).setValue(activePlayerData[1]) // Sets the first cell in this row to the player's name.
  inactivePlayersSheet.getRange(rowNum, 2).setValue(activePlayerData[2]) // Sets the second cell in this row to the player's rating.
  inactivePlayersSheet.getRange(rowNum, 3).setValue(activePlayerData[3]) // Sets the third cell in this row to the number of matches the player has played.
  inactivePlayersSheet.getRange(rowNum, 4).setValue(Utilities.formatDate(new Date(), "GMT-5", "MM/dd/yyyy")) // Sets the fourth cell in this row to the current date (the date they were marked inactive).
}