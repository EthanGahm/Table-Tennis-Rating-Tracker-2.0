// Removes a player from the database
// Deletes player sheet and removes name from player list
function deletePlayer(){
  var ui = SpreadsheetApp.getUi()
  var text = ""
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
    
  var result = ui.alert(
    'Are you sure that you would like to delete ' + name + ' from the system?',
    'This action cannot be undone (without a little bit of annoying work for Ethan).',
    ui.ButtonSet.YES_NO);
  
  if (result != ui.Button.YES) {
    return
  } 
    
    // ADD CODE HERE TO DELETE PLAYER
  
}

// Checks if a certain string is a valid name for a new player.
// Must appear in the existing list of players.
function isValidNameToDelete(text){
  var playerList = [].concat(...SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Players").getRange("B2:B").getValues()) // An array of player names retrieved from the "Players" sheet
  if (playerList.includes(text)){
    return true
  }
  return false
}