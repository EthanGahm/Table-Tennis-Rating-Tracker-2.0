// Undoes the effects of the last match recorded, removing it from the top of the match list.
// Fills in the new match row with the data from this match.
function unrecordLastMatch(){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var matchRecorder = ss.getSheetByName("Match Recorder")
  var matchData = [].concat(...matchRecorder.getRange("B7:F7").getValues()) // An array containing the date, players, best of, and score information for the last entered match
  
  // Checks if the top row of the recorded matches section is a valid match that can be removed.
  if (!validMatchToDelete(matchData)){
    return false
  }
  
  // Break up the match data into more easily accessible variables
  var date = matchData[0]
  var winnerName = matchData[1]
  var loserName = matchData[2]
  var score = matchData[4]
  
  // Define variables for the player sheets of the winner and loser
  var winnerSheet = ss.getSheetByName(winnerName)
  var loserSheet = ss.getSheetByName(loserName)

  // Extracts the initial rating of each player from their player sheet. This "initial rating" is their rating taking into account the most recent match which we are now trying to undo.
  var initialWinnerRating = parseInt(ss.getSheetByName(winnerName).getRange(1, 3).getValue().slice(8)) 
  var initialLoserRating = parseInt(ss.getSheetByName(loserName).getRange(1, 3).getValue().slice(8))
  
  // Extracts the rating changes for each player from their respective player sheets
  var winnerRatingChange = winnerSheet.getRange(winnerSheet.getMaxRows() - 1, 5).getValue()
  var loserRatingChange = loserSheet.getRange(loserSheet.getMaxRows() - 1, 5).getValue()
  
  // Subtracts the rating changes from the players' existing rating to restore the original rating.
  var newWinnerRating = initialWinnerRating - winnerRatingChange // Applies the change in rating to the initial rating
  var newLoserRating = initialLoserRating - loserRatingChange
  
  // Delete the row corresponding to the removed match from each players' player sheet
  deleteLastMatchFromPlayerSheet(winnerName)
  deleteLastMatchFromPlayerSheet(loserName)
  
  // Update each player's rating on the active/inactive player list and on their respective player sheets
  updatePlayerRating(winnerName, newWinnerRating)
  updatePlayerRating(loserName, newLoserRating)
  
  // Decrements the number of matches played for both players
  updateMatchesPlayed(winnerName, -1)
  updateMatchesPlayed(loserName, -1)
  
  // Copy data from first row in the recorded matches section into the input row.
  for (var i = 2; i < 7; i++){
    matchRecorder.getRange(4, i).setValue(matchRecorder.getRange(7, i).getValue())
  }
  
  // Copy data from the second row of the recorded matches section into the top row of the recorded matches section.
  for (var i = 2; i < 7; i++){
    matchRecorder.getRange(7, i).setValue(matchRecorder.getRange(8, i).getValue())
  }
  
  // Deletes the second row of the recorded matches section whose data has just been copied into the first row
  matchRecorder.deleteRow(8)
}

function deleteLastMatchFromPlayerSheet(name){
  var playerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name)
  var rowNum = playerSheet.getMaxRows() - 1
  playerSheet.deleteRow(rowNum)
}

// Ensures that a set of match data does not contain any blank fields and that therefore it is a complete match that can be deleted.
function validMatchToDelete(matchData){
  if (matchData.includes("")){
    var ui = SpreadsheetApp.getUi()
    ui.alert("No valid match exists to undo.")
    return false
  }
  return true
}