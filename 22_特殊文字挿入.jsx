/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　　特殊文字を挿入するスクリプト
//　　「タブ」「右揃えタブ」「ここまでインデント」「先頭文字スタイル終了文字」「任意の文字」
//　　任意の文字は、デフォルトで二分空白が入っています。
/*                                                                                                                                                                          Created & modify by  丸山*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

#target InDesign
#targetengine "tab_exchange"

//////////     インターフェース ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var PanUI = new Window("window","",{x:500,y:500,width:220, height:420});
　　PanUI.pan1 = PanUI.add("panel", {x:10,y:10,width:200,height:230}, "入力文字列");
     //　ラジオボタンを追加
    var rBtnGrp01= PanUI.add("group", {x:10,y:10,width:200, height:250});
        var rBtn01= rBtnGrp01.add("radiobutton", {x:20,y:30,width:220, height:45}, "タブ");
        var rBtn02= rBtnGrp01.add("radiobutton", {x:20,y:65,width:220, height:45}, "右揃えタブ");
        var rBtn03= rBtnGrp01.add("radiobutton", {x:20,y:100,width:220, height:45}, "ここまでインデントタブ");
            PanUI.add("statictext",{x:50,y:110,width:150, height:45},"※表組内での使用禁止");
        var rBtn04= rBtnGrp01.add("radiobutton", {x:20,y:135,width:220, height:45}, "先頭文字スタイル終了文字");
        var rBtn05= rBtnGrp01.add("radiobutton", {x:20,y:170,width:220, height:45}, "任意の文字");
            PanUI.txt = PanUI.add("edittext",{x:50,y:200,width:150, height:30}," ");

        rBtn01.value=true;
     //　挿入ボタンを追加
     PanUI.ExecutionBtn = PanUI.add("button", {x:20,y:250,width:180,height:50}, "挿　入");
     //　中止ボタンを追加
     PanUI.CancelBtn = PanUI.add("button", {x:20,y:310,width:180,height:30}, "終　了");

    //　コピーライト
    PanUI.add("panel", {x:10,y:350,width:200,height:55}, "");
    PanUI.add("statictext",{x:20,y:350,width:200, height:45},"藤原印刷株式会社" + "\r\n" + "FUJIWARA PRINTING Co. Ltd.");

    PanUI .center();
    PanUI.show();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//　終了時処理
PanUI.CancelBtn.onClick = function(){
  PanUI.close();
}

//　実行時処理
PanUI.ExecutionBtn.onClick = function(){
    sel = app.activeDocument.selection[0];
    if (sel.constructor.name == "InsertionPoint") {
        if(rBtn01.value==true){
            sel.contents = ‌String.fromCharCode(9);
        }else if(rBtn02.value==true){
            sel.contents = ‌String.fromCharCode(8);
        }else if(rBtn03.value==true){
            sel.contents = ‌String.fromCharCode(8204) + String.fromCharCode(7);
        }else if(rBtn04.value==true){
            sel.contents = ‌String.fromCharCode(3);
         }else if(rBtn05.value==true){
            sel.contents = PanUI.txt.text;
        }

    }
}
