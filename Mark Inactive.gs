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
    
  deletePlayerSheet(name) // Deletes the personal player sheet of the specified player.
  deletePlayerFromActiveList(name) // Removes the row containing the name and information of the specified player from the Active Players sheet.
  updateActivePlayerNamesRange() // Ensures that the namedRange called ActivePlayerNames is up to date so that correct options display in drop down menus.
}