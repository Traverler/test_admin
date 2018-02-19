//  *****************************************************************************
//  FileName	:  jvccbar-app.js
//  Author      :  wsj
//  Version     :  1.0.0.0
//  Create Time :  2015-09-09
//  Description :
// 		   1) CINcc VccBar for mobile;
//         2) inline android WebBrower;
// *****************************************************************************


//*************************************************************************************************
// Global Var
//*************************************************************************************************
var  application   = null;
var  CD_IVR_CALLIN                     = 0;         //0或空：正常呼叫
var  CD_SERVRE_EXACT_CALLOUT           = 1;         //1:精确式外呼 (先呼座席、再呼用户)
var  CD_PREVIEW_CALLOUT                = 2;         //2:预览式外呼
var  CD_AGENT_OUTSIDE_CALLOUT          = 3;         //3:人工外呼 （CallOutside）
var  CD_IVR_CALLOUT                    = 4;         //4:IVR外呼 
var  CD_AGENT_INSIDE_CALLOUT           = 5;         //5:内部呼叫 （CallInside）
var  CD_CONSULT_CALLOUT                = 6;         //6:咨询 
var  CD_SINGLE_CALLOUT                 = 6;         //7:单步转移 
var  CD_BRIDGE_CALLOUT                 = 8;         //8:桥接 
var  CD_MONITOR_CALLIN                 = 9;         //9:监听 
var  CD_INTERCEPT_CALLIN               = 10;         //10:拦截 
var  CD_INSERT_CALLIN                  = 11;         //11:强插 
var  CD_STEPBYSTEP_CALLOUT             = 12;         //12:渐进式外呼  (先呼用户、再呼座席)
var  CD_FORECAST_CALLOUT               = 13;         //13:预测式外呼  (先呼用户、再呼座席)

var  CD_HELP_CALLIN                   =  19;            //19:辅助


//*************************************************************************************************
// Global Function
//*************************************************************************************************

function applicationLoad(callback){
    if(application != null)
    {
        return ;
    }
    if(typeof(callback) == "undefined"){
        callback = null;
    }
	application = new  JApplication();
	application.onLoad = callback;
	
	if(callback != null){
		setTimeout(createBar,1000); 
	}
}
function JApplication()
{
    this.oJVccBar       = new JVccBar("application.oJVccBar");

	this.IsVccBarSupport = function(){
		return (this.oJVccBar.oBarCtrl != null);
	}
	return this;
}

function createBar(){
	if(application.onLoad)
	{
    	application.onLoad();
 	}	
}

//*************************************************************************************************
// CINVccBar Object
//*************************************************************************************************
function JVccBar(sName)
{
	//########################//
	//			Attribute		  //
	//########################//	
	this.oBarCtrl		= null;
	this.appName = sName;

	//private fucntion
	this._RegisterEvents = function(){
		try{
			this.oBarCtrl= oCINcc;
		}
		catch(ex) {
		  this.showErr(ex.description);
		  return;
		}		
	  var eventKeyArr = new Array(
	                  "OnAgentStatus", "OnMethodResponseEvent", "OnBarExit", 
					  "OnCallRing", "AnswerCall", "OnCallEnd", "OnPrompt", "OnReportBtnStatus"	, 
					  "OnInitalSuccess", "OnInitalFailure", "OnAgentWorkReport", "OnCallDataChanged");
	  //register Event
	  for(var i in eventKeyArr) {
		this._regEvent(eventKeyArr[i]);
	  } 
	}
	this._regEvent = function(eventKey) {
		try {
			if(this.oBarCtrl != null)
				this.oBarCtrl.RegisterEvent(eventKey, this.appName + "." + eventKey);
		}
		catch(ex) {
		  this.showErr(ex.description);
		}
	}
	this.showErr = function(Message){
		alert(Message);
	}
	
	//--------------------------------------------------------------------------------------------------
	// public function for user
	//--------------------------------------------------------------------------------------------------
    //public Attribute
    this.SetAttribute = function(aName,aValue){
		if(this.oBarCtrl != null)
		{
			if(aName == "MediaFlag")
				aName = "VccID";
			this.oBarCtrl.SetAttribute(aName,aValue);
		}
    }
    this.GetAttribute = function(aName){
		if(this.oBarCtrl != null)
		{
			if(aName == "MediaFlag")
				aName = "VccID";
			return this.oBarCtrl.GetAttribute(aName);
		}
		return "";
    }
	
	//--------------------------------------------------------------------------------------------------
	// 外部方法,电话条对外接口
	//--------------------------------------------------------------------------------------------------
	//2.3.1	基本命令	9
	//2.3.1.1	Initial（初始化）	9
	this.Initial = function Initial()	{  return this._InvokeMethod("Initial","");}
	//2.3.1.2	SerialBtn（设置电话条按钮）	10
	this.SerialBtn = function SerialBtn(btnIDS, hiddenIDS) { return this._InvokeMethod("SerialBtn",GetApspParam(btnIDS, hiddenIDS));}
	//2.3.1.3	GetBtnStatus（得到可用电话按钮）	10
	this.GetBtnStatus = function GetBtnStatus(CallNum) { return this._InvokeQueryMethod("GetBtnStatus",GetApspParam(CallNum)); }
	//2.3.1.4	Configurate（设置电话条配置）	10
	this.Configurate = function Configurate(Params) { return this._InvokeMethod("Configurate",GetApspParam(Params)); }
	//2.3.1.5	GetConfiguration（得到电话条配置参数）	12
	this.GetConfiguration = function GetConfiguration() { return this._InvokeQueryMethod("GetConfiguration",""); }
	//2.3.1.6	UnInitial（释放电话条）	12
	this.UnInitial = function UnInitial(code) { return this._InvokeMethod("UnInitial",code); }
	//2.3.1.7	SetUIStyle（设置电话条风格）	13
	this.SetUIStyle = function SetUIStyle(barStyle) { 	}
	//2.3.1.8	GetVersion（得到电话版本）	13
	this.GetVersion = function GetVersion() { return this._InvokeQueryMethod("GetVersion","");}
	this.ExitApp = function (){return this._InvokeMethod("ExitApp","");}

	//2.3.2	基本状态	14
	//2.3.2.1	SetBusy（置忙）	14
	this.SetBusy = function SetBusy(subStatus) {  if(typeof(subStatus) == "undefined") subStatus=0; return this._InvokeMethod("SetBusy",GetApspParam(subStatus));	}
	//2.3.2.2	SetIdle（置闲）	14
	this.SetIdle = function SetIdle() { return this._InvokeMethod("SetIdle",""); }
	//2.3.2.3	SetWrapUp（置后续态）	14
	this.SetWrapUp = function SetWrapUp() { return this._InvokeMethod("SetWrapUp",""); }
	//2.3.2.4	SetCTICalloutTask（设置外呼任务）	15
	this.SetCTICalloutTask = function SetCTICalloutTask(TastNum) { return this._InvokeMethod("SetCTICalloutTask",GetApspParam(TastNum)); }
	//2.3.2.5	GetCTICalloutTask（得到外呼任务编号）	15
	this.GetCTICalloutTask = function GetCTICalloutTask() { return this._InvokeMethod("GetCTICalloutTask","");}
	//2.3.2.6	GetCallData（得到随路数据）	15
	this.GetCallData = function GetCallData(destAgentID) { return this._InvokeMethod("GetCallData",GetApspParam(destAgentID)); }
	//2.3.2.7	SetCallData（设置随路数据）	16
	this.SetCallData = function SetCallData(destAgentID, calldata) { return this._InvokeMethod("SetCallData",GetApspParam(destAgentID, calldata)); }
	//2.3.2.8	GetTransfer（得到前转信息）	16
	this.GetTransfer = function GetTransfer() { return this._InvokeMethod("GetTransfer",""); }
	//2.3.2.9	SetTransfer（设置前转信息）	17
	this.SetTransfer = function SetTransfer(forwardDeviceID, forwardState, answerType) { return this._InvokeMethod("SetTransfer",GetApspParam(forwardDeviceID, forwardState, answerType)); }
	//2.3.2.10	ChangeCallQueue（调整用户排队优先级）	17
	this.ChangeCallQueue = function ChangeCallQueue(calling, sid, orderid) { return this._InvokeMethod("ChangeCallQueue",GetApspParam(calling, sid, orderid)); }
	//2.3.2.11	GetCallID（得到CallID）	17
	this.GetCallID = function GetCallID() { return this._InvokeQueryMethod("GetCallID",""); }
	//2.3.2.12	QuerySPGroupList（得到技能组中某种状态的座席列表）	18
	this.QuerySPGroupList = function QuerySPGroupList(groupID, agentStatus, cmdType, checkAuthor,action,interval) {
		if (typeof(cmdType) == "undefined") cmdType = "9"
		if (typeof(checkAuthor) == "undefined") checkAuthor = "0"
		this._realMethodName = "QuerySPGroupList";
		return this._InvokeMethod("QueryCTIInfo",GetApspParam(cmdType, groupID, agentStatus, checkAuthor,action,interval));
	}
	//2.3.2.13	GetCallInfo（得到当前呼叫信息）	19
	this.GetCallInfo = function GetCallInfo() { return this._InvokeQueryMethod("GetCallInfo",""); }
	//2.3.2.14	SetTransparentParameter（设置透明参数）	20
	this.SetTransparentParameter = function SetTransparentParameter(transparentParam) { return this._InvokeMethod("SetTransparentParameter",GetApspParam(transparentParam)); }
	//2.3.2.15	GetAgentStatus（得到座席状态）	20
	this.GetAgentStatus = function GetAgentStatus(){	return this._InvokeQueryMethod("GetAgentStatus","");}
	//补充函数
	this.GetAgentSubBusyStatus = function GetAgentSubBusyStatus(){ return this._InvokeQueryMethod("GetAgentSubBusyStatus","");}
	//2.3.2.16	GetBusySubStatus（得到座席忙碌子状态）	20
	this.GetBusySubStatus = function GetBusySubStatus() { return this._InvokeQueryMethod("GetBusySubStatus",""); }
	//2.3.2.17	SetDisplayNumber（设置外呼显示号码）	21
	this.SetDisplayNumber = function SetDisplayNumber(dstNum) {
		this._realMethodName = "SetDisplayNumber";
		return this._InvokeMethod("SetCTIInfo",GetApspParam("8",dstNum));
	}
	//2.3.2.18	GetDisplayNumber（座席分机显示号码）	21
	this.GetDisplayNumber = function GetDisplayNumber() {
		this._realMethodName = "GetDisplayNumber";
		return this._InvokeMethod("QueryCTIInfo",GetApspParam("21",""));
	}
	//2.3.2.19	CallQueueQuery（查询排队信息）	21
	this.CallQueueQuery = function CallQueueQuery(serviceID,action,interval){
		if(typeof(action) == "undefined") action = 2;
		if(typeof(interval) == "undefined") interval = 0;
		return this._InvokeMethod("CallQueueQuery",GetApspParam(serviceID,action,interval));
	}
	//2.3.2.20	QueryGroupAgentStatus（查询指定组的座席状态）	22
	this.QueryGroupAgentStatus = function QueryGroupAgentStatus(groupIDs,action,interval,type){
		if(typeof(type) == "undefined") type = 0;
		return this._InvokeMethod("QueryCTIInfo",GetApspParam("22",groupIDs, action, interval,type));
	}
	//2.3.2.21	QueryPreViewCallOutNumbers（查询并分配预览外呼号码）	22
	this.QueryPreViewCallOutNumbers = function QueryPreViewCallOutNumbers(serviceNum, agentID, num, realloc) {
		this._realMethodName = "QueryGroupAgentStatus";
		return this._InvokeMethod("QueryCTIInfo",GetApspParam("23",serviceNum, agentID, num, realloc));
	}
	//2.3.2.22	GetBase64Data（得到base64编码）	24
	this.GetBase64Data = function GetBase64Data(data){	return GetBase64FromGBK(data);}
	//2.3.2.23	GetDataFromBase64（从Base64编码得到原始数据）	24
	this.GetDataFromBase64 = function GetDataFromBase64(data){	return GetGBKFromBase64(data);}
	//2.3.2.24	SetWeChatQueueFlag（设置座席是否参与排对）	24
	this.SetWeChatQueueFlag = function SetWeChatQueueFlag(flag) { }
	//2.3.2.25	GetWeChatQueueFlag（得到座席参与排队标示）	25
	this.GetWeChatQueueFlag = function GetWeChatQueueFlag() { }
	//2.3.2.26	TransferCallQueue（转接排队中的用户）	25
	this.TransferCallQueue = function TransferCallQueue(queuekey,lTransferType,destNum) { }
	//2.3.2.27	SetActiveService（设置当前人工服务）	15
	this.SetActiveService = function SetActiveService(ServiceNum){	}
	//2.3.2.28	GetActiveService（得到当前人工服务）	15
	this.GetActiveService = function GetActiveService(){	}
	//2.3.2.29	GetExitCause（得到座席退出原因列表）	15
	this.GetExitCause = function GetExitCause(){	}
	//2.3.2.30	SetForwardNumber（设置接续号码）	15
	this.SetForwardNumber = function SetForwardNumber(Num,State){	}
	//2.3.2.31	GetForwardNumber（得到接续号码）	15
	this.GetForwardNumber = function GetForwardNumber(){	}
	this.SetAgentReservedStatus = function SetAgentReservedStatus(agentStatus,subBusyStatus){}

	//2.3.3	呼叫命令	25
	//2.3.3.1	MakeCall（外呼）	25
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
	//2.3.3.2	CallIn（内呼）	26
	this.CallIn = function CallIn(DestAgentID, serviceDirect, taskID, transParentParam) { 
        serviceDirect = getDefaultParam(serviceDirect);	
        if(serviceDirect == "") serviceDirect = CD_AGENT_INSIDE_CALLOUT;
        if (typeof(taskID) == "undefined") taskID = "";
        if (typeof(transParentParam) == "undefined") transParentParam = "";
        transParentParam = this.GetBase64Data(transParentParam);
        return this._InvokeMethod("CallIn", GetApspParam(DestAgentID, serviceDirect, taskID, transParentParam));	
    }
	//2.3.3.3	TransferOut（转出）	27
	this.TransferOut = function TransferOut(lTransferType, DestNum) { return this._InvokeMethod("TransferOut",GetApspParam(lTransferType,DestNum)); }
	//2.3.3.4	Hold（保持）	28
	this.Hold = function Hold() { return this._InvokeMethod("Hold",""); }
	//2.3.3.5	RetrieveHold（接回）	28
	this.RetrieveHold = function RetrieveHold() { return this._InvokeMethod("RetrieveHold",""); }
	//2.3.3.6	Disconnect（挂断）	28
	this.Disconnect = function Disconnect(callType) { return this._InvokeMethod("Disconnect",GetApspParam(callType)); }
	//2.3.3.7	Answer（接通）	29
	this.Answer = function Answer(recordFlag){	
	    if(typeof(recordFlag) == "undefined") recordFlag = 0;
	    return this._InvokeMethod("Answer",GetApspParam(recordFlag));
	}
	//2.3.3.8	Consult（咨询）	29
	this.Consult = function Consult(lConsultType, ConsultNum) { return this._InvokeMethod("Consult",GetApspParam(lConsultType, ConsultNum)); }
	//2.3.3.9	Transfer（转移）	30
	this.Transfer = function Transfer() { return this._InvokeMethod("Transfer",""); }
	//2.3.3.10	Conference（会议）	30
	this.Conference = function Conference() { return this._InvokeMethod("Conference",""); }
	//2.3.3.11	SendDTMF（二次拨号）	30
	this.SendDTMF = function SendDTMF(TapKey) { return this._InvokeMethod("SendDTMF",GetApspParam(TapKey)); }
	//2.3.3.12	BeginRecord（录音）	31
	this.BeginRecord = function BeginRecord(destAgentID, fileName) { return this._InvokeMethod("BeginRecord",GetApspParam(destAgentID, fileName)); }
	//2.3.3.13	StopRecord（停录）	31
	this.StopRecord = function StopRecord(destAgentID) { return this._InvokeMethod("StopRecord",GetApspParam(destAgentID)); }
	//2.3.3.14	BeginPlay（视频推送）	31
	this.BeginPlay = function BeginPlay(DestAgentID, destDeviceID, nType, fileName, varparam) { return this._InvokeMethod("BeginPlay",GetApspParam(DestAgentID, destDeviceID, nType, fileName, varparam)); }
	//2.3.3.15	StopPlay（停止推送）	32
	this.StopPlay = function StopPlay(DestAgentID, DestDeviceID) { return this._InvokeMethod("StopPlay",GetApspParam(DestAgentID, DestDeviceID)); }
	//2.3.3.16	Bridge（桥接）	32
	this.Bridge = function Bridge(IVRNum, bEndCall) { return this._InvokeMethod("Bridge",GetApspParam(IVRNum, bEndCall)); }
	//2.3.3.17	Mute（静音）	33
	this.Mute = function Mute(flag) { return this._InvokeMethod("Mute",GetApspParam(flag)); }
	//2.3.3.18	AlterNate（切换）	33
	this.AlterNate = function AlterNate(destDeviceID) { return this._InvokeMethod("AlterNate",GetApspParam(destDeviceID)); }
	//2.3.3.19	CallBack（回拨）	33
	this.CallBack = function CallBack() { return this._InvokeMethod("CallBack",""); }
	//2.3.3.20	ReCall（重播）	34
	this.ReCall = function ReCall() { return this._InvokeMethod("ReCall",""); }
	//2.3.3.21	SMMsg（短信）	34
	this.SMMsg = function SMMsg(DestAddress, ShortMessage) { return this._InvokeMethod("SMMsg",GetApspParam(DestAddress, ShortMessage));}
	//2.3.3.22	ReleaseThirdOne（挂断第三方）	35
	this.ReleaseThirdOne = function ReleaseThirdOne(retrieveCall) { return this._InvokeMethod("ReleaseThirdOne",GetApspParam(retrieveCall));  }
	//2.3.3.23	BeginCollect（开始收号）	35
	this.BeginCollect = function BeginCollect(destAgentID, destDeviceID, playType, filename, min, max, end, cel, fto, ito) { return this._InvokeMethod("BeginCollect",GetApspParam(destAgentID, destDeviceID, playType, filename, min, max, end, cel, fto, ito)); }
	//2.3.3.24	StopCollect（结束收号）	36
	this.StopCollect = function StopCollect(destAgentID, destDeviceID) { return this._InvokeMethod("StopCollect",GetApspParam(destAgentID, destDeviceID));  }
	//2.3.3.25	ForceReset（复位）	36
	this.ForceReset = function ForceReset() { return this._InvokeMethod("ForceReset",""); }
	//2.3.3.26	SendIMMessage（发送即时消息功能）	36
	this.SendIMMessage = function SendIMMessage(destTarget0, destTarget1, destTarget2, logicOperator, msgtype, message) { return this._InvokeMethod("SendIMMessage",GetApspParam(destTarget0, destTarget1, destTarget2, logicOperator, msgtype, message)); }

	//2.3.4	质检命令	37
	//2.3.4.1	ForeReleaseCall（强拆）	37
	this.ForeReleaseCall = function ForeReleaseCall(DestAgentID, type) { return this._InvokeMethod("ForeReleaseCall",GetApspParam(DestAgentID, type)); }
	//2.3.4.2	Insert（强插）	37
	this.Insert = function Insert(DestAgentID,type,callID)	{		
	    if(typeof(type) == "undefined")  type = 0;
	    if(typeof(callID) == "undefined")  callID = "";
	    return this._InvokeMethod("Insert",GetApspParam(DestAgentID, type, callID));
	}
	//2.3.4.3	Listen（监听）	38
	this.Listen = function Listen(DestAgentID,type,callID)	{		
	    if(typeof(type) == "undefined")  type = 0;
	    if(typeof(callID) == "undefined")  callID = "";
	    return this._InvokeMethod("Listen",GetApspParam(DestAgentID, type, callID));
	}
	//2.3.4.4	Intercept（拦截）	38
	this.Intercept = function Intercept(DestAgentID,type,callID)	{		
	    if(typeof(type) == "undefined")  type = 0;
	    if(typeof(callID) == "undefined")  callID = "";
	    return this._InvokeMethod("Intercept",GetApspParam(DestAgentID, type, callID));	
	}
	//2.3.4.5	Lock（锁定）	39
	this.Lock = function Lock(DestAgentID) { return this._InvokeMethod("Lock",GetApspParam(DestAgentID)); }
	//2.3.4.6	UnLock（解锁）	39
	this.UnLock = function UnLock(DestAgentID) { return this._InvokeMethod("UnLock",GetApspParam(DestAgentID)); }
	//2.3.4.7	ForceIdle（强制置闲）	39
	this.ForceIdle = function ForceIdle(DestAgentID) { return this._InvokeMethod("ForceIdle",GetApspParam(DestAgentID)); }
	//2.3.4.8	ForceBusy（强制置忙）	40
	this.ForceBusy = function ForceBusy(DestAgentID) { return this._InvokeMethod("ForceBusy",GetApspParam(DestAgentID)); }
	//2.3.4.9	ForceOut（强制签出）	40
	this.ForceOut = function ForceOut(DestAgentID) { return this._InvokeMethod("ForceOut",GetApspParam(DestAgentID)); }
	//2.3.4.10	Help（辅助）	40
	this.Help =  function Help(DestAgentID,type,callID)  {		
	    if(typeof(type) == "undefined")  type = 0;
	    if(typeof(callID) == "undefined")  callID = "";
	    return this._InvokeMethod("Help",GetApspParam(DestAgentID, type, callID));
	}

	//2.3.5	监控命令	41
	//2.3.5.1	InitialState（查询监控信息）	41
	this.InitialState =  function InitialState()  {			}
	//2.3.5.2	AgentQuery（查询座席信息）	42
	this.AgentQuery =  function AgentQuery(monitorid,curpos)  {			}
	//2.3.5.3	TelQuery（电话信息查询）	43
	this.TelQuery =  function TelQuery(monitorid,curpos)  {			}
	//2.3.5.4	IvrQuery（IVR信息查询）	43
	this.IvrQuery =  function IvrQuery(monitorid,curpos)  {			}
	//2.3.5.5	ServiceQuery（服务器信息查询）	44
	this.ServiceQuery =  function ServiceQuery(monitorid,curpos)  {			}
	//2.3.5.6	TaskQuery（任务信息查询）	46
	this.TaskQuery =  function TaskQuery(monitorid,curpos)  {			}
	//2.3.5.7	CallReportQuery（呼叫统计信息查询）	47
	this.CallReportQuery =  function CallReportQuery(monitorid,curpos)  {			}
	//2.3.5.8	GetTaskSummary（得到具体Task概述信息）	49
	this.GetTaskSummary =  function GetTaskSummary(monitorid,taskid)  {			}
	//2.3.5.9	QueryMonitorSumInfo（查询指定参数的统计信息）	23
	this.QueryMonitorSumInfo = function QueryMonitorSumInfo(cmdName,amdParam){	}
	//2.3.5.10	StartNotification（开始监控）	50
	this.StartNotification =  function StartNotification(id,type,flag)  {			}
	//2.3.5.11	EndNotification（结束监控）	51
	this.EndNotification =  function EndNotification(id)  {			}


	//2.3.6	扩展命令	51
	//2.3.6.1	SendWeiboMsg（发送微博消息）	51
	this.SendWeiboMsg = function SendWeiboMsg(message ){	}
	//2.3.6.2	UploadFileToMMS（上传微信文件）	52
	this.UploadFileToMMS = function UploadFileToMMS(fileName,userId,vccPublicId){	}
	//2.3.6.3	DownFileFromMMS（下载微信文件）	52
	this.DownFileFromMMS = function DownFileFromMMS(url,userId,vccPublicId,sessionId,msgSeq){	}
	//2.3.6.4	SendWeChatMsg（发送微信消息）	53
	this.SendWeChatMsg = function SendWeChatMsg(sessionId,type,userId,vccPublicId,msgtype,content,tempURL,title,data,needMmcOpenData)
	{
	}
	//2.3.6.5	QueryWeChatData（查询微信信息）	54
	this.QueryWeChatData = function QueryWeChatData(type,userId,vccPublicId,sessionId,msgSeq,count,direction){	}
	//2.3.6.6	QueryWeChatHistory（查询微信历史信息）	55
	this.QueryWeChatHistory = function QueryWeChatHistory(Type,userId,vccPublicId,formTime,toTime,key,curpos){	}
	//2.3.6.7	GetWeChatParam（得到微信用户信息）	56
	this.GetWeChatParam = function GetWeChatParam(userId){	}

	//--------------------------------------------------------------------------------------------------
	// 事件重载,电话条对外事件
	//--------------------------------------------------------------------------------------------------

	//2.4.1	呼叫事件 3
	this.OnCallRing = function (CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,filename,networkInfo,queueTime,opAgentID){}
	this.AnswerCall = function (UserNo,AnswerTime,SerialID,ServiceDirect,CallID,UserParam,TaskID){}
	this.OnCallEnd = function (CallID,SerialID,ServiceDirect,UserNo,BgnTime,EndTime,AgentAlertTime,UserAlertTime,FileName,Directory,DisconnectType,UserParam,TaskID,serverName,networkInfo){}

	//2.4.2	提示事件 19
	this.OnPrompt = function (code,description){}
	this.OnReportBtnStatus = function (btnIDS){}
	this.OnInitalSuccess = function (){}
	this.OnInitalFailure = function (code,description){}
	this.OnEventPrompt = function (eventIndex,eventParam){}
	this.OnAgentWorkReport = function (workStatus,description){}
	this.OnCallDataChanged = function (callData){}
	this.OnBarExit = function (code,description){}
	this.OnCallQueueQuery = function (QueueInfo){}
	this.OnQueryGroupAgentStatus = function (QueryInfo,type){}
	this.OnSystemMessage  = function (code,description){}
	this.OnRecvWeiboMsg = function (message){}
	this.OnIMMessage = function (msgType,message){}
	this.OnRecvWeChatMessage = function (sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp){}
	this.OnSendWeChatMsgReport = function (userId,sessionId,msgseq,code,des,timeStamp){}
	this.OnUploadFileToMMSReport = function (strFileName,status,strUrl){}
	this.OnDownloadFileToMMSReport = function (strUrl,status,strFileName,msgSeq){}
	this.OnWorkStaticInfoReport = function (staticInfo){}
	this.OnQueueReport = function (ServiceReportInfo){}
	this.OnQuerySPGroupList = function(type,ctiInfo){}

	//2.4.3	监控事件  12
	this.OnAgentReport = function (AgentReportInfo){}
	this.OnTelReport = function (TelReportInfo){}
	this.OnServiceReport = function (ServiceReportInfo){}
	this.OnIvrReport = function (IvrReportInfo){}
	this.OnTaskReport = function (TaskReportInfo){}
	this.OnOutboundReport = function (TaskInfo){}
	this.OnCallReportInfo = function (CallInfo){}
	this.OnQueryMonitorSumReport = function (cmdName,reportInfo){}	
	this.OnWallServiceReport = function (serviceReportInfo){}
	this.OnWallQueueReport = function (queueInfo){}
	this.OnServiceStaticReport = function (staticInfo){}
	this.OnAgentStaticReport = function (staticInfo){}

	this.OnMethodResponseEvent = function (cmdName,param){}
    this.OnAgentStatus = function(agtStatus){};

	//--------------------------------------------------------------------------------------------------
	// 辅助函数,JS函数
	//--------------------------------------------------------------------------------------------------

	this._InvokeMethod = function  _InvokeMethod(cmdName,param){
		 if( cmdName == "")
			return -1;
		if(this.oBarCtrl != null) 
			return this.oBarCtrl.InvokeMethod(cmdName,param);
		return -1;
	}
	this._InvokeQueryMethod = function  _InvokeQueryMethod(cmdName,param){
		 if( cmdName == "")
			return "";
		if(this.oBarCtrl != null)
			return this.oBarCtrl.InvokeResultMethod(cmdName,param);
		return "";
	}

	this._RegisterEvents();
	return this;
}

//*************************************************************************************************
// 辅助函数
//*************************************************************************************************
function GetApspParam()
{	
     var  n = arguments.length;
     var  strReturn ="";
     for (var i = 0; i < arguments.length; i++) {
	    if(i==0)
		    strReturn = getDefaultParam(arguments[i]);
	    else
		    strReturn = strReturn+"|"+ getDefaultParam(arguments[i]);
     }		
    return strReturn;
 }
 function getDefaultParam(p1){
    if(typeof(p1) == "undefined")
        return "";
    return p1;
}
//--------------------------------------------------------------------------------------------------
// Base64编码
//--------------------------------------------------------------------------------------------------

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
    }
    c2 = str.charCodeAt(i++);
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    /* c1 */
    do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c1 == -1);
    if(c1 == -1)
        break;

    /* c2 */
    do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c2 == -1);
    if(c2 == -1)
        break;

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

    /* c3 */
    do {
        c3 = str.charCodeAt(i++) & 0xff;
        if(c3 == 61)
        return out;
        c3 = base64DecodeChars[c3];
    } while(i < len && c3 == -1);
    if(c3 == -1)
        break;

    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

    /* c4 */
    do {
        c4 = str.charCodeAt(i++) & 0xff;
        if(c4 == 61)
        return out;
        c4 = base64DecodeChars[c4];
    } while(i < len && c4 == -1);
    if(c4 == -1)
        break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) 
{//GbkToUtf8
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
    } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    } else {
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    }
    }
    return out;
}

function utf8to16(str) 
{//Utf8ToGbk
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
    c = str.charCodeAt(i++);
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += str.charAt(i-1);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}

function GetBase64FromGBK(data)
{//GBKToUtf8=>EnBase64
    if (typeof(data) == "undefined")
        return "";
    return base64encode(utf16to8(data));
}

function GetGBKFromBase64(data)
{//DeBase64=>Utf8ToGBK
    if (typeof(data) == "undefined")
        return "";
    return utf8to16(base64decode(data));
}
