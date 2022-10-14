//
//　　　索引「読み」オーバーライド Ｖｅｒ1.1
//　　　　　　　　　　　　　　　　　　　　　　　作成：寺田
//
//　　InDesignに設定された索引の「読み」をテキストファイルから読み込んで書き戻します。
//    索引語句を検索して完全一致したものの「読み」をオーバーライドします。
//　　読み込むテキストは、
//　　　　［読み］ ￥t ［索引語］   です。
//　　索引を階層構造にしているものは、４階層すべて一致したもの「読み」が書き戻されます。
//    階層構造の区切りには、書き出しスクリプトと同じ「▲」とします。
//    索引語に「▲」がある場合は、同じ数だけ「読み」も区切られている必要があります。
//    処理をしたいドキュメントが複数ある場合は、全て開いた状態で実行してください。
//
//    Ver 1.1  テキストファイルを読み込まないバグ修正
//
#target InDesign
#targetengine SakuinYomiTextOverride_for_JT

if (app.windows.length > 0){
    var dlg = new Window("palette", "索引「読み」オーバーライド Ver 1.1", {x: 50, y: 50, width: 500, height: 130});
    dlg.add("statictext", {x: 10, y: 10, width: 300, height: 15}, "読み込むテキストファイル名");
    var txbox = dlg.add("edittext", {x: 10, y: 30, width: 400, height: 25}, "");
    var Btn1 = dlg.add("button", {x: 410, y: 30, width: 80, height: 25}, "ファイル...");
    var Btn2 = dlg.add("button", {x: 320, y: 70, width: 160, height: 50}, "実行");
    var tx = "";
    var sta_tx = dlg.add("statictext", {x: 10, y: 70, width: 300, height: 40}, tx, {multiline: true});
Btn1.onClick = function(){
    var filename = File.openDialog("読み込むファイルを選択","*.txt");
    txbox.text = decodeURI(filename);
}
Btn2.onClick = function(){
    if (txbox.text == "" | txbox.text == "null"){
        alert("読み込むファイルが指定されていません。");
        exit();
    }
    sta_tx.text = "索引「読み」のオーバーライド中！　　　m(_ _)m";
    var sepChar = "\t";
    var sakSep = "▲";
    var textObj = new File(txbox.text);
    flag = textObj.open("r");
    if (flag == true){
        var txt = textObj.read();
        if (txt.lastIndexOf("\n") == txt.length - 1){
            txt = txt.substring(0, txt.length - 1);
        }
        txt = txt.split("\n");
        textObj.close();
    }
    var line_len = txt.length;
    var docObj = app.documents;
    var d_len = docObj.length;
    for (var d = 0; d < d_len; d++) {
        var tmpIndex = docObj[d].indexes[0];
        tmpIndex.update();
        for (var s = 0; s < line_len; s++){
            var yomi = txt[s].split(sepChar).shift();
            var sakuin = txt[s].split(sepChar).pop();
            var saksep_len_yomi = yomi.split(sakSep).length - 1;
            var saksep_len_sakuin = sakuin.split(sakSep).length - 1;
            if (saksep_len_yomi == 0 && saksep_len_sakuin == 0){
                        var t_len = tmpIndex.topics.count();
                        try{
                            for (var i = 0; i < t_len; i++) {
                                var tmpTopic = tmpIndex.topics[i];
                                if (sakuin == String(tmpTopic.name)){
                                    tmpTopic.sortOrder = yomi;
                                    tmpIndex.update();
                                }
                            }
                        }catch(e){
                        }
            } else if (saksep_len_yomi == 1 && saksep_len_sakuin == 1){
                        var yomi1 = yomi.split(sakSep).shift();
                        var yomi2 = yomi.split(sakSep).pop();
                        var sakuin1 = sakuin.split(sakSep).shift();
                        var sakuin2 = sakuin.split(sakSep).pop();
                        var t_len = tmpIndex.topics.count();
                        try{
                            for (var u = 0; u < t_len; u++) {
                                var tmpTopic = tmpIndex.topics[u];
                                var t2_len = tmpTopic.topics.count();
                                if (sakuin1 == String(tmpTopic.name)){
                                    for (var c = 0; c < t2_len; c++) {
                                        var tmpTopic2 = tmpTopic.topics[c];
                                        if (sakuin2 == String(tmpTopic2.name)){
                                            tmpTopic2.sortOrder = yomi2;
                                            tmpTopic.sortOrder = yomi1;
                                            tmpIndex.update();
                                        }
                                    }
                                }
                            }
                        }catch(e){
                        }
            } else if (saksep_len_yomi == 2 && saksep_len_sakuin == 2){
                        var tmpyomi = yomi.split(sakSep);
                        var yomi1 = tmpyomi[0];
                        var yomi2 = tmpyomi[1];
                        var yomi3 = tmpyomi[2];
                        var tmpsakuin = sakuin.split(sakSep);
                        var sakuin1 = tmpsakuin[0];
                        var sakuin2 = tmpsakuin[1];
                        var sakuin3 = tmpsakuin[2];
                        var t_len = tmpIndex.topics.count();
                        try{
                            for (var v = 0; v < t_len; v++) {
                                var tmpTopic = tmpIndex.topics[v];
                                var t2_len = tmpTopic.topics.count();
                                if (sakuin1 == String(tmpTopic.name)){
                                    for (var m = 0; m < t2_len; m++) {
                                        var tmpTopic2 = tmpTopic.topics[m];
                                        var t3_len = tmpTopic2.topics.count();
                                        if (sakuin2 == String(tmpTopic2.name)){
                                            for (var n = 0; n < t3_len; n++) {
                                                var tmpTopic3 = tmpTopic2.topics[n];
                                                if (sakuin3 == String(tmpTopic3.name)){
                                                    tmpTopic3.sortOrder = yomi3;
                                                    tmpTopic2.sortOrder = yomi2;
                                                    tmpTopic.sortOrder = yomi1;
                                                    tmpIndex.update();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }catch(e){
                        }
            } else if (saksep_len_yomi == 3 && saksep_len_sakuin == 3){
                        var tmpyomi = yomi.split(sakSep);
                        var yomi1 = tmpyomi[0];
                        var yomi2 = tmpyomi[1];
                        var yomi3 = tmpyomi[2];
                        var yomi4 = tmpyomi[3];
                        var tmpsakuin = sakuin.split(sakSep);
                        var sakuin1 = tmpsakuin[0];
                        var sakuin2 = tmpsakuin[1];
                        var sakuin3 = tmpsakuin[2];
                        var sakuin4 = tmpsakuin[3];
                        var t_len = tmpIndex.topics.count();
                        try{
                            for (var v = 0; v < t_len; v++) {
                                var tmpTopic = tmpIndex.topics[v];
                                var t2_len = tmpTopic.topics.count();
                                if (sakuin1 == String(tmpTopic.name)){
                                    for (var m = 0; m < t2_len; m++) {
                                        var tmpTopic2 = tmpTopic.topics[m];
                                        var t3_len = tmpTopic2.topics.count();
                                        if (sakuin2 == String(tmpTopic2.name)){
                                            for (var n = 0; n < t3_len; n++) {
                                                var tmpTopic3 = tmpTopic2.topics[n];
                                                var t4_len = tmpTopic3.topics.count();
                                                if (sakuin3 == String(tmpTopic3.name)){
                                                    for (var p = 0; p < t4_len; p++) {
                                                        var tmpTopic4 = tmpTopic3.topics[p];
                                                        if (sakuin4 == String(tmpTopic4.name)){
                                                            tmpTopic4.sortOrder = yomi4;
                                                            tmpTopic3.sortOrder = yomi3;
                                                            tmpTopic2.sortOrder = yomi2;
                                                            tmpTopic.sortOrder = yomi1;
                                                            tmpIndex.update();
                                                        }
                                                     }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }catch(e){
                        }
            } else {
                sta_tx.text = tx;
                alert("階層区切りの「▲」が「読み」と「索引語」で数が違います。中断します。");
                exit();
            }
        }
    }
    tmpIndex.update();
    sta_tx.text = tx;
    alert("終了しました。");
}
}
dlg.center();
dlg.show();

function getPlace(obj) {
	try {
        var pntObj= obj.parent; //親オブジェクト
        var pntObjName= pntObj.constructor.name; //親オブジェクトのクラス名
        if (pntObjName=='Page') {return pntObj;} //そのまま返す
        if ( (pntObjName=='Spread')||(pntObjName=='MasterSpread') ) {
            if ( (parseInt(app.version)>=7)&&(obj.parentPage !== null) ) {
                return obj.parentPage;
            }
            return pntObj; //そのまま返す
        }
        //再帰呼び出し
        var targetObjName= 'InsertionPoint, TextStyleRange, Character, Word, Line, TextColumn, Paragraph, Story'; //テキスト系とみなすオブジェクト名
        if ( targetObjName.match(obj.constructor.name) ) {
            //オブジェクトがテキスト系だった場合
            var res= getPlace(obj.parentTextFrames[0]);
        } else {
            // それ以外なら...
            var res= getPlace(pntObj); //親オブジェクトで再帰呼び出し
        }
        return res;
    } catch(e) {
        return undefined;
    }
}