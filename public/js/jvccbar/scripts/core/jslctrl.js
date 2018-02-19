//  *****************************************************************************
//  文 件 名：	jslctrl.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		   监控控件
//  说    明：
//		   支持Silverlight下电话条功能
//  修改说明：
// *****************************************************************************

var G_oSiverlightCtrl = null;


function JSilverLightCtrl(nLeft,nTop,nWidth,nHeight,relationPath,oContentWindow,oWindow)
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
	this.id = "oSiverLight_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";
	this.oMonitorShow = null;
	this.oSL_MonShow = null;
	this.oSilverlight = null;
	this._realMethodName = "";
	G_oSiverlightCtrl = this;
	//电话条对象
	this._relationPath = (typeof(relationPath) == "undefined")?"":relationPath;

	
	this._createObject = function(){
        this.oMonitorShow = this._window.document.createElement("DIV");
        this.oMonitorShow.style.cursor = "move";
        this.oMonitorShow.style.position = "absolute";
        this.oMonitorShow.style.border = "1px solid #828282";
        this.oMonitorShow.style.left = this.left+"px";
        this.oMonitorShow.style.top = this.top+"px";
        this.oMonitorShow.style.width = this.width+"px";
        this.oMonitorShow.style.height = this.height+"px";
        this.oMonitorShow.style.textAlign = "center";
        this.oMonitorShow.id = "silverlightControlBarHost";
        if(this._contentWindow == this._window)
            this._contentWindow.document.body.appendChild(this.oMonitorShow);
        else
	        this._contentWindow.appendChild(this.oMonitorShow);
	    this.oMonitorShow.innerHTML = this._getMSLHtml();
	   
	    this.oSL_MonShow = this.oMonitorShow.firstChild;
	}

    this._getMSLHtml = function(){
        var sText = "";
        sText = sText + "<object id=\"objsilverlightBarControl\" data=\"data:application/x-silverlight-2,\" type=\"application/x-silverlight-2\" width=\"100%\" height=\"100%\" >";
 	//	sText = sText + "<param name=\"source\" value=\"/CIN-DCP/CIN-COM/CC-VccBar/CCVccBar/CCVccBar/Bin/Release/CCVccBar.xap\" >";
		sText = sText + "<param name=\"source\" value=\""+this._relationPath+"CCVccBar.xap\"/>";
        sText = sText + "<param name=\"onError\" value=\"onSilverlightBarError\" />";
        sText = sText + "<param name=\"background\" value=\"white\" />";
        sText = sText + "<param name=\"minRuntimeVersion\" value=\"4.0.50826.0\" />";
        sText = sText + "<param name=\"autoUpgrade\" value=\"true\" />";
        sText = sText + "<param name=\"onLoad\" value=\"SilverlightPluginBarLoaded\" />";
 //     sText = sText + "<param name=\"Windowless\" value=\"true\" />";
        sText = sText + "<a href=\"http://go.microsoft.com/fwlink/?LinkID=149156&v=5.0.61118.0\" style=\"text-decoration:none\">";
        sText = sText + "<img src=\"http://go.microsoft.com/fwlink/?LinkId=161376\" alt=\"Get Microsoft Silverlight\" style=\"border-style:none\"/>";
        sText = sText + "</a>";
        sText = sText + "</object>";
        
        return sText;    
    }
    
    this._createObject();
	
	this._GetAppMainPage = function(){
	    if(this.oSL_MonShow != null){
	        if(this.oSilverlight == null)
	        {
	            this.oSilverlight = this.oSL_MonShow.Content.MainApp;
	            this.oSilverlight.RegisterEventFun("OnSLEventFunction");
				this.oSilverlight.RegisterResponseFun("OnSLResponseFunction");
				this.SetCtrlAttribute("AgentType",0);
				this.SetCtrlAttribute("PassWord","111111");
				this.SetCtrlAttribute("MainPortID",14800);
				this.SetCtrlAttribute("BackPortID",14800);
				this.SetCtrlAttribute("TaskID","0");
				this.SetCtrlAttribute("MonitorPort",4502);
				this.SetCtrlAttribute("AppType",0);
				this.SetCtrlAttribute("SipServerPort",5060);
				this.SetCtrlAttribute("SipPassWord","00000000");
				this.SetCtrlAttribute("SipProtocol","UDP");
				this.SetCtrlAttribute("SipPassWdCryptType",0);
				this.SetCtrlAttribute("SipAuthType",1);
				this.SetCtrlAttribute("PhonType",0);
				this.SetCtrlAttribute("SelfPrompt",0);
				this.SetCtrlAttribute("forceEndProcess",g_DebugFlag);

	            this.OnMonitorControlLoad();
	        }
        }
	}	   

	this._invokeEventReport =  function(cmdIndex,param){
        if(this.eventCallBack != null){
            DisplayLog(VccBar_Log_Info,"JSilverLightCtrl:_invokeEventReport(cmdIndex="+cmdIndex+"  param="+param+")");
            this.eventCallBack(cmdIndex,param);
		}
	}
	this._invokeResponseReport = function(cmdName,param){
        if(this.responseCallBack != null){
			if( cmdName == "SetCTIInfo" || cmdName =="QueryCTIInfo")
			{
				DisplayLog(VccBar_Log_Info,"JSilverLightCtrl:_invokeResponseReport(cmdName="+this._realMethodName+"  param="+param+")");
				this.responseCallBack(this._realMethodName,param);
			}
			else
			{
				DisplayLog(VccBar_Log_Info,"JSilverLightCtrl:_invokeResponseReport(cmdName="+cmdName+"  param="+param+")");
				this.responseCallBack(cmdName,param);
			}
		//	this.responseCallBack(cmdName,param);
		}
	}
	this._InvokeMethod = function  _InvokeMethod(cmdName,param){
		 if( cmdName == "")
			return -1;
		DisplayLog(VccBar_Log_Debug,"JSilverLightCtrl:_InvokeMethod(cmdName="+cmdName+",param="+param+")");
		if(this.oSilverlight != null) 
			return this.oSilverlight.InvokeExecuteMethod(cmdName,param);
		return -1;
	}
	this._InvokeQueryMethod = function  _InvokeMethod(cmdName,param){
		 if( cmdName == "")
			return "";
		if(this.oSilverlight != null)
			return this.oSilverlight.InvokeReturnMethod(cmdName,param);
		return "";
	}
	
	//--------------------------------------------------------------------------------------------------
	// 公用函数
	//--------------------------------------------------------------------------------------------------
	this.attachEventfun = function attachEventfun(callbackFun){ this.eventCallBack = callbackFun;}
	this.attachResponsefun = function attachResponsefun(callbackFun) { this.responseCallBack = callbackFun; }
	this.GetBarCtrl = function (){ return this;}
	
	this.SetCtrlAttribute = function(aName,aValue){
		DisplayLog(VccBar_Log_Debug,"JVccBar:SetCtrlAttribute(aName="+aName+",aValue="+aValue+")");
	    if(this.oSilverlight != null){
			DisplayLog(VccBar_Log_Debug,"JVccBar:SetAttribute(aName="+aName+",aValue="+aValue+")");
	        this.oSilverlight.SetAttribute(aName,aValue);
	    }	
	}
	this.GetCtrlAttribute = function(aName){
	    if(this.oSilverlight != null){
	        return this.oSilverlight.GetAttribute(aName);
	    }	
		return "";
	}
	this.GetBarType = function () { return vccBarTypeSILVERLIGHT; }
	
	///////////////////////////////////////////////////////////////////////
	//方法
	this.Initial = function Initial()	{  return this._InvokeMethod("Initial","");}
	this.SerialBtn = function SerialBtn(btnIDS, hiddenIDS) { return this._InvokeMethod("SerialBtn",GetApspParam(btnIDS, hiddenIDS));}
	this.GetBtnStatus = function GetBtnStatus(CallNum) { return this._InvokeQueryMethod("GetBtnStatus",GetApspParam(CallNum)); }
	this.Configurate = function Configurate(Params) { return this._InvokeMethod("Configurate",GetApspParam(Params)); }
	this.GetConfiguration = function GetConfiguration() { return this._InvokeQueryMethod("GetConfiguration",""); }
	this.UnInitial = function UnInitial(code) { return this._InvokeMethod("UnInitial",code); }
	this.SetUIStyle = function SetUIStyle(barStyle) { 
		if(getLocalLanguage() == lg_zhcn){ alert("此方法无效");}
	    else {alert("invalidate Method")} 
	}
	this.GetVersion = function GetVersion() { return this._InvokeQueryMethod("GetVersion","");}
	
	//base status
	this.SetBusy = function SetBusy(subStatus) {  if(typeof(subStatus) == "undefined") subStatus=0; return this._InvokeMethod("SetBusy",GetApspParam(subStatus));	}
	this.SetIdle = function SetIdle() { return this._InvokeMethod("SetIdle",""); }
	this.SetWrapUp = function SetWrapUp() { return this._InvokeMethod("SetWrapUp",""); }
	this.SetCTICalloutTask = function SetCTICalloutTask(TastNum) { return this._InvokeMethod("SetCTICalloutTask",GetApspParam(TastNum)); }
	this.GetCTICalloutTask = function GetCTICalloutTask() { return this._InvokeMethod("GetCTICalloutTask","");}
	this.GetCallData = function GetCallData(destAgentID) { return this._InvokeMethod("GetCallData",GetApspParam(destAgentID)); }
	this.SetCallData = function SetCallData(destAgentID, calldata) { return this._InvokeMethod("SetCallData",GetApspParam(destAgentID, calldata)); }
	this.GetTransfer = function GetTransfer() { return this._InvokeMethod("GetTransfer",""); }
	this.SetTransfer = function SetTransfer(forwardDeviceID, forwardState, answerType) { return this._InvokeMethod("SetTransfer",GetApspParam(forwardDeviceID, forwardState, answerType)); }
	this.ChangeCallQueue = function ChangeCallQueue(calling, sid, orderid) { return this._InvokeMethod("ChangeCallQueue",GetApspParam(calling, sid, orderid)); }
	this.GetCallID = function GetCallID() { return this._InvokeMethod("GetCallID",""); }
	this.QuerySPGroupList = function QuerySPGroupList(groupID, agentStatus, cmdType, checkAuthor,action,interval) {
		if (typeof(cmdType) == "undefined") cmdType = "9"
		if (typeof(checkAuthor) == "undefined") checkAuthor = "0"
		this._realMethodName = "QuerySPGroupList";
	//	return this._InvokeMethod(APSP_QueryCTIInfo_CONF,GetApspParam(cmdType,groupID,agentStatus,checkAuthor,action,interval));
		return this._InvokeMethod("QueryCTIInfo",GetApspParam(cmdType, groupID, agentStatus, checkAuthor,action,interval));
	}
	this.GetCallInfo = function GetCallInfo() { return this._InvokeMethod("GetCallInfo",""); }
	this.SetTransparentParameter = function SetTransparentParameter(transparentParam) { return this._InvokeMethod("SetTransparentParameter",GetApspParam(transparentParam)); }
	this.GetAgentStatus = function GetAgentStatus(){	return this._InvokeQueryMethod("GetAgentStatus","");}
	this.GetAgentSubBusyStatus = function GetAgentSubBusyStatus(){ return this._InvokeQueryMethod("GetAgentSubBusyStatus","");}
	this.GetBusySubStatus = function GetBusySubStatus() { return this._InvokeQueryMethod("GetBusySubStatus",""); }
	this.SetDisplayNumber = function SetDisplayNumber(dstNum) {
		this._realMethodName = "SetDisplayNumber";
		return this._InvokeMethod("SetCTIInfo",GetApspParam("8",dstNum));
	}
	this.GetDisplayNumber = function GetDisplayNumber() {
		this._realMethodName = "GetDisplayNumber";
		return this._InvokeMethod("QueryCTIInfo",GetApspParam("21",""));
	}
	this.CallQueueQuery = function CallQueueQuery(serviceID,action,interval) { return this._InvokeMethod("CallQueueQuery",GetApspParam(serviceID,action,interval)); }
	this.QueryGroupAgentStatus = function QueryGroupAgentStatus(groupIDs, action, interval,type) {
		this._realMethodName = "QueryGroupAgentStatus";
		return this._InvokeMethod("QueryCTIInfo",GetApspParam("22",groupIDs, action, interval,type));
	}
	this.QueryPreViewCallOutNumbers = function QueryPreViewCallOutNumbers(serviceNum, agentID, num, realloc) {
		this._realMethodName = "QueryGroupAgentStatus";
		return this._InvokeMethod("QueryCTIInfo",GetApspParam("23",serviceNum, agentID, num, realloc));
	}
	this.QueryMonitorSumInfo = function QueryMonitorSumInfo(cmdName, amdParam) { return this._InvokeMethod("QueryMonitorSumInfo",GetApspParam(cmdName, amdParam)); }
	this.GetBase64Data = function GetBase64Data(data){	return GetBase64FromGBK(data);}
	this.GetDataFromBase64 = function GetDataFromBase64(data){ return GetGBKFromBase64(data); }
	this.SetWeChatQueueFlag = function SetWeChatQueueFlag(flag) {
		this._realMethodName = "SetWeChatQueueFlag";
		return this._InvokeMethod("SetCTIInfo",GetApspParam("30",flag));
	}
	this.GetWeChatQueueFlag = function GetWeChatQueueFlag() {
		this._realMethodName = "SetWeChatQueueFlag";
		return this._InvokeMethod("QueryCTIInfo",GetApspParam("30",""));
	}
	this.TransferCallQueue = function TransferCallQueue(queuekey, lTransferType, destNum) { return this._InvokeMethod("TransferCallQueue",GetApspParam(queuekey,lTransferType,destNum)); }
	this.SetActiveService = function SetActiveService(ServiceNum) {
		this._realMethodName = "SetActiveService";
		return this._InvokeMethod("SetCTIInfo",GetApspParam("26",ServiceNum));
	}
	this.GetActiveService = function GetActiveService() {
		this._realMethodName = "GetActiveService";
		return this._InvokeMethod("QueryCTIInfo",GetApspParam("26",""));
	}
	this.GetExitCause = function GetExitCause() { return this._InvokeQueryMethod("GetExitCause",""); }
	this.SetForwardNumber = function SetForwardNumber(Num,State) {
		this._realMethodName = "SetForwardNumber";
		return this._InvokeMethod("SetCTIInfo",GetApspParam("25",Num,State));
	}
	this.GetForwardNumber = function GetForwardNumber() {
		this._realMethodName = "GetForwardNumber";
		return this._InvokeMethod("QueryCTIInfo",GetApspParam("25",""));
	}
	this.SetAgentReservedStatus = function SetAgentReservedStatus(agentStatus,subBusyStatus){
		this._realMethodName = "SetAgentReservedStatus";
		return this._InvokeMethod("SetCTIInfo",GetApspParam("31",agentStatus,subBusyStatus));
	}
	this.GetAgentLogFile = function(destAgentID,urlType,uploadServer){
		this._realMethodName = "GetAgentLogFile";
		return this._InvokeMethod("SetCTIInfo",GetApspParam("32",this.GetCtrlAttribute("AgentID"),destAgentID,urlType,uploadServer));
	}

	//call command 
	this.MakeCall = function MakeCall(DestNum, serviceDirect, taskID, transParentParam, phoneID) { 
		serviceDirect = getDefaultParam(serviceDirect);
	    if (serviceDirect == "") serviceDirect = CD_PREVIEW_CALLOUT;
	    if (typeof(taskID) == "undefined") taskID = "";
	    if (typeof(transParentParam) == "undefined") 
            transParentParam = "";
	    transParentParam = this.GetBase64Data(transParentParam);
	    if (typeof(phoneID) == "undefined") phoneID = "";
	    return this._InvokeMethod("MakeCall", GetApspParam(DestNum, serviceDirect, taskID, transParentParam, phoneID));	
	}
	this.CallIn = function CallIn(DestAgentID, serviceDirect, taskID, transParentParam) { 
        serviceDirect = getDefaultParam(serviceDirect);	
        if(serviceDirect == "") serviceDirect = CD_AGENT_INSIDE_CALLOUT;
        if (typeof(taskID) == "undefined") taskID = "";
        if (typeof(transParentParam) == "undefined") transParentParam = "";
        transParentParam = this.GetBase64Data(transParentParam);
        return this._InvokeMethod("CallIn", GetApspParam(DestAgentID, serviceDirect, taskID, transParentParam));	
    }
	this.TransferOut = function TransferOut(lTransferType, DestNum) { return this._InvokeMethod("TransferOut",GetApspParam(lTransferType,DestNum)); }
	this.Hold = function Hold() { return this._InvokeMethod("Hold",""); }
	this.RetrieveHold = function RetrieveHold() { return this._InvokeMethod("RetrieveHold",""); }
	this.Disconnect = function Disconnect(callType) { return this._InvokeMethod("Disconnect",GetApspParam(callType)); }
	this.Answer = function Answer(recordFlag) { return this._InvokeMethod("Answer",GetApspParam(recordFlag)); }
	this.Consult = function Consult(lConsultType, ConsultNum) { return this._InvokeMethod("Consult",GetApspParam(lConsultType, ConsultNum)); }
	this.Transfer = function Transfer() { return this._InvokeMethod("Transfer",""); }
	this.Conference = function Conference() { return this._InvokeMethod("Conference",""); }
	this.SendDTMF = function SendDTMF(TapKey) { return this._InvokeMethod("SendDTMF",GetApspParam(TapKey)); }
	this.Bridge = function Bridge(IVRNum, bEndCall) { return this._InvokeMethod("Bridge",GetApspParam(IVRNum, bEndCall)); }
	this.Mute = function Mute(flag) { return this._InvokeMethod("Mute",GetApspParam(flag)); }
	this.ReleaseThirdOne = function ReleaseThirdOne(retrieveCall) { return this._InvokeMethod("ReleaseThirdOne",GetApspParam(retrieveCall));  }
	this.ForceReset = function ForceReset() { return this._InvokeMethod("ForceReset",""); }
	this.SendIMMessage = function SendIMMessage(destTarget0, destTarget1, destTarget2, logicOperator, msgtype, message) { return this._InvokeMethod("SendIMMessage",GetApspParam(destTarget0, destTarget1, destTarget2, logicOperator, msgtype, message)); }
	this.BeginPlay = function BeginPlay(DestAgentID, destDeviceID, nType, fileName, varparam) { return this._InvokeMethod("BeginPlay",GetApspParam(DestAgentID, destDeviceID, nType, fileName, varparam)); }
	this.StopPlay = function StopPlay(DestAgentID, DestDeviceID) { return this._InvokeMethod("StopPlay",GetApspParam(DestAgentID, DestDeviceID)); }
	this.BeginCollect = function BeginCollect(destAgentID, destDeviceID, playType, filename, min, max, end, cel, fto, ito) { return this._InvokeMethod("BeginCollect",GetApspParam(destAgentID, destDeviceID, playType, filename, min, max, end, cel, fto, ito)); }
	this.StopCollect = function StopCollect(destAgentID, destDeviceID) { return this._InvokeMethod("StopCollect",GetApspParam(destAgentID, destDeviceID));  }
    //不用的命令	
	this.BeginRecord = function BeginRecord(destAgentID, fileName) { return this._InvokeMethod("BeginRecord",GetApspParam(destAgentID, fileName)); }
	this.StopRecord = function StopRecord(destAgentID) { return this._InvokeMethod("StopRecord",GetApspParam(destAgentID)); }
	this.AlterNate = function AlterNate(destDeviceID) { return this._InvokeMethod("AlterNate",GetApspParam(destDeviceID)); }
	this.CallBack = function CallBack() { return this._InvokeMethod("CallBack",""); }
	this.ReCall = function ReCall() { return this._InvokeMethod("ReCall",""); }
	this.SMMsg = function SMMsg(DestAddress, ShortMessage) { return this._InvokeMethod("SMMsg",GetApspParam(DestAddress, ShortMessage));}
	
	//质检命令
	this.ForeReleaseCall = function ForeReleaseCall(DestAgentID, type) { return this._InvokeMethod("ForeReleaseCall",GetApspParam(DestAgentID, type)); }
	this.Insert = function Insert(DestAgentID, type, callID) { return this._InvokeMethod("Insert",GetApspParam(DestAgentID, type, callID)); }
	this.Listen = function Listen(DestAgentID, type, callID) { return this._InvokeMethod("Listen",GetApspParam(DestAgentID, type, callID)); }
	this.Intercept = function Intercept(DestAgentID, type, callID) { return this._InvokeMethod("Intercept",GetApspParam(DestAgentID, type, callID)); }
	this.Help = function Help(DestAgentID, type, callID) { return this._InvokeMethod("Help",GetApspParam(DestAgentID, type, callID)); }
	this.Lock = function Lock(DestAgentID) { return this._InvokeMethod("Lock",GetApspParam(DestAgentID)); }
	this.UnLock = function UnLock(DestAgentID) { return this._InvokeMethod("UnLock",GetApspParam(DestAgentID)); }
	this.ForceIdle = function ForceIdle(DestAgentID) { return this._InvokeMethod("ForceIdle",GetApspParam(DestAgentID)); }
	this.ForceBusy = function ForceBusy(DestAgentID) { return this._InvokeMethod("ForceBusy",GetApspParam(DestAgentID)); }
	this.ForceOut = function ForceOut(DestAgentID) { return this._InvokeMethod("ForceOut",GetApspParam(DestAgentID)); }

	//质检命令
	this.InitialState = function InitialState() { return this._InvokeMethod("InitialState",""); }
	this.AgentQuery = function AgentQuery(monitorid, curpos) { return this._InvokeMethod("AgentQuery",GetApspParam(monitorid, curpos)); }
	this.TelQuery = function TelQuery(monitorid, curpos) { return this._InvokeMethod("TelQuery",GetApspParam(monitorid, curpos)); }
	this.IvrQuery = function IvrQuery(monitorid, curpos) { return this._InvokeMethod("IvrQuery",GetApspParam(monitorid, curpos)); }
	this.ServiceQuery = function ServiceQuery(monitorid, curpos) { return this._InvokeMethod("ServiceQuery",GetApspParam(monitorid, curpos,"")); }
	this.TaskQuery = function TaskQuery(monitorid, curpos) { return this._InvokeMethod("TaskQuery",GetApspParam(monitorid, curpos)); }
	this.CallReportQuery = function CallReportQuery(monitorid, curpos) { return this._InvokeMethod("CallReportQuery",GetApspParam(monitorid, curpos)); }
	this.GetTaskSummary = function GetTaskSummary(monitorid, taskid) { return this._InvokeMethod("GetTaskSummary",GetApspParam(monitorid, taskid)); }
	this.StartNotification = function StartNotification(id, type, flag) { return this._InvokeMethod("StartNotification",GetApspParam(id, type, flag)); }
	this.EndNotification = function EndNotification(id) { return this._InvokeMethod("EndNotification",GetApspParam(id)); }
	
	//扩展命令
	this.SendWeiboMsg = function SendWeiboMsg(message) { return this._InvokeMethod("SendWeiboMsg",GetApspParam(message)); }
	this.UploadFileToMMS = function UploadFileToMMS(fileName, userId, vccPublicId) { return this._InvokeMethod("UploadFileToMMS",GetApspParam(fileName, userId, vccPublicId)); }
	this.DownFileFromMMS = function DownFileFromMMS(url, userId, vccPublicId, sessionId, msgSeq) { return this._InvokeMethod("DownFileFromMMS",GetApspParam(url, userId, vccPublicId, sessionId, msgSeq)); }
	this.SendWeChatMsg = function SendWeChatMsg(sessionId, type, userId, vccPublicId, msgtype, content, tempURL, title, data, needMmcOpenData) {
		content = GetBase64FromGBK(content);
		title = GetBase64FromGBK(title);
		data = GetBase64FromGBK(data);
		return this._InvokeMethod("SendWeChatMsg",GetApspParam(sessionId, type, userId, vccPublicId, msgtype, content, tempURL, title, data, needMmcOpenData));
	}
	this.QueryWeChatData = function QueryWeChatData(type, userId, vccPublicId, sessionId, msgSeq, count, direction) { return this._InvokeMethod("QueryWeChatData",GetApspParam(type, userId, vccPublicId, sessionId, msgSeq, count, direction)); }
	this.QueryWeChatHistory = function QueryWeChatHistory(Type, userId, vccPublicId, formTime, toTime, key, curpos) { return this._InvokeMethod("QueryWeChatHistory",GetApspParam(Type, userId, vccPublicId, formTime, toTime, key, curpos)); }
	this.GetWeChatParam = function GetWeChatParam(userId) { return this._InvokeMethod("GetWeChatParam",GetApspParam(userId));}
	///////////////////////////////////////////////////////////////////////
    //事件
    this.OnMonitorControlLoad = function(){}

    this.OnMethodResponseEvent = function(key,vReturn){ }
    //电话条    
    	
	///////////////////////////////////////////////////////////////////////
	//显示函数
	this.Destory = function(){
        if(this._contentWindow == this._window)
            this._contentWindow.document.body.removeChild(this.oMonitorShow);
        else
	        this._contentWindow.removeChild(this.oMonitorShow);
	}
	this.Display = function (flag)
	{
		if(flag == 1)
		{
			this.Refresh();
		}
		else
		{
            this.oMonitorShow.style.left = "0px";
            this.oMonitorShow.style.top =  "0px";
            this.oMonitorShow.style.width = "0px";
            this.oMonitorShow.style.height = "0px";
		}				
	}
 	this.Refresh = function ()
	{
		if( this.oSL_MonShow != null)
		{
			this.oSL_MonShow.style.left = this.left;
			this.oSL_MonShow.style.top = this.top;
			this.oSL_MonShow.style.width = this.width;
			this.oSL_MonShow.style.height = this.height;
		}
		this.Resize(this.left,this.top,this.width,this.height);
	}
	this.Resize = function (nLeft,nTop,nWidth,nHeight)
	{
		this.left	= (typeof(nLeft)=="number")?nLeft:0;
		this.top	= (typeof(nTop)=="number")?nTop:0;
		this.width	= (nWidth>=0)?nWidth:100;
		this.height	= (nHeight>=0)?nHeight:100;
		
        this.oMonitorShow.style.left = this.left+"px";
        this.oMonitorShow.style.top = this.top+"px";
        this.oMonitorShow.style.width = this.width+"px";
        this.oMonitorShow.style.height = this.height+"px";
	}
 
    return this;
}
/////////////////////////////////////////////////////////////////////
//silverlight 控件回调函数
function onSilverlightBarError(sender, args) 
{
    var appSource = "";
    if (sender != null && sender != 0) {
      appSource = sender.getHost().Source;
    }
    
    var errorType = args.ErrorType;
    var iErrorCode = args.ErrorCode;

    if (errorType == "ImageError" || errorType == "MediaError") {
      return;
    }

    var errMsg = "Unhandled Error in Silverlight Application " +  appSource + "\n" ;

    errMsg += "Code: "+ iErrorCode + "    \n";
    errMsg += "Category: " + errorType + "       \n";
    errMsg += "Message: " + args.ErrorMessage + "     \n";

    if (errorType == "ParserError") {
        errMsg += "File: " + args.xamlFile + "     \n";
        errMsg += "Line: " + args.lineNumber + "     \n";
        errMsg += "Position: " + args.charPosition + "     \n";
    }
    else if (errorType == "RuntimeError") {           
        if (args.lineNumber != 0) {
            errMsg += "Line: " + args.lineNumber + "     \n";
            errMsg += "Position: " +  args.charPosition + "     \n";
        }
        errMsg += "MethodName: " + args.methodName + "     \n";
    }

    throw new Error(errMsg);
}

function SilverlightPluginBarLoaded(){
    if(G_oSiverlightCtrl != null){
        G_oSiverlightCtrl._GetAppMainPage();
    }
}

/////////////////////////////////////////////////////////////////////
//silverlight 功能回调函数
function OnSLEventFunction(cmdIndex,param){
    if(G_oSiverlightCtrl != null){
		G_oSiverlightCtrl._invokeEventReport(cmdIndex,param);
    }	
}
function OnSLResponseFunction(cmdName,param){
    if(G_oSiverlightCtrl != null){
		G_oSiverlightCtrl._invokeResponseReport(cmdName,param);
    }	
}


