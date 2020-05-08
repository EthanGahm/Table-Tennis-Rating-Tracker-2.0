// When the spreadsheet is opened creates a menu at the top of the page called "Spreadsheet Actions."
// Includes options to add or delete a player.
function onOpen(){
  
  SpreadsheetApp.getActiveSpreadsheet.getSheets()[2].getRange("A1").setValue("")
  
  var ui = SpreadsheetApp.getUi() 
  ui.createMenu("Spreadsheet Actions")
      .addItem("Delete Player", "deletePlayer")
      .addItem("Add New Player", "addPlayer")
      .addToUi()
}

