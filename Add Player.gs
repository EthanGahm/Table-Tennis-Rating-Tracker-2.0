// Adds a player to the database.
// Creates a new player sheet and adds player as a row in the player list.
function addPlayer(){
  var ui = SpreadsheetApp.getUi()
  var text = ""
  var button = ui.Button.OK
  while (!isValidName(text) && button == ui.Button.OK) { // Continually prompts user for name until valid name is given.
    var result = ui.prompt( // Creates dialog box with text field that prompts user to enter a name.
      'Enter Player Name',
      ui.ButtonSet.OK_CANCEL)
    
    button = result.getSelectedButton() // The button the user presses.
    text = result.getResponseText() // The text the user enters.
    if (button == ui.Button.OK) {
      // User clicked "OK".
      if (isValidName(text)) {
      } else {
        ui.alert("Invalid name. Either name field was left blank, or player already exists.")
      }
    } 
  }
}

function isValidName(text){
  var playerList = [].concat(...SpreadsheetApp.getActiveSpreadsheet().getSheets()[1].getRange("B2:B").getValues()) // An array of player names retrieved from the "Players" sheet
  if (text != "" && !playerList.includes(text)){
    return true
  }
  return false
}

function newPlayerSheet(name, rating){
}