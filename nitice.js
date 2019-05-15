// ------- sheetから結果取得 --------------------------------------------------
var reports;   //reportsを複数の関数で使えるようにグローバル変数として定義している。

function notice() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();  //spreadsheetfile取得
  var sheet = ss.getActiveSheet();                 //activeなsheet取得(第1sheet)
  var all_data = ss.getDataRange().getValues();    //sheet内の全データ
  var sheet_name = sheet.getName();                //sheetの名前

  //  指定範囲のデータ取得getDataRange().getValues()
  reports = [];   //出力データを格納するための配列を用意。 上記でグローバル変数として定義している。
  var lastrow = sheet.getLastRow();
  for (var i = 4; i < lastrow; i++) {
    var a = (sheet.getRange(i, 2).getValue());
    var b = (sheet.getRange(i, 3).getValue());
    var c = (sheet.getRange(i, 4).getValue());
    var report = a + '  ' + b + '  ' + c + '分';
    // Logger.log(report);
    reports.push(report);
  }
  Logger.log(reports);
  return reports;
}

function get_reports() {
  for (var i = 0; i < reports.length; i++)
    reports[i];
}


// --------- LINE messege API configc --------------------------------------

// line developersに書いてあるChannel Access Token
// ▶ コード上にTokenやidをさらすのは危険なので、GASのプロパティストアに保存してそこから取得する。
var access_token = PropertiesService.getScriptProperties().getProperty('access_token');
// pushしたいときに送る先のuser_id or group_idを指定する。
// ▶ 同じくプロパティストアで管理。
var to = PropertiesService.getScriptProperties().getProperty('my_id');
// postされたログを残すスプレッドシートのid
// ▶ 同じくプロパティストアで管理。
var spreadsheet_id = PropertiesService.getScriptProperties().getProperty('spreadsheet_id');

/**
 * 指定のuser_idにpushをする  ▶ フリープランだとできない？
 */
function push(text) {
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + access_token,
  };

  var postData = {
    "to": to,
    "messages": [{
      'type': 'text',
      'text': text,
    }]
  };

  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };

  return UrlFetchApp.fetch(url, options);
}

/**
 * reply_tokenを使ってreplyする
 */
function reply(data) {
  var url = "https://api.line.me/v2/bot/message/reply";
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + access_token,
  };

  var postData = {
    "replyToken": data.events[0].replyToken,
    "messages": [{
      'type': 'text',
      'text': data.events[0].message.text + 'おさ'
    }]
  };

  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };

  return UrlFetchApp.fetch(url, options);
}

/**
 * postされたときの処理
 */
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var data = SpreadsheetApp.openById(spreadsheet_id).getSheetByName('log').getRange(1, 1).setValue(json.events);

  reply(json);
}

/**
 * pushをしてみる
 */
function test() {
  push('notice');
  push(reports);
}