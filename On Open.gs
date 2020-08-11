function onOpen(){
  // Automatically fills in the current day's date on the Match Recorder sheet.
  var date = Utilities.formatDate(new Date(), "GMT-5", "MM/dd/yyyy")
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Match Recorder").getRange("B4").setValue(date)
  
  // Automatically sets the "best of" column on the Match Recorder sheet to Best of 5
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Match Recorder").getRange("E4").setValue("five")
}

