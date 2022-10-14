//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////    Ver 1.00　　　　PDF貼り込みサンプルスクリプトをUI操作できるよう改変　　                         ///////////////////////////////////////////////////////////////////////////
////////////////////////    Ver 1.01　　　　オフセット設定／スケール設定可能とした　　                                                ///////////////////////////////////////////////////////////////////////////
////////////////////////    Ver 1.10　　　　マルチセレクト可能とした部分のUIと設定変更　　                                        ///////////////////////////////////////////////////////////////////////////
////////////////////////    Ver 1.20　　　　寺田がリストボックスの上下入れ替えをプラスしたよ                                        //////////////////////////////////////////////////////////////////////////
////////////////////////    Ver 1.21　　　　マルチセレクトのリスト表示の配列変数を変更                                               //////////////////////////////////////////////////////////////////////////
////////////////////////    Ver 1.30　　　　myPDFの配列が切り替わる時に直前のPDF1頁目が重複するバグ修正　 //////////////////////////////////////////////////////////////////////////
////////////////////////    Ver 2.00　　　　トリミングオプションを追加& UI調整　　　　　　　　　　　　　　                         ///////////////////////////////////////////////////////////////////////////
/*                                                                                                                                                                                                  Created & modify by  丸山*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#target InDesign
#targetengine "PDF_Placement"

/**********　ドキュメントの有無確認　***************************************************************************************************************/

if (app.documents.length == 0) {
      alert ("ドキュメントが開かれていません！！" );
      exit();
}

/**********　アイテム設定　****************************************************************************************************************************/
//ドキュメント設定
        var myDocument = app.activeDocument;
//ページ設定
        var myPage = myDocument.pages.item(0);
//PDF貼り込み用変数
        var myPDFPage = myPage.rectangles;
//ルーラー設定
         var myOldRulerOrigin = app.activeDocument.viewPreferences.rulerOrigin;
                   app.activeDocument.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
                   app.activeDocument.zeroPoint = [0,0];

/**********　ファイル取得　****************************************************************************************************************************/
var myPDF = File.openDialog("PDF ファイル選択","*.pdf", true);
     if (myPDF == null)
     {
     	exit();
     }else{
         //とりあえず.nameは配列のうち1つしか対象にできないので、もう一個PDFNameで配列作る
         var PDFName=new Array();
              for(var i=0; i < myPDF.length; i++){       　　　　　//myPDFの配列数でループ
                  PDFName.push(decodeURI(myPDF[i]))                //PDFNameにファイル名をpush
             }
     }

//////////　ユーザーインターフェース  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var  PanUI = new Window ("dialog", "PDF貼り込み設定", [0,0,500,600]);

     //　PDFファイルリストアップ
　　PanUI.pan1 = PanUI.add("panel", {x:250,y:10,width:230,height:410}, "PDF一覧");
          for(var i=0; i < myPDF.length; i++){
              var pdfList = PanUI .add("listbox", {x:260,y:50,width:210,height:360}, PDFName);
          }

     // リストボックスの上下入れ替えボタン
     PanUI.btn_up = PanUI.add("button", {x:380,y:25,width:40,height:20}, "▲");
     PanUI.btn_down = PanUI.add("button", {x:430,y:25,width:40,height:20}, "▼");

       PanUI.btn_up.onClick = function(){
          var a = pdfList.selection.index;
          if (a == 0){exit()}
          var tmp_a = pdfList.items[a].text;
          var tmp_b = pdfList.items[a - 1].text;
          pdfList.items[a].text = tmp_b;
          pdfList.items[a - 1].text = tmp_a;
          pdfList.selection = a - 1;
          PDFName = pdfList.items;
          myPDF = PDFName;
       }
       PanUI.btn_down.onClick = function(){
          var c = pdfList.length -1;
          var a = pdfList.selection.index;
          if (a == c){exit()}
          var tmp_a = pdfList.items[a].text;
          var tmp_b = pdfList.items[a + 1].text;
          pdfList.items[a].text = tmp_b;
          pdfList.items[a + 1].text = tmp_a;
          pdfList.selection = a + 1;
          PDFName = pdfList.items;
          myPDF = PDFName;
       }

     // トリミングオプション
	PanUI.pan2 = PanUI.add("panel", {x:25,y:10,width:200,height:80}, "トリミングオプション");
          PanUI.cbtn1 = PanUI.add("checkbox",{x:40,y:40,width:180, height:20}, "頁サイズでトリミング");
               PanUI.cbtn1.onClick = oncbtn1Clicked;
               PanUI.cbtn1.value = false;
          PanUI.add("statictext",{x:58,y:60,width:120, height:20},"裁ち落とし［㎜］＝");
          PanUI.Bleed = PanUI.add("edittext", {x:170,y:60,width:40,height:20}, "0");
        	PanUI.Bleed.enabled = false;

     //　オフセットオプション
	PanUI.pan3 = PanUI.add("panel", {x:25,y:110,width:200,height:100}, "オフセット");
     	PanUI.add("statictext",{x:58,y:140,width:120, height:20},"Ｘ 方 向 ［㎜］＝");
     	PanUI.offsetX = PanUI.add("edittext", {x:170,y:140,width:40,height:20}, "0");
     	PanUI.add("statictext",{x:58,y:170,width:120, height:20},"Ｙ 方 向 ［㎜］＝");
     	PanUI.offsetY = PanUI.add("edittext",{x:170,y:170,width:40,height:20}, "0");

     //　スケールオプション
	PanUI.pan4 = PanUI.add("panel", {x:25,y:230,width:200,height:100}, "スケール");
     	PanUI.add("statictext",{x:58,y:260,width:120, height:20},"Ｘ 比 ［％］＝");
     	PanUI.scaleX = PanUI.add("edittext", {x:170,y:260,width:40,height:20}, "100");
     	PanUI.add("statictext",{x:58,y:290,width:120, height:20},"Ｙ 比 ［％］＝");
     	PanUI.scaleY = PanUI.add("edittext",{x:170,y:290,width:40,height:20}, "100");
     
     // 基準点オプション
	PanUI.pan5 = PanUI.add("panel", {x:25,y:350,width:200,height:70}, "配置基準点");
     var positions = ["左上", "中央上", "右上", "左中央",  "ド真ん中", "右中央", "左下",  "中央下",  "右下"];
	　　PanUI.positionList =  PanUI.add("dropdownlist", {x:40,y:380,width:170,height:20}, positions);
          PanUI.positionList.selection = 4;        //　初期値を設定

     // 機能拡張用エリア
	PanUI.pan6 = PanUI.add("panel", {x:25,y:450,width:455,height:80}, "インフォメーション");
     	PanUI.add("statictext",{x:40,y:460,width:450, height:50},"トリミングオプションの裁ち落とし設定はフレームサイズの変更、" + "\r\n" + "オフセット設定はフレーム内の内容の位置を変更させます。");

     //　実行ボタンを追加
     PanUI.add("button", {x:200,y:550,width:130,height:30}, "実　行",{name:"ok"});

     //　中止ボタンを追加
     PanUI.add("button", {x:350,y:550,width:130,height:30}, "中　止",{name:"cancel"});

     //　コピーライト
	PanUI.add("statictext",{x:10,y:550,width:200, height:45},"藤原印刷株式会社" + "\r\n" + "FUJIWARA PRINTING Co. Ltd.");
　　//　ダイアログを画面のセンター表示
     PanUI .center();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**********　実行時処理　*************************************************************************************************************************/
var BtnType = PanUI.show();
if (BtnType==1){
 PDFSET();
}
/**********　キャンセル時処理　*******************************************************************************************************************/
else if (BtnType==2){
      alert("キャンセルされました" , "処理終了",true);
}   


////////// Function ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
　　//　トリミングオプション／裁ち落としグレーアウト表示切り替え
     function oncbtn1Clicked(){
         PanUI.Bleed.enabled = PanUI.cbtn1.value;
     }


　　//　PDF貼り込み
     function PDFSET(){
          var pageCounter = 0;          
          for(var n=0; n < myPDF.length; n++){                            //マルチセレクトしたファイル数でループ
         	  app.pdfPlacePreferences.pdfCrop = PDFCrop.cropMedia;
                var myCounter = 1;
                var myBreak = false;

          	while(myBreak == false){
          		if(myCounter > 1){                                                 　//PDFファイルのページが切り替わったらページ追加
          		     myPage = myDocument.pages.add(LocationOptions.after, myPage);
          		}
          		app.pdfPlacePreferences.pageNumber = myCounter;
          		myPDFPage = myPage.place(File(myPDF[n]))[0];    　//ページアイテムにPDFをPlace

                     /******** 縮率設定 ***************************************************************************/
                       //縮率（scalse）の値はRealでないとダメなのでparseIntを使って数値化しとく
          			myPDFPage.verticalScale = parseInt(PanUI.scaleX.text);
          			myPDFPage.horizontalScale = parseInt(PanUI.scaleY.text);

                     /******** 配置位置設定 **********************************************************************/
                           var myX, myY, myXCenter, myYCenter, myObX, myObY;
                           var myPageHeight = app.activeDocument.documentPreferences.pageHeight;
                           var myPageWidth = app.activeDocument.documentPreferences.pageWidth;
                                  myPgXCenter = myPageWidth/2;
                                  myPgYCenter = myPageHeight/2;
                           var myBounds = myPDFPage.geometricBounds;
                           var myWidth = myBounds[3]-myBounds[1];
                           var myHeight = myBounds[2]-myBounds[0];
                                  myObXCenter = myWidth/2;
                                  myObYCenter = myHeight/2;
                           var myOfsetX = parseInt(PanUI.offsetX.text);
                           var myOfsetY = parseInt(PanUI.offsetY.text);

                       		switch(PanUI.positionList.selection.index){
                                         case 0:  //左上
                                               myX = 0 + myOfsetX;
                                               myY = 0 + myOfsetY;
                                               break;
                                         case 1:  //中央上
                                               myX = myPgXCenter-myObXCenter + myOfsetX;
                                               myY = 0 + myOfsetY;
                                               break;
                                         case 2:  //右上
                                               myX = myPageWidth-myWidth + myOfsetX;
                                               myY = 0 + myOfsetY;
                                               break;
                                         case 3:  //左中央
                                               myX = 0 + myOfsetX;
                                               myY = myPgYCenter-myObYCenter + myOfsetY;
                                               break;
                                         case 4:  //ド真ん中
                                               myX = myPgXCenter-myObXCenter + myOfsetX;
                                               myY = myPgYCenter-myObYCenter + myOfsetY;
                                               break;
                                         case 5:  //右中央
                                               myX = myPageWidth-myWidth + myOfsetX;
                                               myY = myPgYCenter-myObYCenter + myOfsetY;
                                               break;
                                         case 6:  //左下
                                               myX = 0+ myOfsetX;
                                               myY = myPageHeight-myHeight + myOfsetY;
                                               break;
                                         case 7:  //中央下
                                               myX = myPgXCenter-myObXCenter + myOfsetX;
                                               myY = myPageHeight-myHeight + myOfsetY;
                                               break;
                                         case 8:  //右下
                                               myX = myPageWidth-myWidth + myOfsetX;
                                               myY = myPageHeight-myHeight + myOfsetY;
                                               break;
                                }
                                myPDFPage.move ([myX, myY]);

                     if(app.activeDocument.documentPreferences.pageBinding ==PageBindingOptions.RIGHT_TO_LEFT){
                     /***** フレームをデータにフィットさせる *****************************************************************/
                        myPDFPage.fit(FitOptions.frameToContent);
                     /***** トリミングオプション設定時 *********************************************************************/
                        if(PanUI.cbtn1.value == true){
                            var myBleed = parseInt(PanUI.Bleed.text);
                             var myObject = app.activeDocument.pages[pageCounter].pageItems[0];
                                  myObject.visibleBounds = [-myBleed,-myBleed,myPageHeight+myBleed,myPageWidth+myBleed];
                        }
                     }else{
                     /***** トリミングオプション設定時 *********************************************************************/
                        if(PanUI.cbtn1.value == true){
                            var myBleed = parseInt(PanUI.Bleed.text);
                             var myObject = app.activeDocument.pages[pageCounter].pageItems[0];
                                  myObject.visibleBounds = [-myBleed,-myBleed,myPageHeight+myBleed,myPageWidth+myBleed];
                        }else{
                     /***** フレームをデータにフィットさせる *****************************************************************/
                        myPDFPage.fit(FitOptions.frameToContent);
                        }
                     }                 
                 
                     /***************************************************************************************************
                               PDFファイルはページ数を知るためのするプロパティがないため最終ページまでいくと1頁目に戻り
                               無限ループしてしまうので、カウンターをつけてBreakさせる
                            ***************************************************************************************************/
          		  if(myCounter == 1){
          		  	var myFirstPage = myPDFPage.pdfAttributes.pageNumber;
          		  }
                     else{
          	  		if(myPDFPage.pdfAttributes.pageNumber == myFirstPage){
                              myBreak = true;
                              if(n != myPDF.length){
                                   var myObject = app.activeDocument.pages[pageCounter].pageItems[0];
                                       myObject.remove();
                                   break;
                              }
           			}
            		}
          		myCounter = myCounter + 1;
                   pageCounter = pageCounter+1;
              }
          }
      myPage.remove();
      app.activeDocument.viewPreferences.rulerOrigin = myOldRulerOrigin;
      alert("処理が終わりました");
   }
