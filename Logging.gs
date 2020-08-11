// Google App Scripts' built in Logger.log() function seems not to be working for some reason. This is a replacement.
// Takes a string parameter displays it in the first cell of the "Debugging Log" sheet.
function log(text){
  var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Debugging Log")
  logSheet.getRange("A1").setValue(logSheet.getRange("A1").getValue() + "\n" + text)
}

// Clears the log sheet.
// Called with a press of the "clear log" button.
function clearLog(){
  var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Debugging Log")
  logSheet.getRange("A1").setValue(null)
}