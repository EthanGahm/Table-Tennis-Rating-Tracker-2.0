function markActive(){
  var ui = SpreadsheetApp.getUi()
  var text = ""
  var name = ""
  var button = ui.Button.OK
  
  // GET NAME
  while (!getInactivePlayers().includes(text) && button == ui.Button.OK) { // Continually prompts user for name until valid name is given.
    var result = ui.prompt( // Creates dialog box with text field that prompts user to enter a name.
      'Enter the name of the player who you would like to mark as active.',
      '',
      ui.ButtonSet.OK_CANCEL)
    
    button = result.getSelectedButton() // The button the user presses.
    text = result.getResponseText() // The text the user enters.
    if (button == ui.Button.OK) {
      // User clicked "OK".
      if (getInactivePlayers().includes(text)) {
        name = text // If the name entered by the user is valid, name variable is set equal to the input.
      } else {
        ui.alert("There is no currently inactive player with the name " + text + ".")
      }
    } else {
      return // if a button other than the OK button is pressed, runs return statement to exit the function entirely.
    }
  }
  moveInactiveToActive(name)
}

// Deletes a player from the active players list and adds them to the inactive players list.
function moveInactiveToActive(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var inactivePlayersSheet = ss.getSheetByName("Inactive Players")
  var inactivePlayerData = [].concat(...inactivePlayersSheet.getRange(getRowNumByValue(name, 1, inactivePlayersSheet, 2), 1, 1, 4).getValues()) // An array containing the data from the row in the inactive players sheet corresponding to the player in question
  
  deleteFromInactiveList(name) // Removes the row containing the name and information of the specified player from the Inactive Players sheet.
  addToActiveList(inactivePlayerData[0], inactivePlayerData[1], inactivePlayerData[2]) // Actually a call to the addToActiveList() function defined in the "Add Player" file.
  updateActivePlayerNamesRange() // Ensures that the namedRange called ActivePlayerNames is up to date so that correct options display in drop down menus.
}