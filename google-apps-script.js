/**
 * =========================================================================
 * SUJNANA NATIONAL PUBLIC SCHOOL - GOOGLE APPS SCRIPT WEBHOOK FOR CONTACT FORM
 * =========================================================================
 */

/**
 * Run this function once from the Apps Script editor (Select 'initialSetup' -> click 'Run')
 * to immediately create the table columns, headers, and navy blue styling in your Google Sheet!
 */
function initialSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // Name the sheet
  sheet.setName('Contact Enquiries');

  var headers = [
    'Timestamp',
    'Full Name',
    'Email Address',
    'Phone Number',
    'Subject',
    'Message Details'
  ];

  // Set header values in Row 1
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format Header Row (Navy Blue #002B66, White Bold Text, Centered vertically, 35px height)
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#002B66');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontSize(11);
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);

  // Set comfortable column widths
  sheet.setColumnWidth(1, 180); // Timestamp
  sheet.setColumnWidth(2, 180); // Full Name
  sheet.setColumnWidth(3, 220); // Email Address
  sheet.setColumnWidth(4, 150); // Phone Number
  sheet.setColumnWidth(5, 180); // Subject
  sheet.setColumnWidth(6, 320); // Message Details

  Logger.log("✅ Table columns and formatting created successfully!");
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Contact Enquiries') || ss.getActiveSheet();

    // Ensure header row exists
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
      var headers = [
        'Timestamp',
        'Full Name',
        'Email Address',
        'Phone Number',
        'Subject',
        'Message Details'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#002B66');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontSize(11);
      headerRange.setVerticalAlignment('middle');
      sheet.setRowHeight(1, 35);
      sheet.setFrozenRows(1);
    }

    // Parse incoming request data (handles both JSON and FormData)
    var rawData = {};
    if (e && e.postData && e.postData.contents) {
      try {
        rawData = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        rawData = e.parameter || {};
      }
    } else if (e && e.parameter) {
      rawData = e.parameter;
    }

    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, Session.getScriptTimeZone() || "GMT+5:30", "yyyy-MM-dd HH:mm:ss");

    var fullName = rawData.name || rawData.fullName || '';
    var email = rawData.email || '';
    var phone = rawData.phone || rawData.mobile || '';
    var subject = rawData.subject || '';
    var message = rawData.message || '';

    // Append submission row
    sheet.appendRow([
      formattedDate,
      fullName,
      email,
      phone,
      subject,
      message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Form submitted successfully!',
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Google Sheets Webhook for Sujnana School Contact Form is ACTIVE!");
}
