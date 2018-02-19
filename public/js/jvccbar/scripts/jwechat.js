//  *****************************************************************************
//  文 件 名：	jwechat.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-08-26
//  文件描述：
// 		 电话条的微信界面
//  说    明：
//		 微信界面
//  修改说明：
// *****************************************************************************

function JWeChat(nLeft,nTop,nWidth,nHeight,oContentWindow,oWindow)
{
	//########################//
	//			属性		  //
	//########################//	
	//公共属性
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
	oWindow = (typeof(oWindow) == "undefined")?null:oWindow;
	this._window = (oWindow==null)?window:oWindow;
	this._contentWindow = (oContentWindow==null)?window:oContentWindow;
	this.id = "oWeChat_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";
	this.arrSession = new Array();
	this.currentIndex = -1;
	//alert("id="+this.id);

	// 主图相关的HTML对象
	this.oPanel     		= null;	
	//内部方法
	this._createObject = function _createObject()	{
        this.oPanel = this._window.document.createElement("DIV");
        this.oPanel.style.cursor = "move";
        this.oPanel.style.position = "absolute";
	    this.oPanel.style.padding = "2px";
        this.oPanel.style.left = this.left+"px";
        this.oPanel.style.top = this.top+"px";
	    this.oPanel.className  = "easyui-tabs";
	    this.oPanel.id  = "idWechatTabs";
	    this.oPanel.setAttribute("data-options", "fit:true,border:true,plain:true,onSelect:OnSelectWeChatTabs,onClose:OnCloseWeChatTabs");
	    if(this._contentWindow == this._window){
	        this._contentWindow.document.body.appendChild(this.oPanel);
	    }
	    else{
	        this._contentWindow.appendChild(this.oPanel);
	    }
        $.parser.parse();
	}
	
	this._createObject();
	
	
	this.getSessionObject = function(sessionId){
	    for(var i = 0;i<this.arrSession.length;i++){
	        if(this.arrSession[i].GetSessionId() == sessionId){
	            return this.arrSession[i];
	        }
	    }
	    return null;
	}
	this.addSession = function(id,strTitle){ 
	    if(this.getSessionObject(id) != null)
	        return ;
	        
	    if(typeof(strTitle) == "undefined")   strTitle = "";
	    if(strTitle == ""){
	        var oSession = application.oWechatManager.GetSessionItemBySessionID(id);
	        if(oSession != null)
	            strTitle =  oSession.userNickName;
	    }
	        
	    $('#idWechatTabs').tabs('add',{
		    title:strTitle,
		    content: '<div id="'+id+'_Padnel" style="padding:2px;width:920px;height:500px;"></div>',
		    closable: true
	    });	
	    this.arrSession.push(new JWeChatSession(15,40,this.width,this.height,id,document.getElementById(id+"_Padnel")));
	    this.setCurrentTabIndex(this.getSessionCount()-1);
	    this.showCurrentTab();
	}
	this.getSessionCount = function(){ 
	    return this.arrSession.length; 
	}
	this.setCurrentTabIndex = function(index){
	    if(typeof(index) != "undefined")
	        this.currentIndex = index;
	}
	this.removeTab = function(index){
	    if(index<0||index>this.getSessionCount())
	        return;
	     this.arrSession.splice(index,1);
	}
	this.showCurrentTab = function() {
	    $("#idWechatTabs").tabs("select", this.currentIndex);
	}
	this.Display = function (flag)
	{
		if(flag == 1)
		{
			this.oPanel.style.display = "block";
		}
		else
		{
		    this.oPanel.style.display = "none";
		}				
	}

	
    return this;
}


///////////////////////////////////////////////////////////////////////////// 
function JWeChatSession(nLeft,nTop,nWidth,nHeight,sessionId,oContentWindow,oWindow)
{
	//########################//
	//			属性		  //
	//########################//	
	//公共属性
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
	oWindow = (typeof(oWindow) == "undefined")?null:oWindow;
	this._window = (oWindow==null)?window:oWindow;
	this._contentWindow = (oContentWindow==null)?window:oContentWindow;
	this.id = sessionId;//"oWeChat_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";
	
	// 主图相关的HTML对象
	this.oPanel     		= null;	
	
	this.errDescription = "";		// 错误提示信息

	//########################//
	//			方法	　    //
	//########################//

	//内部方法
	this._createObject = function _createObject(){
        this.oPanel = this._window.document.createElement("DIV");
        this.oPanel.style.cursor = "move";
        this.oPanel.style.position = "absolute";
	    this.oPanel.style.padding = "5px";
        this.oPanel.style.left = this.left+"px";
        this.oPanel.style.top = this.top+"px";
	    this.oPanel.className  = "easyui-panel";
	    this.oPanel.id = this.name;
	    this.oPanel.setAttribute("data-options", "fit:true");
	    if(this._contentWindow == this._window){
	        this._contentWindow.document.body.appendChild(this.oPanel);
	    }
	    else{
	        this._contentWindow.appendChild(this.oPanel);
	    }
	    this.oPanel.innerHTML = this.getMainHtml();
        $.parser.parse('#'+this.id+"_Padnel");
        this._loadMessage();
	}
	this.getFunctionHtml = function (){
	    var strHtml = "";
	    strHtml = strHtml+ '<a  id = "'+this.GetId("idWechat_SendFile")+'" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:\'icon-print\',onclick:OnSendFile">发送文件</a>';
        strHtml = strHtml+ '<a href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:\'icon-help\'"> 接收文件</a>';
        strHtml = strHtml+ '<a href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:\'icon-save\'">设置</a>';
        return strHtml;
	}
	this.getUserHtml = function(){
	    var strHtml = "";
	    strHtml = strHtml + '<div class="easyui-panel" title="用户信息" style="width:180px;padding:10px "><table cellpadding="1">';
        var country = "中国";
        var province = "北京";
        var city = "北京";
        var userNickName = "测试人员";
        var sex = "男";
        var oSession = application.oWechatManager.GetSessionItemBySessionID(this.id);
        if(oSession != null){
            country = oSession.country;
            province = oSession.province;
            city = oSession.city;
            userNickName = oSession.userNickName;
            sex = (oSession.sex == "1")?"男":"女";
        }                
	    strHtml = strHtml+ '<tr><td >国籍:</td><td>'+country+'</td> </tr>';
	    strHtml = strHtml+ '<tr><td >省份:</td><td>'+province+'</td> </tr>';
	    strHtml = strHtml+ '<tr><td >地区:</td><td>'+city+'</td> </tr>';
	    strHtml = strHtml+ '<tr><td >姓名:</td><td>'+userNickName+'</td> </tr>';
	    strHtml = strHtml+ '<tr><td >性别:</td><td>'+sex+'</td> </tr>';
                    
 	    strHtml = strHtml + '</table></div>';
        return strHtml;
	}
	this.getAgentHtml = function(){
	    var strHtml = "";
	    strHtml = strHtml + '<div class="easyui-panel" title="座席信息" style="width:180px;padding:10px "><table cellpadding="1">';
        var company = "中国";
        var agentID = "1001";
        var agentName = "1001";
	    strHtml = strHtml+ '<tr><td >企业名称:</td><td>'+company+'</td> </tr>';
	    strHtml = strHtml+ '<tr><td >座席工号:</td><td>'+agentID+'</td> </tr>';
	    strHtml = strHtml+ '<tr><td >座席名称:</td><td>'+agentName+'</td> </tr>';
                    
 	    strHtml = strHtml + '</table></div>';
        return strHtml;
	}
	this.getMainHtml = function(){
	    var strHtml = "";
		strHtml = strHtml+ '<div class="easyui-layout" data-options="fit:true"  style="width:700px;height:350px; padding:10px 60px 20px 60px">';
		strHtml = strHtml+ '	<div data-options="region:\'east\'" style="width:200px;">';
		strHtml = strHtml+ '		<div id="'+this.GetId("idWechat_Info")+'" class="easyui-layout" data-options="fit:true">';
		strHtml = strHtml+ '		    <div id="'+this.GetId("idWechat_Info_User")+'" data-options="region:\'north\',split:true,border:false" style="height:180px;padding:10px">'+this.getUserHtml()+'</div>';
		strHtml = strHtml+ '		    <div data-options="region:\'center\',border:false"></div>';
		strHtml = strHtml+ '		    <div id="'+this.GetId("idWechat_Info_Agent")+'" data-options="region:\'south\',split:true,border:false" style="height:150px;padding:10px">'+this.getAgentHtml()+'</div>';
		strHtml = strHtml+ '		</div>';
		strHtml = strHtml+ '	</div>';
		strHtml = strHtml+ '	<div data-options="region:\'center\',iconCls:\'icon-ok\'" >';
		strHtml = strHtml+ '		<div id="'+this.GetId("idWechat_Pane")+'" class="easyui-layout" data-options="fit:true">';
		strHtml = strHtml+ '		<div data-options="region:\'center\',border:false" style="height:150px">';
		strHtml = strHtml+ '			<div class="easyui-panel" title="聊天记录" data-options="fit:true" >';
		strHtml = strHtml+ '				<table id="'+this.GetId("idWechat_tabChat")+'" width="100%"  border="0"></table>';
		strHtml = strHtml+ '			</div>';
		strHtml = strHtml+ '		</div>';
		strHtml = strHtml+ '		<div data-options="region:\'south\',split:true,border:false" style="height:120px">';
		strHtml = strHtml+ '			<div class="easyui-layout" data-options="fit:true">';
		strHtml = strHtml+ '				<div id="'+this.GetId("idWechat_Pane_Function")+'" data-options="region:\'north\',border:true" style="height:30px">'+this.getFunctionHtml()+'</div>';
		strHtml = strHtml+ '				<div id="'+this.GetId("idWechat_Pane_Input")+'" data-options="region:\'center\',border:false">';
		strHtml = strHtml+ '                       <input id="'+this.GetId("idWechat_Pane_inputData")+'" class="easyui-textbox" data-options="multiline:true,buttonText:\'发送\',prompt:\'发送...\',onClickButton:OnWechatSend" style="width:520px;height:75px;" >';
		strHtml = strHtml+ '				</div>';
		strHtml = strHtml+ '			</div>';
		strHtml = strHtml+ '		</div>';
		strHtml = strHtml+ '		</div>';
		strHtml = strHtml+ '	</div>';
		strHtml = strHtml+ '</div>';
		return strHtml;
	}
	this._loadMessage = function(){ 
        var oWechatSession = application.oWechatManager.GetSessionItemBySessionID(this.id);
	    if(oWechatSession != null){
	        for(var i=0;i<oWechatSession.GetMessageCount();i++){
	            var oItem = oWechatSession.GetMessageItemByIndex(i);
	            if(oItem.msgType == "begin" || oItem.msgType == "end"){
	                continue;
	            }
	            this.ShowRecvMessage(oItem.msgseq);
	        }
	    }
	}
	this.GetFormatMessage = function(message){
	    if(typeof(message) == "undefined") message = "";
        var len = message.length; 
        var width = len*18;
        var height = 30;
        var sReturn = "";
        sReturn = "<input class=\"easyui-textbox\" data-options=\"multiline:true,editable:false\" value="+message+" style=\"width:"+width+"px;height:"+height+"px\">";
        return sReturn;
	}
	this.GetId = function (uiid){
	    return this.id+"_"+uiid;
	}
	this.GetSessionId = function (){
	    return this.id;
	}

	
	//--------------------------------------------------------------------------------------------------
	// 公共方法
	//--------------------------------------------------------------------------------------------------
	this.ShowRecvMessage = function(msgseq){
        var oSession = application.oWechatManager.GetSessionItemBySessionID(this.id);
        if(oSession != null){
            var bSender = false;
            var sSender = (bSender)?oSession.userNickName:oSession.vccName;
            var oMessageItem = oSession.GetMessageItem(msgseq);
            if(oMessageItem.msgType == "text")
            {
                this._showTextMessage(oSession.userNickName,oMessageItem.content,bSender);
            }
            else if(oMessageItem.msgType == "image")
            {
            
            }
            else if(oMessageItem.msgType == "voice")
            {
            
            }
            else if(oMessageItem.msgType == "vedio")
            {
            
            }
            else if(oMessageItem.msgType == "event")
            {
            
            }
            else if(oMessageItem.msgType == "notice")
            {
            
            }
            else{}
        }
	}
	this.ShowSendMessageReport = function(msgseq){
        var oSession = application.oWechatManager.GetSessionItemBySessionID(this.id);
        if(oSession != null){
            var bSender = true;
            var sSender = (bSender)?oSession.userNickName:oSession.vccName;
            var oMessageItem = oSession.GetMessageItem(msgseq);
            if(oMessageItem.msgType == "text")
            {
               // this._showTextMessage(oSession.vccName,oSession.content,bSender);
            }
            else if(oMessageItem.msgType == "image")
            {
            
            }
            else if(oMessageItem.msgType == "voice")
            {
            
            }
            else if(oMessageItem.msgType == "vedio")
            {
            
            }
            else if(oMessageItem.msgType == "event")
            {
            
            }
            else if(oMessageItem.msgType == "notice")
            {
            
            }
            else{}
        }
	}
	this.ShowSendMessage = function(message,bSuccess){
        var oSession = application.oWechatManager.GetSessionItemBySessionID(this.id);
        if(oSession != null){
             this._showTextMessage(oSession.vccName,message,true);
        }
        else
        {   
             this._showTextMessage("我说:",message,true);
        }
	}
	this._showTextMessage = function(sender,message,bSender){
	    var  oTabChat = document.getElementById(this.GetId("idWechat_tabChat"));
	    var  oTr = oTabChat.insertRow(oTabChat.rows.length);
	    var   sHtml = "";
	    if(bSender == false){   
		    sHtml = " <td align=\"left\" width=\"60\" >"+sender+">></td>";
		    sHtml = sHtml + "<td align=\"left\">"+this.GetFormatMessage(message)+" </td>";
		    sHtml = sHtml + "<td width=\"60\" > </td>";
	    }
	    else{    
		    sHtml = "<td width=\"60\" > </td>"
		    sHtml = sHtml + "<td align=\"right\">"+this.GetFormatMessage(message)+" </td>";
		    sHtml = sHtml + "<td align=\"right\" width=\"60\" ><<"+sender+" </td>";
	    }
	    oTr.innerHTML = sHtml;
		 
	//    $.parser.parse();
	    // $.parser.parse('#'+this.name);
	     $.parser.parse('#'+this.id+"_Padnel");
	    application.oWecharCtrl.showCurrentTab();

	}

	//--------------------------------------------------------------------------------------------------
	// 调整显示区域的大小
	//--------------------------------------------------------------------------------------------------
	this.show = function show(){
		if( this.oBarDisplay )
		{
			this.oBarDisplay.style.left = this.left;
			this.oBarDisplay.style.top = this.top;
			this.oBarDisplay.style.width = this.width;
			this.oBarDisplay.style.height = this.height;
		}
		this.resize(this.left,this.top,this.width,this.height);
	}
	this.resize=function resize(nLeft,nTop,nWidth,nHeight)	{
		this.left	= (typeof(nLeft)=="number")?nLeft:0;
		this.top	= (typeof(nTop)=="number")?nTop:0;
		this.width	= (nWidth>0)?nWidth:100;
		this.height	= (nHeight>0)?nHeight:100;
		with(this.oBarDisplay.style)
		{
			pixelWidth		= this.width;
			pixelHeight		= this.height;
			pixelLeft		= this.left;
			pixelTop		= this.top;
		}
	}

	this._createObject();
	
	return this;
}

function OnWechatSend(){
	alert("OnWechatSend");
    var sessionid = this.id.split("_")[0];
    var oSession = application.oWecharCtrl.getSessionObject(sessionid);
    if(oSession != null){
         application.oWechatManager.SendTextMessage(sessionid,this.value);
		 oSession.ShowSendMessage(this.value,false);
    }
}
function OnSelectWeChatTabs(title,index){
     application.oWecharCtrl.setCurrentTabIndex(index);
}
function OnCloseWeChatTabs(title,index){  
     application.oWecharCtrl.removeTab(index);
}

function OnSendFile(){
	alert("OnSendFile");
    var sessionid = this.id.split("_")[0];
    var oSession = application.oWecharCtrl.getSessionObject(sessionid);
    if(oSession != null){
        // application.oWechatManager.SendWechTextMessage(sessionid,this.value);
		// oSession.ShowSendMessage(this.value,false);
    }
}