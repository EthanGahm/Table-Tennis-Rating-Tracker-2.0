/* 
 ELO RATING SYSTEM EXPLANATION:
 - This whole system is based off of the explanation in this video: https://www.youtube.com/watch?v=AsYfbmp0To0
 - By default, new players begin with a rating of 100.
 - System is designed so that if a player has a rating 100 points higher than their opponent, they are 10x more likely to win a single game/set.
 - Maximum number of points that can be won or lost from a single game is 4. This means that the maximum number of points that can be won in a match is 12 (a 3-0 match that is also a major upset)
 - Probability that the player who actually won the game was going to win the game, based off of pre-game ratings:
 P(winner wins) = 1 / (1 + 10^((winnerRating - loserRating)/100))
 - Probability that the player who actually lost the game was going to win the game, based off of pre-game ratings:
 P(loser wins) = 1 / (1 + 10^((loserRating - winnerRating)/100))
 - Update rating formula (applied inidividually for both the winner and the loser after a match)
 FOR WINNER: New rating = old rating + 4 * (1 - probability of winning)
 FOR LOSER: New rating = old rating - 4 * probability of winning
*/

// Updates player ratings based on the most recently entered match.
// Adds the match data for the most recently entered match to the top of the match list and clears the new match row.
// Performs this operation only if the match data is valid.
function recordMatch(){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var matchRecorder = ss.getSheetByName("Match Recorder")
  var matchData = [].concat(...matchRecorder.getRange("B4:F4").getValues()) // An array containing the date, players, best of, and score information for the last entered match
  
  // Check if the input match is valid before doing anything with it.
  if (!isValidMatchData(matchData)){
    return false
  }
  
  // Break up the match data into more easily accessible variables
  var date = matchData[0]
  var winnerName = matchData[1]
  var loserName = matchData[2]
  var score = matchData[4]
  
  // Define some other useful values
  var winnerWins = parseInt(score[0])
  var loserWins = parseInt(score[2])
  
  var initialWinnerRating = parseInt(ss.getSheetByName(winnerName).getRange(1, 3).getValue().slice(8)) // Extracts the initial rating of the winner from their player sheet.
  var initialLoserRating = parseInt(ss.getSheetByName(loserName).getRange(1, 3).getValue().slice(8)) // Does the same for the loser.

  var winnerRatingChange = calcRatingChange(initialWinnerRating, initialLoserRating, winnerWins, loserWins) // call the calcRatingChange() function to actually do the math for us
  var loserRatingChange = calcRatingChange(initialLoserRating, initialWinnerRating, loserWins, winnerWins)
  
  var newWinnerRating = initialWinnerRating + winnerRatingChange // Applies the change in rating to the initial rating
  var newLoserRating = initialLoserRating + loserRatingChange
  
  // Add the match to each player's player sheet
  writeMatchToPlayerSheet(winnerName, date, loserName, score, 'W', winnerRatingChange, initialWinnerRating, newWinnerRating)
  writeMatchToPlayerSheet(loserName, date, winnerName, score, 'L', loserRatingChange, initialLoserRating, newLoserRating)
  
  // Update each player's rating on the active/inactive player list and on their respective player sheets
  updatePlayerRating(winnerName, newWinnerRating)
  updatePlayerRating(loserName, newLoserRating)
  
  // Increments the number of matches played for both players
  updateMatchesPlayed(winnerName, 1)
  updateMatchesPlayed(loserName, 1)
  
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
  
  // Clear out the names of the players and the score from the input row to allow for next entry.
  matchRecorder.getRange(4, 3).setValue("")
  matchRecorder.getRange(4, 4).setValue("")
  matchRecorder.getRange(4, 6).setValue("")
}

// Takes in an array containing data sourced from the new match row.
// Returns boolean indicating if data is valid.
// Players must not be the same as each other, date of match must not be in the future.
function isValidMatchData(matchData){
  var ui = SpreadsheetApp.getUi()
  if (matchData.includes("")) {
    ui.alert("Invalid entry. Ensure all input fields are filled in.")
    return false
  } else if (matchData[1] == matchData[2]){ // checks to make sure both players are not the same.
    ui.alert("Invalid entry. A player cannot compete against themself.")
    return false
  } else if (new Date() < matchData[0]) { // checks to make sure that the match was not played in the future.
    ui.alert("Invalid entry. You cannot record the result of a match taking place in the future.")
    return false
  }
  return true
}

// Given two initial ratings and a number of games won and lost, returns the rating adjustment for a single player.
function calcRatingChange(rating, oppRating, gamesWon, gamesLost) {
  var ratingChange = 0;
  var winProb = 1.0 / (1.0 + Math.pow(10.0, ((rating - oppRating)/100.0))) 
  
  for (var i = 0; i < gamesWon; i++){
    ratingChange += 4 * winProb
  }
  
  for (var i = 0; i < gamesLost; i++){
    ratingChange -= 4 * (1-winProb)
  }
  
  return ratingChange
}

// Re-writes the rating of a player (given by name) both on the players list (active or inactive) and on their player sheet.
function updatePlayerRating(name, newRating){
  if (getActivePlayers().includes(name)){
    var activePlayersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active Players")
    var rowNum = getRowNumByValue(name, 2, activePlayersSheet, 2)
    activePlayersSheet.getRange(rowNum, 3).setValue(newRating)
    sortActivePlayers() // Sorts the rows of the Active Players sheet according to rating in case the ordering has changed.
    updatePlayerRanks() // Ensures that all players have the correct rank value listed on their player sheet.
    
  } else if (getInactivePlayers().includes(name)){
    var inactivePlayersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inactive Players")
    var rowNum = getRowNumByValue(name, 1, inactivePlayersSheet, 2)
    inactivePlayersSheet.getRange(rowNum, 2).setValue(newRating)
  }
  
  var playerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name)
  playerSheet.getRange(1, 3).setValue("Rating: " + newRating.toFixed(0).toString())
}

// Either increments or decrements (depending on the sign of the numMatchesChange parameter) the number of matches played by a certain player.
// Updates fields both on the player sheet and on the Active Players/Inactive Players sheet.
function updateMatchesPlayed(name, numMatchesChange){
  if (getActivePlayers().includes(name)){
    var playerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name)
    var initialMatchesPlayed = parseInt(playerSheet.getRange(1, 6).getValue().slice(16))
    var activePlayersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Active Players")
    var rowNum = getRowNumByValue(name, 2, activePlayersSheet, 2)
    activePlayersSheet.getRange(rowNum, 4).setValue(activePlayersSheet.getRange(rowNum, 4).getValue() + numMatchesChange)

  } else if (getInactivePlayers().includes(name)){
    var inactivePlayersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inactive Players")
    var rowNum = getRowNumByValue(name, 1, inactivePlayersSheet, 2)
    inactivePlayersSheet.getRange(rowNum, 3).setValue(inactivePlayersSheet.getRange(rowNum, 3).getValue() + numMatchesChange)
  }
  
  playerSheet.getRange(1, 6).setValue("Matches Played: " + (initialMatchesPlayed + numMatchesChange).toString()) // Updates value on player sheet.
}

function writeMatchToPlayerSheet(name, date, oppName, score, WorL, ratingAdjustment, initialRating, finalRating) {
  var playerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name)
  var rowNum = playerSheet.getMaxRows()
  playerSheet.getRange(rowNum, 1).setValue(date)
  playerSheet.getRange(rowNum, 2).setValue(oppName)
  playerSheet.getRange(rowNum, 3).setValue(score)
  playerSheet.getRange(rowNum, 4).setValue(WorL)
  playerSheet.getRange(rowNum, 5).setValue(ratingAdjustment)
  playerSheet.getRange(rowNum, 6).setValue(initialRating)
  playerSheet.getRange(rowNum, 7).setValue(finalRating)
  playerSheet.insertRowAfter(rowNum)
}