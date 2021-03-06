/**
------- Tips --------

・ログ
Logger.log();

・シート名でシート取得
getSheetByName('シート名');

・スプレッドシートにダイアログボックスを表示
SpreadsheetApp.getUi().alert(text);

・ある範囲（レンジ）を取得
Sheetオブジェクト.getRange(行番号, 列番号, 行数, 列数)
・値を取得
getValue() & getValues()

・getA1NotationメソッドはRangeオブジェクトのアドレス((A3:c4)など)を取得するメソッド。
Rangeオブジェクト.getA1Notation()
これで、 取得したセル範囲がどこなのかということがわかります。

・GASでHTTPリクエストを行う
このWeb APIを利用するためには、「 HTTPリクエストを送る」 という操作をする必要があるわけですが、 GASにはそのための機能が用意されています。
それを提供するのがUrlFetchサービスのfetchメソッドになります
UrlFetchApp.fetch(URL[, パラメータ])
リクエストURLと、 必要に応じてパラメータを付与します。
パラメータには
header： ヘッダー
method： メソッド（ デフォルトはGET）
payload： ペイロード（ POSTの際のボディなど）
などをオブジェクト形式で指定します。(JSONみたいな書式で上記3つを指定する。LINEのAPIリファレンスとかにも書いてある。)
チャットワークにメッセージを送信する場合、 上記のメッセージを送りたいときのURLを使うのですが、 そもそもパラメータのheaderに「 APIトークン」 という情報を付与する必要があります。
また、 POSTリクエストになりますのでmethodも指定しますし、 メッセージの内容を送らないといけないので、 それをpayloadに指定する必要もあります。


・webhookとは
アクセストークン（ ロングターム）」 の下に「 Webhook送信」 という項目があり、 これが「 利用しない」 になっています。 ここの「 Webhook送信」 というのは、 友だち追加やユーザからのメッセージ送信などのイベントが発生した際に、 任意に指定したURL（ すなわち何かしらのサーバ。 Google Apps Script、 Heroku等など） でリクエストを受信する機能を利用するかどうかを設定する項目になります。
そして今回はユーザからの投稿をサーバで受け取って処理したいので、 このWebhook送信を利用します。 よってWebhook送信のところにある「 編集」 をクリックし、 以下のように「 利用する」「 利用しない」 を選択できるようになるので「 利用する」 にチェックを入れて「 更新」 をクリックします。
続いて、「 Webhook送信」 の下にある「 Webhook URL」 にWebhook送信に利用するURLを指定します。 このURLは、 使用するサーバによって当然ながら異なります。 例えば、 Google Apps Scriptをサーバとして使用する場合には、 Google Apps Scriptをウェブアプリケーションとして公開した時に得られるURLを入力します。 Google Apps ScriptのURLの取得方法はこちらに載せています。
同じく「 編集」 をクリックすると、 以下のようにWebhook URLの入力欄が出てくるのでそこにボットの実体がおいてある自身のサーバのURLを貼り付けて「 更新」 をクリックします。 以下ではGoogle Apps ScriptのURLを入力しています。

・Trigger
ClockTriggerBuilderオブジェクト.at(指定日時)
一定時間後の時刻を設定する場合はafterメソッドを使用します。 単位はミリ秒となっているので、 10 分後を指定する場合はafter(10× 60× 1000) となります。
最後にトリガーの生成にはcreateメソッドを使用します。
ClockTriggerBuilderオブジェクト.create()
      例）
      function setTrigger() {
        var setTime = new Date();
        setTime.setHours(23);
        setTime.setMinutes(59);
        ScriptApp.newTrigger('myFunction').timeBased().at(setTime).create();
      }

・日付フォーマットを変更
Utilities.formatDateで日付フォーマットを変更する
実はJavaScriptでは日付のフォーマットを変更するための直接的な命令がなく、 皆さん独自の関数使ったりして工夫されているのですが、 Google Apps ScriptではGoogleが便利なライブラリを用意してくれているので、 それを使うことができます。

Utilitiesというライブラリを使いまして
Utilities.formatDate(日付, タイムゾーン, フォーマット)
とすることで、 日付フォーマットを変更することができます。
タイムゾーンは日本の場合は「 JST」 を指定してあげればOK。 フォーマットは年を「 y」、 月を「 M」（※ 大文字なので注意！）、 日を「 d」 を使って表現します。
‘ yyyy - MM - dd’ とすれば「 2015 - 12 - 03」‘ yyyy年M月d日’ とすれば「 2015 年12月3日」
となります。
今回は最も一般的な書き方と言えますが
JavaScript
var strBody = ～+
  Utilities.formatDate(yDate, 'JST', 'yyyy/MM/dd') + ～ //ga:date
  1
  2
var strBody = ～+
  Utilities.formatDate(yDate, 'JST', 'yyyy/MM/dd') + ～ //ga:date
  としました。
繰り返しになりますが、 UtilitiesはGAS専用ですから、 JavaScript一般では使えませんよ








*/