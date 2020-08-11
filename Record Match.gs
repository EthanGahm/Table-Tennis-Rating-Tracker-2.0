// Updates player ratings based on the most recently entered match.
// Adds the match data for the most recently entered match to the top of the match list and clears the new match row.
// Performs this operation only if the match data is valid.
function recordMatch(){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var matchRecorder = ss.getSheetByName("Match Recorder")
  var matchData = [].concat(...matchRecorder.getRange("B4:E4").getValues()) // An array containing the date, players, best of, and score information for the last entered match
  
  // Check if the input match is valid before doing anything with it.
  if (!isValidMatchData(matchData)){
    return false
  }
  
  // Break up the match data into more easily accessible variables
  var date = matchData[0]
  var winnerName = matchData[1]
  var loserName = matchData[2]
  var score = matchData[3]
  
  // Insert a new row in the recorded matches section of the sheet, below the first row but above all of the others.
  // Resize this row so that it is not thicc.
  matchRecorder.insertRowAfter(7)
  matchRecorder.setRowHeight(8, 21)
  
  // Copy data from first row in the recorded matches section into the second (new) row in the recorded matches section.
  for (var i = 2; i < 7; i++){
    matchRecorder.getRange(8, i).setValue(matchRecorder.getRange(7, i).getValue())
  }
  
  // Copy data from the input row into the top row of the recorded matches section.
  for (var i = 2; i < 7; i++){
    matchRecorder.getRange(7, i).setValue(matchRecorder.getRange(4, i).getValue())
  }
  
  // Clear out to the names of the players and the score from the input row to allow for next entry.
  matchRecorder.getRange(4, 3).setValue("")
  matchRecorder.getRange(4, 4).setValue("")
  matchRecorder.getRange(4, 6).setValue("")
}

// Takes in an array containing data sourced from the new match row.
// Returns boolean indicating if data is valid.
// Players must not be the same as each other, date of match must not be in the future.
function isValidMatchData(matchData){
  var ui = SpreadsheetApp.getUi()
  log(matchData[0])
  if (matchData[1] == matchData[2]){
    ui.alert("Invalid entry. A player cannot compete against themself.")
    return false
  } else if (new Date() < matchData[0]) {
    ui.alert("Invalid entry. You cannot record the result of a match taking place in the future.")
    return false
  }
  return true
}