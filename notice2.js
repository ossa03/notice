// LINE Developersに書いてあるChannel Access Token
var access_token = PropertiesService.getScriptProperties().getProperty('access_token');
// 自分のユーザーIDを指定します。LINE Developersの「Your user ID」の部分です。
var to = PropertiesService.getScriptProperties().getProperty('my_id');


//送信するメッセージ定義する関数を作成します。
function createMessage() {
  //メッセージを定義する
  message = "notice2";
  return push(message);
}


//実際にメッセージを送信する関数を作成します。
function push(text) {
  //メッセージを送信(push)する時に必要なurlでこれは、皆同じなので、修正する必要ありません。
  //この関数は全て基本コピペで大丈夫です。
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + access_token,
  };

  //toのところにメッセージを送信したいユーザーのIDを指定します。(toは最初の方で自分のIDを指定したので、linebotから自分に送信されることになります。)
  //textの部分は、送信されるメッセージが入ります。createMessageという関数で定義したメッセージがここに入ります。
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