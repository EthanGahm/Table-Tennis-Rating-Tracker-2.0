// Checks if a string input contains only numerals.
function isNumeric(text){
  return !isNaN(text)
}

// Fills in the leftmost column on the Active Players sheet with the appropriate rank numbers.
function updatePlayerRanks(){
  var playersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active Players")
  var numRows = playersSheet.getMaxRows()
  for (var i = 2; i <= numRows; i++){
    playersSheet.getRange(i, 1).setValue(i-1)
  }  
}

// Returns an array containing the names of all active players.
function getActivePlayers(){
  return [].concat(...SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active Players").getRange("B2:B").getValues())
}

// Updates the named range within the spreadsheet that contains all of the active player names. Ensures that dropdown menues display correct options.
function updateActivePlayerNamesRange(){
  var namedRange = getNamedRangeByName("ActivePlayerNames")
  var desiredCellRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active Players").getRange("B2:B")
  namedRange.setRange(desiredCellRange)
}

// Provides a way to reference a particular named range without having to know the index of that range.
// Name of the desired range is passed as argument and the appropriate named range is returned.
function getNamedRangeByName(name){
  var namedRanges = SpreadsheetApp.getActiveSpreadsheet().getNamedRanges()
  for (var i = 0; i < namedRanges.length; i++){
    if (namedRanges[i].getName() == name){
      return namedRanges[i]
    }
  }
}