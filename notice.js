// ------- sheetから結果取得 --------------------------------------------------
var ss = SpreadsheetApp.getActiveSpreadsheet();  //spreadsheetfile取得
var sheet = ss.getActiveSheet();                 //activeなsheet取得(第1sheet)
//var sheet = ss.getSheetByName('フォームの回答'); //sheet名でsheet取得(第1sheet)
var sheet_name = sheet.getName();                //sheetの名前


function get_reports() {
  var all_data = ss.getDataRange().getValues();    //sheet内の全データ

  //  指定範囲のデータ取得getDataRange().getValues()
  reports = [];   //出力データを格納するための配列を用意。 上記でグローバル変数として定義している。
  var lastrow = sheet.getLastRow();
  for (var i = 4; i < lastrow; i++) {
    var a = (sheet.getRange(i, 2).getValue());
    var b = (sheet.getRange(i, 3).getValue());
    var c = (sheet.getRange(i, 4).getValue());
    var report = a + '  ' + b + '  ' + c + '分' + '\n';
    // Logger.log(report);
    reports.push(report);
  }
  //reportsは配列なので1つずつ改行でつなげて一つの文章に変換。
  reports = reports.join('\n');
  Logger.log(reports);
  return reports;
}

function get_reports2() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();  //spreadsheetfile取得
  var sheet = ss.getActiveSheet();   //activeなsheet取得(第1sheet)
  //  指定範囲のデータ取得sheet.getDataRange().getValues()
  reports2 = [];   //出力データを格納するための配列を用意。 上記でグローバル変数として定義している。
  var lastrow = sheet.getLastRow();   //最終行番号取得
  for(var i =4; i < lastrow-3; i++){
    var range = sheet.getRange(i, 1, lastrow-3, 4);//データのほしい範囲を指定している。
    range = range.sort({ column: 2, ascending: true });    //▶日付カラムで昇順でソート
    var values = range.getValues();
//    Logger.log(values);
    var a = values[0][1] // 日付
    var b = values[0][2] // 名前
    var c = values[0][3] // 休憩時間
    var report = a + '  ' + b + '  ' + c + '分' + '\n';
//    Logger.log(report);
    reports2.push(report);
  }
  reports2 = reports2.join('\n');
  reports2 = sheet_name + '\n\n' + reports2;
  //Logger.log(reports2);
  return reports2;
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
 * 指定のuser_idにpushをする
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

  get_reports(); //reportsの戻り値取得▶postData.'text'にここで取得したreportsを入れる。

  var postData = {
    "replyToken": data.events[0].replyToken,
    "messages": [{
      'type': 'text',
      'text': reports
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
 * botに通知する
 */
function notice() {
  get_reports2();  //reportsの戻り値取得
  push(reports2);  //push関数の引数にreportsを代入している。
}



// --------------  Trigger  ---------------------------------------------------

/**
 * scriptエディタからこの関数を実行して好きな時間にTriggerをかける。
 */
function setTrigger() {
  var setTime = new Date();
  setTime.setHours(21);
  setTime.setMinutes(00);
  ScriptApp.newTrigger('notice').timeBased().at(setTime).create();
}