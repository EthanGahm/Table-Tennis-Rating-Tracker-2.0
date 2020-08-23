// Checks if a string input contains only numerals.
function isNumeric(text){
  return !isNaN(text)
}

// Fills in the leftmost column on the Active Players sheet with the appropriate rank numbers.
function updatePlayerRanks(){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var playersSheet = ss.getSheetByName("Active Players")
  var numRows = playersSheet.getMaxRows()
  for (var i = 2; i <= numRows; i++){
    playersSheet.getRange(i, 1).setValue(i-1) // Assigns value in left-most column of the active players sheet.
  }  
}

// Checks to see if each player's rank is matched on their player sheet. If it is not, updates their rank on their player sheet.
function fixPlayerSheetRankValues(){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var playersSheet = ss.getSheetByName("Active Players")
  var numRows = playersSheet.getMaxRows()
  for (var i = 2; i <= numRows; i++){
    log(playersSheet.getRange(i, 2).getValue())
    var rankOnSheet = ss.getSheetByName(playersSheet.getRange(i, 2).getValue()).getRange(1, 5).getValue() // Extracts the content of the "rank" cell on the player sheet.
    rankOnSheet = parseInt(rankOnSheet.slice(5, rankOnSheet.length), 10) // Extracts the numerical rank value from the content of the "rank" cell, parsing it to an int
    if (playersSheet.getRange(i, 1).getValue() != rankOnSheet){ // Checks to see if the two rank values match each other.
      ss.getSheetByName(playersSheet.getRange(i, 2).getValue()).getRange(1, 5).setValue("Rank: " + playersSheet.getRange(i, 1).getValue()) // If they don't match, updates the value on the player sheet.
    }
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

// Finds and returns the number of the first row in a particular sheet with a particular value at a particular position.
function getRowNumByValue(value, pos, sheet){
  for (var i = 1; i <= sheet.getMaxRows(); i++) {
    if (sheet.getRange(i, pos) == value){
      return i
    }
  }
  return null
}

// Finds and returns the number of the first column in a particular sheet with a particular value at a particular position.
function getColumnNumByValue(value, pos, sheet){
  for (var i = 1; i <= sheet.getMaxColumns(); i++) {
    if (sheet.getRange(pos, i) == value){
      return i
    }
  }
  return null
}
  
function returnToMatchRecorder(){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  ss.setActiveSheet(ss.getSheetByName("Match Recorder"))
}