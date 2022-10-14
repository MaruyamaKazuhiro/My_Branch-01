////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　　タグ付きテキストのルビ化スクリプト
//　　開始位置・区切り位置・終了位置が正しくマークアップしていることを確認してから使用ください。
//　　適用する文字スタイルはスタイルグループ内も取得しています。
//　　
/*                                                                                                             Created & modify by  丸山*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


#target InDesign
#targetengine "ruby_setting"

var objectCheck = function(){
	var sel = app.selection[0];
	switch(sel.constructor.name){
		case "Character":
		case "Word":
		case "TextColumn":
		case "Line":
		case "TextStyleRange":
		case "Text":
		case "Paragraph":
			return sel;
		default:
			return null;
	}
}


//　ドキュメントの有無確認
if (app.documents.length == 0) {
      alert ("ドキュメントが開かれていません！！" );
      exit();
}

//************************************ユーザーインターフェース****************************************************

var WD = new Window("palette","タグと文字スタイルを指定してください",{x:500,y:500,width:220, height:350});
WD.add("statictext",{x:5,y:5,width:100, height:30},"【開始タグ】＝");
WD.tag1 = WD.add("edittext",{x:110,y:5,width:100, height:30},"<ruby>");
WD.add("statictext",{x:5,y:40,width:100, height:30},"【区切りタグ】＝");
WD.tag2 = WD.add("edittext",{x:110,y:40,width:100, height:30},"｜");
WD.add("statictext",{x:5,y:75,width:100, height:30},"【終了タグ】＝");
WD.tag3 = WD.add("edittext",{x:110,y:75,width:100, height:30},"</ruby>");
WD.add("statictext",{x:5,y:120,width:100, height:30},"文字スタイル名：");
WD.btn1 = WD.add("button",{x:5,y:180,width:210, height:30},"実　　　行");
WD.btn2 = WD.add("button",{x:5,y:220,width:210, height:30},"キャンセル");
WD.btn3 = WD.add("button",{x:5,y:260,width:210, height:30},"終　　　了");
//　コピーライト
WD.add("statictext",{x:10,y:300,width:220, height:45},"藤原印刷株式会社" + "\r\n" + "FUJIWARA PRINTING Co. Ltd.");

//　ドロップダウンリスト
    var StyList = "";
    for (i = 0; i < app.activeDocument.characterStyles.length; i++) {
    	StyList = StyList + app.activeDocument.characterStyles[i].name + ",";
    	}
      //　スタイルグループ内の文字スタイル取得
       for (i = 0; i < app.activeDocument.characterStyleGroups.length; i++) {
     	var StyGoup = app.activeDocument.characterStyleGroups[i].name
      	for (j = 0; j < app.activeDocument.characterStyleGroups[i].characterStyles.length; j++) {
      		StyList = StyList  + StyGoup + "⇒" + app.activeDocument.characterStyleGroups[i].characterStyles[j].name + ",";
      		}
       	}
　　StyList = StyList.substring (0, StyList.length-1);
　　StyList = StyList.split (",");
//　ドロップダウンリストに文字スタイルをリストアップ
WD.CStyle = WD.add("dropdownlist", {x:110,y:120,width:100, height:30}, StyList);
//　選択項目の初期値を設定
WD.CStyle.selection = 0;
//**********************************************************************************************************
//***************************************ファンクション********************************************************
//　キャンセル時処理
WD.btn2.onClick = function(){
  alert ("キャンセルされました。" , "処理終了",true);
  exit();
}

//　終了時処理
WD.btn3.onClick = function(){
  WD.close();
}

//　実行時処理
WD.btn1.onClick = function(){

var document = app.activeDocument;
app.changeGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences = NothingEnum.nothing;
app.findChangeGrepOptions = NothingEnum.nothing;
app.findChangeGrepOptions.kanaSensitive = true;  //カナの区別
app.findChangeGrepOptions.widthSensitive = true;  //全角半角の区別

//検索の初期化
app.findGrepPreferences = app.changeGrepPreferences =NothingEnum.nothing;


//検索パターン
app.findGrepPreferences.findWhat = "" + WD.tag1.text + "(.+?)" +  WD.tag3.text + "";

//「文字スタイルを当てる
       if  (WD.CStyle.selection.text.match ("⇒")) {
         var TmpList =WD.CStyle.selection.text.split("⇒");
         app.changeGrepPreferences.appliedCharacterStyle = app.activeDocument.characterStyleGroups.itemByName(TmpList[0]).characterStyles.itemByName(TmpList[1]);
        }else{
　　 　 app.changeGrepPreferences.appliedCharacterStyle = app.activeDocument.characterStyles.itemByName(WD.CStyle.selection.text);
        }


//ドキュメント全体に適用
app.changeGrep();


//以下ルビ化
var hits = document.findGrep(true);

for (var i = 0; i < hits.length; i++) {
  app.findGrepPreferences.findWhat = "" + WD.tag2.text + "(.+?)" + WD.tag3.text + "";
    var hits2 = hits[i].findGrep();
    var ruby = hits2[0].contents.replace("" + WD.tag2.text + "", "").replace("" + WD.tag3.text + "", "");


  app.findGrepPreferences.findWhat = "" + "(?<=" + WD.tag1.text + ")(.+?)(?=" + WD.tag2.text + ")" + "";
    var hits3 = hits[i].findGrep();
  setRuby(hits3[0], ruby);
  hits2[0].remove();
  app.findGrepPreferences.findWhat = "" + WD.tag1.text + "";
    var hits4 = hits[i].findGrep();
  hits4[0].remove();
}

function setRuby(str, ruby) {
  if (str.characters[0].rubyFlag == false) {
    str.rubyString = ruby;

str.rubyType = RubyTypes.PER_CHARACTER_RUBY;
    str.rubyFlag = true;
  }
}
alert('処理が終わりました');

}
WD.show();
