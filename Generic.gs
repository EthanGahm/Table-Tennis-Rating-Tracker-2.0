// Checks if a string input contains only numerals.
function isNumeric(text){
  return !isNaN(text)
}

// Fills in the leftmost column on the Players sheet with the appropriate rank numbers.
function updatePlayerRanks(){
  var playersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Players")
  var numRows = playersSheet.getMaxRows()
  for (var i = 2; i <= numRows; i++){
    playersSheet.getRange(i, 1).setValue(i-1)
  }  
}