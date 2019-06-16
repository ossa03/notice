// ------- sheetから結果取得 --------------------------------------------------
var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();  //spreadsheetfile取得
// var sheet = spreadsheet.getActiveSheet();                 //activeなsheet取得(第1sheet)
var sheet = spreadsheet.getSheetByName('フォームの回答'); //sheet名でsheet取得(第1sheet)
var sheet_name = sheet.getName();                //sheetの名前


/**
 * spreadsheet('フォームの回答')から(日付、名前、休憩時間)を取得。
 */
function get_reports() {
  reports = [];   //出力データを格納するための配列を用意。 上記でグローバル変数として定義している。
  var lastrow = sheet.getLastRow();   //最終行番号取得
  // Logger.log(lastrow);
  for(var i =4; i < lastrow-3; i++){
    var range = sheet.getRange(i, 1, lastrow, 4);//データのほしい範囲を指定している。
    range = range.sort({ column: 2, ascending: true });    //▶日付カラムで昇順でソート
    var values = range.getValues();
//    Logger.log(values);
    var a = values[0][1]; // 日付
    var b = values[0][2]; // 名前
    var c = values[0][3]; // 休憩時間
    var report = a + '  ' + b + '  ' + c + '分' + '\n';
    // Logger.log(report);
    reports.push(report);
  }
  reports = reports.join('\n');
  reports = sheet_name + '\n\n' + reports;
// Logger.log(reports);
  return reports;
}


// --------- LINE messege API configc --------------------------------------

// line developersに書いてあるChannel Access Token
// ▶ コード上にTokenやidをさらすのは危険なので、GASのプロパティストアに保存してそこから取得する。
function get_access_token(){
  var access_token = PropertiesService.getScriptProperties().getProperty('access_token');
  return access_token;
}

// pushしたいときに送る先のuser_id or group_idを指定する。
// ▶ 同じくプロパティストアで管理。
function getToUser_id(){
  var to_user = PropertiesService.getScriptProperties().getProperty('my_id');
  return to_user;
}
// postされたログを残すスプレッドシートのid
// ▶ 同じくプロパティストアで管理。
function get_spreadsheet_id (){
  var spreadsheet_id = PropertiesService.getScriptProperties().getProperty('spreadsheet_id');
  return spreadsheet_id;
}

/**
 * 指定のuser_idにpushをする
 */
function push(text) {
  var url = "https://api.line.me/v2/bot/message/push";

  //access_token取得
  var access_token = get_access_token();
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + access_token,
  };

  //送信先のuser_idを取得。このscriptでは自分のusdr_id
  // var to = get_to();
  var postData = {
    "to": getToUser_id(),
    "messages": [{
      'type': 'text',
      'text': text,   //引数がここに入る。
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

  var reports = get_reports(); //reportsの戻り値取得▶postData.'text'にここで取得したreportsを入れる。

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
* GETされたときの処理 ▶
*/

function doGet() {
  return ContentService.createTextOutput("success!");
}

/**
* POSTされたときの処理 ▶ LINEbotに適当なメッセージを送ったらreportsを返したい。
*/
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
//  log
  SpreadsheetApp.openById(get_spreadsheet_id()).getSheetByName('log').getRange(1, 1).setValue(json.events);

  reply(json);
}

/**
 * botに通知する
 */
function notice() {
  push(get_reports());  //push関数の引数にreportsを渡している。
}


// --------------  Trigger  ---------------------------------------------------

/**
 * scriptエディタからfunction notice()を実行して好きな時間にTriggerをかける。
 */
function setTrigger() {
  // 21:00にトリガーかける。数値を変えれば好きな時間にトリガーを設定できる。
  var setTime = new Date();
  setTime.setHours(21);
  setTime.setMinutes(00);
  ScriptApp.newTrigger('notice').timeBased().at(setTime).create();
}
