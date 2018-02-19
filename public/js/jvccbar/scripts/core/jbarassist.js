//  *****************************************************************************
//  文 件 名：	jbarassist.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		所有和电话条辅助有关的函数
//  说    明：
//		     电话条辅助函数
//  修改说明：
// *****************************************************************************


//--------------------------------------------------------------------------------------------------
// 【1】VccBar辅助类
//--------------------------------------------------------------------------------------------------

function JVccBarAssist(){
    this.oBarBtnControl = new JBarBtnControl();
    this.oBarAgentStatus = new JBarAgentStatus();
    
    return this;
}

//--------------------------------------------------------------------------------------------
//--- 【2】界面命令按钮控制
//--------------------------------------------------------------------------------------------
function JBarBtnControl(){
    //内部函数
    this._arrCmd = new Array(); 
    this._arrCmdIndex = new Array(); 
    this._type = 0; //0:disable 1:display
    this._getCmdID = function (index){
        for(var i=0;i<this._arrCmdIndex.length;i++)
        {
		        if(this._arrCmdIndex[i] == index)
			        return this._arrCmd[i];
        }
        return "";
    }
    this._ChangeObject = function(flag,oElem){
        if(flag == true){//可用
            if(this._type == 0){
                oElem.disabled = false;
             }
             else{
                oElem.style.display = "";
             }
        }
        else{
            if(this._type == 0){
                oElem.disabled = true;
             }
             else{
                oElem.style.display = "none";
             }
        }
    }

    //公共函数   
    //绑定btnID和UIID 
    this.AttachBtnByUIID = function(objID,btnID){
        this._arrCmd.push(objID);
        this._arrCmdIndex.push(btnID);
    }
    //更新界面
    this.UpdateUI = function(btns){
	    var  arrIndex = btns.split("|"); 		
        for( var j=0;j<this._arrCmdIndex.length;j++){
             var id = this._arrCmdIndex[j];
             var bFind = false;
             for( var i=0;i<arrIndex.length;i++){
                if(parseInt(arrIndex[i]) == id)
                {
                    bFind = true;
                    break;
                }
             }
             var uiID = this._getCmdID(id);
             if(uiID == "")
                continue;
             var oElement = document.getElementById(uiID);
             if(oElement == null)
                continue;
              this._ChangeObject(bFind,oElement);
         }
    }
    //设置显示类型 0:不可用 其它：不显示
    this.SetUpdateType =function(type){
        this._type = type;
    }
    return this;
}


//--------------------------------------------------------------------------------------------
//--- 【3】电话条状态变化时间统计
//--------------------------------------------------------------------------------------------

function BarBeginAgentStatusTimer(){
    if(application.oVccBarAssist.oBarAgentStatus._timer == null)
        application.oVccBarAssist.oBarAgentStatus._timer = setInterval( BarAgentStatusTimeSum ,1000);
}
function BarStopAgentStatusTimer(){
	if(application.oVccBarAssist.oBarAgentStatus._timer != null)
	    clearInterval(application.oVccBarAssist.oBarAgentStatus._timer);
}

function BarAgentStatusTimeSum(){
    application.oVccBarAssist.oBarAgentStatus.AgentStatusTimeSum();
}

function JBarAgentStatus(){
    this._busySubStatusSelectedItem = "";
    this._agentStatus = 0;//0：未登录 1：忙碌 2：空闲 3：通话中 4：后续态
    
    this._timerCount = 0;
    this._timer = null;
    this._arrSubBusyIndex = new Array();
    this._arrSubBusyText  = new Array();
    
    //公共函数  
    //设置忙碌子状态
	this.SetSubBusyStatus = function(param){
	    this._arrSubBusyIndex.length = 0;
	    this._arrSubBusyText.length = 0;
        var  arrItem = param.split("$"); 		
        for(var i=0;i<arrItem.length;i++)
        {
            var item = arrItem[i].split("|");
            if(item.length == 2)
            {
                this._arrSubBusyIndex.push(parseInt(item[0]));
                this._arrSubBusyText.push(item[1]);
            }
        }
	}
 
    //设置agent状态
   	this.SetAgentStatus = function(agentStatus){
   	    //通话算一个状态
	    if(this._agentStatus == agentStatus &&  this._agentStatus != 3)
	        return;
	    this._agentStatus = agentStatus;
	    this._timerCount = 0;
	    if(this._agentStatus>0)
	    {
            BarBeginAgentStatusTimer();
	    }
	    else
	    { 
            BarStopAgentStatusTimer();
	    }
	}
    this.OnAgentStatusTime = function (agentStatus,agentStatusText,timerCount){}     
    
    
    
    //统计电话条某个状态的时间
	this.AgentStatusTimeSum = function(){
	   this._timerCount = this._timerCount+1;
	   this._showAgentStatusTimer();
    }    
    
    this._getSubStatusText = function(){
        var agentSubBusyStatus = application.oJVccBar.GetAgentSubBusyStatus();
        if(agentSubBusyStatus ==-1){
            this._busySubStatusSelectedItem = "";
        }
        else{
            for(var i=0;i<this._arrSubBusyIndex.length;i++)
            {
                if(this._arrSubBusyIndex[i] == agentSubBusyStatus)
                {
                    this._busySubStatusSelectedItem = this._arrSubBusyText[i];
                    break;
                }
            }
        }
    }
    this._getTimerString = function  (len){  
        if(len == 0)
            return "";        
         var  hour = parseInt(len/3600);
	     hour =(hour<10 ? "0"+hour:hour);
	     if(hour == "00")
	        hour = "";
	     else
	        hour = hour+":"
	        
	     var  minute = parseInt((len%3600)/60);
	     minute =(minute<10 ? "0"+minute:minute);
	     var  second = len%60;
	     second =(second<10 ? "0"+second:second);
    	 
	    return (hour.toString()+minute.toString()+":"+second.toString());
    }
    this._getTextByStatus = function (){
		if(this._agentStatus == 1){
		    this._getSubStatusText();
	        if(this._busySubStatusSelectedItem != "")
			    return this._busySubStatusSelectedItem;
		    return "忙碌";
	    }
	    else if(this._agentStatus == 2){
			return "就绪";
	    }
	    else if(this._agentStatus == 3){
			return "通话中";
	    }
	    else if(this._agentStatus == 4){
			return "后续态";
	    }
	    else{
			return "未登录";
	    }	
    }
    this._showAgentStatusTimer = function ()
    {
        this.OnAgentStatusTime(this._agentStatus,this._getTextByStatus(),this._getTimerString(this._timerCount));
    }

    
    return this;
}



//--------------------------------------------------------------------------------------------------
// 【4】微信封装类
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
// 【4.1】微信单条消息类
//--------------------------------------------------------------------------------------------------

function JWeChatMessageItem(){
    this.direction = 0;     //0:接收 1:发送
    this.msgseq = -1;       //会话中系列号
    this.msgType = "";      //text/image/voice/vedio/end/begin/event/notice
    this.content = "";      //消息内容或者信息url，msgType为text起作用
    this.sessionUrl = "";   //text/image/voice/vedio：mms上的内容的url
    this.recongnition="";   //语音识别内容，msgType为voice起作用
    this.Event = "";	    //事件类型，如 subscribe，msgType为event起作用
    this.eventKey = "";		//事件值，msgType为event起作用
    this.title = "";		//结构化数据标题，msgType为notice起作用
    this.data = "";		    //结构化数据； 需要base64编码msgType为notice起作用
    this.timeStamp = "";	//String 消息时间
    this.needMmcOpenData = 0; //mmc需要解析标示：1 需要解析data，0表示不需要解析，msgType为notice起作用
    
    this.code = 0;
    this.des = "";
    this.sender = "";

    return this;
}
//--------------------------------------------------------------------------------------------------
// 【4.1】微信会话类
//--------------------------------------------------------------------------------------------------
function JWechChatSession(){
    this.type = "00";       //会话类型：00 表示 微信 ,01 表示webchat待处理
    this.sessionId = "";    //会话id
    
    this.userNickName = "";                
    this.sex = "0";
    this.province = "";
    this.city = "";
    this.country = "";    
    this.userId = "";       //微信用户号
    
    this.vccPublicId = "";  //企业微信公共号
    this.vccName = "";
    this.msgSession = new Array();
    this.status = 1;       //状态end:0 begin:1

    //--------------------------------------------------------------------------------------------------
    // 公共函数
    //--------------------------------------------------------------------------------------------------
    this.AddMessageItem = function(sender,msgseq,msgType,content,sessionUrl,recongnition,Event,eventKey,title,data,timeStamp,needMmcOpenData){
        var index = this.GetMessageIndex(msgseq)
        if(index == -1)
        {
            var item = new JWeChatMessageItem();
            item.sender = sender;
            item.direction = (item.sender == this.userId)?0:1;   //0:接收 1:发送
            item.msgseq = msgseq;       //会话中系列号
            item.msgType = msgType;      //text/image/voice/vedio/end/begin/event/notice
            item.content = content;      //消息内容或者信息url，msgType为text起作用
            item.sessionUrl = sessionUrl;   //text/image/voice/vedio：mms上的内容的url
            item.recongnition=recongnition;   //语音识别内容，msgType为voice起作用
            item.Event = Event;	    //事件类型，如 subscribe，msgType为event起作用
            item.eventKey = eventKey;		//事件值，msgType为event起作用
            item.title = title;		//结构化数据标题，msgType为notice起作用
            item.data = data;		    //结构化数据； 需要base64编码msgType为notice起作用
            item.timeStamp = timeStamp;	//String 消息时间
            item.needMmcOpenData = needMmcOpenData;
            this.msgSession.push(item);
            return item;
        }
        return this.msgSession[index];
    }
    this.GetMessageCount = function(){ return this.msgSession.length;}
    this.GetMessageItemByIndex = function(index){
        if(index<0 ||index >= this.msgSession.length ){
            return null;
        }
        return this.msgSession[index];
    }

    this.GetMessageItem = function(msgseq){
        var index = this.GetMessageIndex(msgseq)
        if(index == -1)
            return null;
        return this.msgSession[index];
    }
    this.GetLastSendItem = function(){
        for(var i=this.msgSession.length-1;i>0;i--)
        {
		    if( this.msgSession[i].sender == this.vccPublicId  && this.msgSession[i].direction == 1)
			    return this.msgSession[i];
        }
        return null;
    }
    this.GetMessageIndex = function(msgseq){
        for(var i=0;i<this.msgSession.length;i++)
        {
		    if( this.msgSession[i].msgseq == msgseq )
			    return i;
        }
        return -1;
    }
}

//--------------------------------------------------------------------------------------------------
// 【4.1】微信管理类
//--------------------------------------------------------------------------------------------------

function JWechChatManager(){
    //微信会话集合
    this._currentSession = "";
    this.weChatSessions = new Array();

    this.arrSendFileName = new Array();
    this.arrSendFileSessionID = new Array();

    this.arrRecvFileName = new Array();
    this.arrRecvFileSessionID = new Array();
    this.arrRecvFileMsgseq = new Array();

    //得到Session的Index
    this.GetSessionIndexBySessionID = function(sessionId){
        for(var i=0;i<this.weChatSessions.length;i++)
        {
		    if( this.weChatSessions[i].sessionId == sessionId)
			    return i;
        }
        return -1;
    }
    this.GetSessionIndexByUserId = function(userId){
        for(var i=0;i<this.weChatSessions.length;i++)
        {
		    if( this.weChatSessions[i].userId == userId)
			    return i;
        }
        return -1;
    }
    this.SetUserInfo = function(param){
        //00oFtrNjhO1964Jk413k9jaYRTb5RM|5ZC06IOc5Yab|1|5YyX5Lqs|5rW35reA|5Lit5Zu9
        //userId|nikeName的base64编码|Sex（1男，2女，0未知）|Province的base64编码|city的base64编码|country的base64编码
        var oParam = param.split("|"); 
        if(oParam.length == 6)
        {
            var sessionItem = this.GetSessionItemByUserId(oParam[0]);
            if(sessionItem != null){
                sessionItem.userNickName = GetGBKFromBase64(oParam[1]);
                sessionItem.sex = oParam[2];
                sessionItem.province = GetGBKFromBase64(oParam[3]);
                sessionItem.city = GetGBKFromBase64(oParam[4]);
                sessionItem.country = GetGBKFromBase64(oParam[5]);
                this.OnBeginSession(sessionItem.sessionId);
            }
        }
    }

    //得到Session的Item
    this.GetSessionItemByUserId = function(userId){
        var index = this.GetSessionIndexByUserId(userId);
        if(index == -1)
            return null;
        return this.weChatSessions[index];    
    }

    //得到Session的Item
    this.AddSessionItem = function(sessionId,type,userId,vccPublicId){
        var index = this.GetSessionIndexBySessionID(sessionId,userId,vccPublicId);
        if(index == -1)
        {
            var sessionItem = new JWechChatSession();
            sessionItem.type = type;
            sessionItem.sessionId = sessionId;
            sessionItem.userId = userId;
            sessionItem.vccPublicId = vccPublicId;
            this.weChatSessions.push(sessionItem);
            return sessionItem;
        }
        return null;    
    }

    //缓存接收到对方发过来消息的事件 OnRecvWeChatMessage
    this.OnSaveRecvMessageReport = function(sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp){
        var sessionItem = this.GetSessionItemBySessionID(sessionId);
        if(sessionItem == null){
            this._currentSession = sessionId;
            sessionItem = this.AddSessionItem(sessionId,type,userId,vccPublicId);
        }
        if(sessionItem != null)
        {
            sessionItem.AddMessageItem(userId,msgseq,msgType,content,sessionUrl,recongnition,Event,eventKey,title,data,timeStamp,0);
            if(msgType == "begin"){
                if(application.oJVccBar.GetJVccBarType() == vccBarTypeHTML5 ){
                    application.oJVccBar.GetWeChatParam(userId);
                }
                else{
                    this.SetUserInfo(application.oJVccBar.GetWeChatParam(userId));
                }                
            }
            else if(msgType == "end"){
                this.OnEndSession(sessionId);
            }
            else{
                this.OnRecvMessage(sessionId,msgseq);
            }
        }
    }

    //缓存自己发送消息返回事件 OnSendWeChatMsgReport
    this.OnSaveSendMessageReport = function(userId,sessionId,msgseq,code,des,timeStamp){
        var sessionItem = this.GetSessionItemBySessionID(sessionId);
        if(sessionItem != null){
            var item = sessionItem.GetLastSendItem()
            if(item != null){
                item.code = code;
                item.des = des;
                item.timeStamp = timeStamp;
                item.msgseq = msgseq;
                //保存消息发送状态到队列中
                this.OnSendMessageReport(sessionId,msgseq);
            }
        }
    }
    //缓存发送消息到队列中  SendWeChatMsg时缓存
    this.SaveSendMessage = function(sessionId,type,userId,vccPublicId,msgtype,content,tempURL,title,data,needMmcOpenData){
        var sessionItem = this.GetSessionItemBySessionID(sessionId);
        if(sessionItem != null)
        {
            //sender,msgseq,msgType,content,sessionUrl,recongnition,Event,eventKey,title,data,timeStamp,needMmcOpenData
            //保存到队列中
            sessionItem.AddMessageItem(vccPublicId,-1,msgtype,content,tempURL,"","","",title,data,"",needMmcOpenData);
        }
    }

    //触发文件伤处结果的事件
    this.OnInvokeUploadFileToMMSReport = function (strFileName,status,strUrl){
        if(status == 1 || status == 2){
            for(var i=0;i<this.arrSendFileName.length;i++)
            {
                if( this.arrSendFileName[i] == strFileName){
                    this.OnUploadFileStatus(this.arrSendFileSessionID[i],status,strUrl);
                    this.arrSendFileSessionID.slice(i,1);
                    this.arrSendFileName.slice(i,1);
                    break;
                }
            }
        }
    }
    //触发文件伤处结果的事件
    this.OnInvokeDownFileFromMMSReport = function (strUrl,status,strFileUrl,msgseq){
        if(status == 1 || status == 2){
            for(var i=0;i<this.arrRecvFileName.length;i++)
            {
                if( this.arrRecvFileName[i] == strUrl && this.arrRecvFileMsgseq[i] == msgseq){
                    this.OnDowndFileStatus(this.arrRecvFileSessionID[i],this.arrRecvFileMsgseq[i],status,strFileUrl);
                    this.arrRecvFileSessionID.slice(i,1);
                    this.arrRecvFileName.slice(i,1);
                    this.arrRecvFileMsgseq.slice(i,1);
                    break;
                }
            }
        }
    }

    //////////////////////////////////////////////////////////////////////
    ///// public function
    ///////////////////////////////////////////////////////////////////
    //1.SendTextMessage
    this.SendTextMessage = function(sessionId,message){
        if(sessionId == "") sessionId = this._currentSession;
        var sessionItem = this.GetSessionItemBySessionID(sessionId);
        if(sessionItem != null){
            //sessionId: string, type:string, userId:string，vccPublicId: string，msgtype: string，content: string，tempUrl:string,title:string,data:string, needMmcOpenData:int
            application.oJVccBar.SendWeChatMsg(sessionId,sessionItem.type,sessionItem.userId,sessionItem.vccPublicId,"text",message,"","","",0);
        }
    }

    //2.SendImageMessage
    this.SendImageMessage = function(sessionId,tempUrl){
        if(sessionId == "") sessionId = this._currentSession;
        var sessionItem = this.GetSessionItemBySessionID(sessionId);
        if(sessionItem != null)
        {
            //sessionId: string, type:string, userId:string，vccPublicId: string，msgtype: string，content: string，tempUrl:string,title:string,data:string, needMmcOpenData:int
            application.oJVccBar.SendWeChatMsg(sessionId,sessionItem.type,sessionItem.userId,sessionItem.vccPublicId,"image","",tempUrl,"","",0);
        }
    }

    //3.SendVoiceMessage
    this.SendVoiceMessage = function(sessionId,tempUrl){
        if(sessionId == "") sessionId = this._currentSession;
        var sessionItem = this.GetSessionItemBySessionID(sessionId);
        if(sessionItem != null)
        {
            //sessionId: string, type:string, userId:string，vccPublicId: string，msgtype: string，content: string，tempUrl:string,title:string,data:string, needMmcOpenData:int
            application.oJVccBar.SendWeChatMsg(sessionId,sessionItem.type,sessionItem.userId,sessionItem.vccPublicId,"voice","",tempUrl,"","",0);
        }
    }
    //4.SendVedioMessage
    this.SendVedioMessage = function(sessionId,tempUrl,title){
        if(sessionId == "") sessionId = this._currentSession;
        var sessionItem = this.GetSessionItemBySessionID(sessionId);
        if(sessionItem != null)
        {
            //sessionId: string, type:string, userId:string，vccPublicId: string，msgtype: string，content: string，tempUrl:string,title:string,data:string, needMmcOpenData:int
            application.oJVccBar.SendWeChatMsg(sessionId,sessionItem.type,sessionItem.userId,sessionItem.vccPublicId,"vedio","",tempUrl,title,"",0);
        }
    }
    //5.SendFormatMessage
    this.SendFormatMessage = function(sessionId,title,data,needMmcOpenData){
        if(sessionId == "") sessionId = this._currentSession;
        var sessionItem = this.GetSessionItemBySessionID(sessionId);
        if(sessionItem != null)
        {
            //sessionId: string, type:string, userId:string，vccPublicId: string，msgtype: string，content: string，tempUrl:string,title:string,data:string, needMmcOpenData:int
            application.oJVccBar.SendWeChatMsg(sessionId,sessionItem.type,sessionItem.userId,sessionItem.vccPublicId,"notice","","",title,data,needMmcOpenData);
        }
    }
    //6.EndMessage
    this.EndMessage = function(sessionId){
        if(sessionId == "") sessionId = this._currentSession;
        var sessionItem = this.GetSessionItemBySessionID(sessionId);
        if(sessionItem != null)
        {
            //sessionId: string, type:string, userId:string，vccPublicId: string，msgtype: string，content: string，tempUrl:string,title:string,data:string, needMmcOpenData:int
            application.oJVccBar.SendWeChatMsg(sessionId,sessionItem.type,sessionItem.userId,sessionItem.vccPublicId,"end","","","","",0);
        }
    }


    //7.UploadFileToMMS
    this.UploadFileToMMS = function(sessionId,strFileName){
        if(strFileName == "") return 0;
        if(sessionId == "") sessionId = this._currentSession;
        var oWechatSession = this.GetSessionItemBySessionID(sessionId);
        if(oWechatSession != null)
        {
            this.arrSendFileName.push(strFileName);
            this.arrSendFileSessionID.push(sessionId);
            application.oJVccBar.UploadFileToMMS(strFileName,oWechatSession.userId,oWechatSession.vccPublicId);
        }
        return 0;
    }
    //8.DownFileFromMMS
    this.DownFileFromMMS = function(sessionId,msgseq,url){
        if(url == "") return 0;
        if(sessionId == "") sessionId = this._currentSession;
        var oWechatSession = this.GetSessionItemBySessionID(sessionId);
        if(oWechatSession != null)
        {
            this.arrRecvFileName.push(url);
            this.arrRecvFileSessionID.push(sessionId);
            this.arrRecvFileMsgseq.push(msgseq);
            //url,userId,vccPublicId,sessionId,msgSeq
            application.oJVccBar.DownFileFromMMS(url,oWechatSession.userId,oWechatSession.vccPublicId,sessionId,msgseq);
        }
        return 0;
    }

    //9.GetSessionItemBySessionID
    this.GetSessionItemBySessionID = function(sessionId){
        var index = this.GetSessionIndexBySessionID(sessionId);
        if(index == -1)
            return null;
        return this.weChatSessions[index];
    }
    //10.GetSessionItem
    this.GetSessionItem = function(sessionId,msgseq){
        var oWechatSession = this.GetSessionItemBySessionID(sessionId);
        if(oWechatSession != null){
            for(var i=0;i<oWechatSession.GetMessageCount();i++){
                var oItem = oWechatSession.GetMessageItemByIndex(i);
                if(oItem.msgseq == msgseq){
                    return oItem;
                }
            }
        }
        return null;
    }

    //////////////////////////////////////////////////////////////////////
    ///// public function
    ///////////////////////////////////////////////////////////////////
    //session开始事件
    this.OnBeginSession = function(sessionID) {}
    //session结束事件
    this.OnEndSession = function(sessionID) {}
    //session接收文本事件
    this.OnRecvMessage = function(sessionID,msgseq) {}
    //session接收到事件
    this.OnSendMessageReport = function(sessionID,msgseq) {}
    //session接收到事件
    this.OnUploadFileStatus = function (sessionID,status,strUrl){}
    this.OnDowndFileStatus = function (sessionID,msgseq,status,strUrl){}

}

