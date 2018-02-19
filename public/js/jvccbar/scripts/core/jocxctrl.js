//  *****************************************************************************
//  文 件 名：	jocxctrl.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		   基于ocx的电话条控件
//  说    明：
//		   基于ocx的电话条控件
//  修改说明：
// *****************************************************************************
var g_oAsynTimer = null;
function AsynOnMethodResponseEvent(cmdName, param) {
    application.oJVccBar.GetBarCtrl()._invokeAsynMethodReturn(cmdName, param);
	if(g_oAsynTimer != null){
		clearTimeout(g_oAsynTimer);
		g_oAsynTimer = null;
	}
}
function AsynOnMethodResponseEvent2() {
	if(application.oJVccBar == null)
		return;
	if(application.oJVccBar.GetBarCtrl() == null)
		return;
	var oItem = application.oJVccBar.GetBarCtrl().oAsynMothmod.getHeadItem();
	if(oItem != null){
		application.oJVccBar.GetBarCtrl()._invokeAsynMethodReturn(oItem.cmdName, oItem.param);
	}
}
function BeginAsynFunctionTimer(interval)
{
	if(application.oJVccBar.GetBarCtrl()._asynMethodTimerID == null)
		application.oJVccBar.GetBarCtrl()._asynMethodTimerID = setInterval( function(){ application.oJVccBar.GetBarCtrl().PopAsynResponseEvent()} ,interval);

}
function EndAsynFunctionTimer()
{
	if(application.oJVccBar.GetBarCtrl()._asynMethodTimerID != null){
		clearInterval(application.oJVccBar.GetBarCtrl()._asynMethodTimerID);
		application.oJVccBar.GetBarCtrl()._asynMethodTimerID = null;
	}
}

function JAsynFunctionItem(sName,sParam)
{
	this.cmdName = sName;
	this.param = sParam;

	return this;
}
function JAsynFunctionManeger()
{
	this.arrFunction = new Array();
	this._timerBgn = false;
	this._timerID = null;

	this.getHeadItem = function getHeadItem(){
		if(this.arrFunction.length>0){
			return this.arrFunction[0];
		}
		return null;
	}
	this.addNewItem = function addNewItem(sName,sParam){
		this.arrFunction.push(new JAsynFunctionItem(sName,sParam));
	}
	this.removeHeadItem = function removeHeadItem(){
		if(this.arrFunction.length>0) {
			this.arrFunction.splice(0, 1);
	//		this.arrFunction.length = this.arrFunction.length - 1;
		}
	}
}

function JOcxCtrl(nLeft,nTop,nWidth,nHeight,bShow,oContentWindow)
{
	//########################//
	//			属性		  //
	//########################//	
	//公共属性
	this.left			= nLeft;
	this.top			= nTop;
	this.width			= nWidth;
	this.height			= nHeight;
	this.showFlag           = bShow;
	this._contentWindow = (oContentWindow==null)?window:oContentWindow;
	this.id = "oBar_" + Math.ceil(Math.random() * 100);
	this.name = this.id + "_Ctrl";
	this.ismsie = (application.oBrowserSys.os == "msie");
		
	// 主图相关的HTML对象
	this.oBarShow		= null;	
	this.oATL_BarShow   = null;
	
	//特殊的参数
	this._agentSubBusyStatus = -1;

	this.oEvent =  {};
	
	this.errDescription = "";		// 错误提示信息

	this.eventCallBack = null;      //事件的回调事件
	this.methodCallBack = null;     //方法的异步回调事件
	this.asynExecuteMethod = 1;//异步执行方法名
	this._asynMethodTimerID = null;
	this.oAsynMothmod = new JAsynFunctionManeger();

	//########################//
	//			方法	　    //
	//########################//
	//内部方法:
	this._createObject = function _createObject()
	{
		//this.oBarShow = this._contentWindow.document.createElement("<DIV style='cursor:move;position:absolute;border:1px solid #000000; left:"+this.left+"px;top:"+this.top+"px;'>");
		this.oBarShow = this._contentWindow.document.createElement("DIV");
        this.oBarShow.style.cursor = "move";
        this.oBarShow.style.position = "absolute";
	    this.oBarShow.style.padding = "5px";
        this.oBarShow.style.left = this.left+"px";
        this.oBarShow.style.top = this.top+"px";

		this._contentWindow.document.body.appendChild(this.oBarShow);
		
        try 
        {
		    // 创建电话条控件
		    if(this.ismsie == true)
		    {	
	            this.oBarShow.innerHTML = "<OBJECT height=\""+this.height+"\" width=\""+this.width+"\" classid=\"clsid:3E006E71-9408-4F24-9F6D-69C81BD5682F\" ></OBJECT>";
	            this.oATL_BarShow = this.oBarShow.firstChild;
	            this.oATL_BarShow.id = "oATL_BarShow_Ctrl_" + this.id;
		        this._attachOCXEvents();
		    }
		    else
		    {
		        var eventText = this._attachFOCXEvents();
		        this.oBarShow.innerHTML = "<OBJECT TYPE=\"application/x-itst-activex\" height=\""+this.height+"\" width=\""+this.width+"\" clsid=\"{3E006E71-9408-4F24-9F6D-69C81BD5682F}\" progid=\"CINVCCBAR.CINVCCBARCtrl\" "+eventText+" </OBJECT>";;
	            this.oATL_BarShow = this.oBarShow.firstChild;
	            this.oATL_BarShow.id = "oATL_BarShow_Ctrl_" + this.id;
		    }
		    this.Display(this.showFlag);
        }
        catch(e) 
        {
            alert("创建OCX电话条出错:【"+e.message+"】");
        }
	}
	this._attachFOCXEvents = function (){
	    //呼叫事件 3
	    var jsEvents = "event_OnCallRing=\"altEventOnCallRing\" ";
	    jsEvents = jsEvents + "event_AnswerCall=\"altEventOnAnswerCall\" ";
	    jsEvents = jsEvents + "event_OnCallEnd=\"altEventOnCallEnd\" ";
	    
	    //提示事件 18
	    jsEvents = jsEvents + "event_OnPrompt=\"altEventOnPrompt\" ";
	    jsEvents = jsEvents + "event_ReportBtnStatus=\"altEventOnReportBtnStatus\" ";
	    jsEvents = jsEvents + "event_OnInitalSuccess=\"altEventOnInitalSuccess\" ";
	    jsEvents = jsEvents + "event_OnInitalFailure=\"altEventOnInitalFailure\" ";
	    jsEvents = jsEvents + "event_OnEventPrompt=\"altEventOnEventPrompt\" ";
	    jsEvents = jsEvents + "event_OnAgentWorkReport=\"altEventOnAgentWorkReport\" ";
	    jsEvents = jsEvents + "event_OnCallDataChanged=\"altEventOnCallDataChanged\" ";
	    jsEvents = jsEvents + "event_OnBarExit=\"altEventOnBarExit\" ";
	    jsEvents = jsEvents + "event_OnCallQueueQuery=\"altEventOnCallQueueQuery\" ";
	    jsEvents = jsEvents + "event_OnQueryGroupAgentStatus=\"altEventOnQueryGroupAgentStatus\" ";
	    jsEvents = jsEvents + "event_OnSystemMessage=\"altEventOnSystemMessage\" ";
	    jsEvents = jsEvents + "event_OnRecvWeiboMsg=\"altEventOnRecvWeiboMsg\" ";
	    jsEvents = jsEvents + "event_OnIMMessage=\"altEventOnIMMessage\" ";
	    jsEvents = jsEvents + "event_OnRecvWeChatMessage=\"altEventOnRecvWeChatMessage\" ";
	    jsEvents = jsEvents + "event_OnSendWeChatMsgReport=\"altEventOnSendWeChatMsgReport\" ";
	    jsEvents = jsEvents + "event_OnUploadFileToMMSReport=\"altEventOnUploadFileToMMSReport\" ";
	    jsEvents = jsEvents + "event_OnDownloadFileToMMSReport=\"altEventOnDownloadFileToMMSReport\" ";
	    jsEvents = jsEvents + "event_OnServiceStaticReport=\"altEventOnServiceStaticReport\" ";

	    //监控事件 13
	    jsEvents = jsEvents + "event_OnAgentReport=\"altEventOnAgentReport\" ";
	    jsEvents = jsEvents + "event_OnTelReport=\"altEventOnTelReport\" ";
	    jsEvents = jsEvents + "event_OnServiceReport=\"altEventOnServiceReport\" ";
	    jsEvents = jsEvents + "event_OnIvrReport=\"altEventOnIvrReport\" ";
	    jsEvents = jsEvents + "event_OnTaskReport=\"altEventOnTaskReport\" ";
	    jsEvents = jsEvents + "event_OnOutboundReport=\"altEventOnOutboundReport\" ";
	    jsEvents = jsEvents + "event_OnCallReportInfo=\"altEventOnCallReportInfo\" ";
	    jsEvents = jsEvents + "event_OnQueueReport=\"altEventOnQueueReport\" ";
	    jsEvents = jsEvents + "event_OnQueryMonitorSumReport=\"altEventOnQueryMonitorSumReport\" ";
	    jsEvents = jsEvents + "event_OnWallServiceReport=\"altEventOnWallServiceReport\" ";
	    jsEvents = jsEvents + "event_OnWallQueueReport=\"altEventOnWallQueueReport\" ";
	    jsEvents = jsEvents + "event_OnWorkStaticInfoReport=\"altEventOnWorkStaticInfoReport\" ";
	    jsEvents = jsEvents + "event_OnAgentStaticReport=\"altEventOnAgentStaticReport\" ";
		jsEvents = jsEvents + "event_OnQuerySPGroupList=\"altEventOnQuerySPGroupList\" ";
		jsEvents = jsEvents + "event_OnAgentBusyReason=\"altEventOnAgentBusyReason\" ";
		jsEvents = jsEvents + "event_OnAgentLogUpload=\"altEventOnAgentLogUpload\" ";
	    return jsEvents
	}
	this._attachOCXEvents = function (){
	    //呼叫事件 3
	    this.oATL_BarShow.attachEvent("OnCallRing",altEventOnCallRing);
	    this.oATL_BarShow.attachEvent("AnswerCall",altEventOnAnswerCall);
	    this.oATL_BarShow.attachEvent("OnCallEnd",altEventOnCallEnd);
	    
	    //提示事件 18
	    this.oATL_BarShow.attachEvent("OnPrompt",altEventOnPrompt);
	    this.oATL_BarShow.attachEvent("ReportBtnStatus",altEventOnReportBtnStatus);
	    this.oATL_BarShow.attachEvent("OnInitalSuccess",altEventOnInitalSuccess);
	    this.oATL_BarShow.attachEvent("OnInitalFailure",altEventOnInitalFailure);
	    this.oATL_BarShow.attachEvent("OnEventPrompt",altEventOnEventPrompt);
	    this.oATL_BarShow.attachEvent("OnAgentWorkReport",altEventOnAgentWorkReport);
	    this.oATL_BarShow.attachEvent("OnCallDataChanged",altEventOnCallDataChanged);
	    this.oATL_BarShow.attachEvent("OnBarExit",altEventOnBarExit);
	    this.oATL_BarShow.attachEvent("OnCallQueueQuery",altEventOnCallQueueQuery);
	    this.oATL_BarShow.attachEvent("OnQueryGroupAgentStatus",altEventOnQueryGroupAgentStatus);
	    this.oATL_BarShow.attachEvent("OnSystemMessage",altEventOnSystemMessage);
	    this.oATL_BarShow.attachEvent("OnRecvWeiboMsg",altEventOnRecvWeiboMsg);
	    this.oATL_BarShow.attachEvent("OnIMMessage",altEventOnIMMessage);
	    this.oATL_BarShow.attachEvent("OnRecvWeChatMessage",altEventOnRecvWeChatMessage);
	    this.oATL_BarShow.attachEvent("OnSendWeChatMsgReport",altEventOnSendWeChatMsgReport);
	    this.oATL_BarShow.attachEvent("OnUploadFileToMMSReport",altEventOnUploadFileToMMSReport);
	    this.oATL_BarShow.attachEvent("OnDownloadFileToMMSReport",altEventOnDownloadFileToMMSReport);
	    this.oATL_BarShow.attachEvent("OnServiceStaticReport",altEventOnServiceStaticReport);
		this.oATL_BarShow.attachEvent("OnQuerySPGroupList",altEventOnQuerySPGroupList);
		this.oATL_BarShow.attachEvent("OnAgentBusyReason",altEventOnAgentBusyReason);
		this.oATL_BarShow.attachEvent("OnAgentLogUpload",altEventOnAgentLogUpload);

	    //监控事件 13
	    this.oATL_BarShow.attachEvent("OnAgentReport",altEventOnAgentReport);
	    this.oATL_BarShow.attachEvent("OnTelReport",altEventOnTelReport);
	    this.oATL_BarShow.attachEvent("OnServiceReport",altEventOnServiceReport);
	    this.oATL_BarShow.attachEvent("OnIvrReport",altEventOnIvrReport);
	    this.oATL_BarShow.attachEvent("OnTaskReport",altEventOnTaskReport);
	    this.oATL_BarShow.attachEvent("OnOutboundReport",altEventOnOutboundReport);
	    this.oATL_BarShow.attachEvent("OnCallReportInfo",altEventOnCallReportInfo);
	    this.oATL_BarShow.attachEvent("OnQueueReport",altEventOnQueueReport);
	    this.oATL_BarShow.attachEvent("OnQueryMonitorSumReport",altEventOnQueryMonitorSumReport);
	    this.oATL_BarShow.attachEvent("OnWallServiceReport",altEventOnWallServiceReport);
	    this.oATL_BarShow.attachEvent("OnWallQueueReport",altEventOnWallQueueReport);
	    this.oATL_BarShow.attachEvent("OnWorkStaticInfoReport",altEventOnWorkStaticInfoReport);
	    this.oATL_BarShow.attachEvent("OnAgentStaticReport",altEventOnAgentStaticReport);

	}

	this._invokeEvent = function(cmdIndex,param){
	    if(this.eventCallBack != null){
	        this.eventCallBack(cmdIndex,param);
	    }
	}


	//--------------------------------------------------------------------------------------------------
	// 事件重载,对外事件
	//--------------------------------------------------------------------------------------------------
	//2.4.1	提示事件 3
	this._OnCallRing = function (CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,filename,networkInfo,queueTime,opAgentID,ringTime){
		this._invokeEvent(eventOnCallRing,GetApspParam(CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,filename,networkInfo,queueTime,opAgentID,ringTime));
	}
	this._OnAnswerCall = function (UserNo,AnswerTime,SerialID,ServiceDirect,CallID,UserParam,TaskID){
		this._invokeEvent(eventOnAnswerCall,GetApspParam(UserNo,AnswerTime,SerialID,ServiceDirect,CallID,UserParam,TaskID));
	}
	this._OnCallEnd = function (CallID,SerialID,ServiceDirect,UserNo,BgnTime,EndTime,AgentAlertTime,UserAlertTime,FileName,Directory,DisconnectType,UserParam,TaskID,serverName,networkInfo){
		this._invokeEvent(eventOnCallEnd,GetApspParam(CallID,SerialID,ServiceDirect,UserNo,BgnTime,EndTime,AgentAlertTime,UserAlertTime,FileName,Directory,DisconnectType,UserParam,TaskID,serverName,networkInfo));
	}

    //2.4.2	提示事件 19
	this._OnPrompt = function (code,description){ this._invokeEvent(eventOnPrompt,GetApspParam(code,description));}
	this._OnReportBtnStatus = function (btnIDS){ this._invokeEvent(eventOnReportBtnStatus,btnIDS);}
	this._OnInitalSuccess = function (){ this._invokeEvent(eventOnInitalSuccess,GetApspParam());}
	this._OnInitalFailure = function (code,description){this._invokeEvent(eventOnInitalFailure,GetApspParam(code,description));}
	this._OnEventPrompt = function (eventIndex,eventParam){this._invokeEvent(eventOnEventPrompt,GetApspParam(eventIndex,eventParam));}
	this._OnAgentWorkReport = function (workStatus,description){this._invokeEvent(eventOnAgentWorkReport,GetApspParam(workStatus,description));}
	this._OnCallDataChanged = function (callData){this._invokeEvent(eventOnCallDataChanged,callData);}
	this._OnBarExit = function (code,description){this._invokeEvent(eventOnBarExit,GetApspParam(code,description));}
	this._OnCallQueueQuery = function (QueueInfo){this._invokeEvent(eventOnCallQueueQuery,QueueInfo);}
	this._OnQuerySPGroupList =function(type,ctiInfo){this._invokeEvent(eventOnAQueryCTIInfoReport,GetApspParam(type,ctiInfo));}
	this._OnAgentBusyReason =function(type,des){this._invokeEvent(eventOnAgentBusyReasonReport,GetApspParam(type,des));}
	this._OnAgentLogUpload = function(destAgent,urlType,uploadServer,fileName,code,des){this._invokeEvent(eventOnAgentLogUploadReport,GetApspParam(destAgent,urlType,uploadServer,fileName,code,des));}
	this._OnQueryGroupAgentStatus = function (QueryInfo,type){
		if(typeof(type) == "undefined")  type = 0;
		this._invokeEvent(eventOnQueryGroupAgentStatus,QueryInfo+"@"+type);}
	this._OnSystemMessage  = function (code,description){this._invokeEvent(eventOnSystemMessage,GetApspParam(code,description));}
	this._OnRecvWeiboMsg = function (message){this._invokeEvent(eventOnRecvWeiboMsg,message);}
	this._OnIMMessage = function (msgType,message){this._invokeEvent(eventOnIMMessage,GetApspParam(msgType,message));}
	this._OnRecvWeChatMessage = function (sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp){
	    this._invokeEvent(eventOnRecvWeChatMessage,GetApspParam(sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp));
	}
	this._OnSendWeChatMsgReport = function(sessionId,msgseq,code,des,timeStamp){
	    this._invokeEvent(eventOnSendWeChatMsgReport,GetApspParam(sessionId,msgseq,code,des,timeStamp));
	}
	this._OnUploadFileToMMSReport = function (strFileName,status,strUrl){this._invokeEvent(eventOnUploadFileToMMSReport,GetApspParam(strFileName,status,strUrl));}
	this._OnDownloadFileToMMSReport = function (strUrl,status,strFileName,msgSeq){this._invokeEvent(eventOnDownloadFileToMMSReport,GetApspParam(strUrl,status,strFileName,msgSeq));}
	this._OnWorkStaticInfoReport = function (staticInfo){this._invokeEvent(eventOnWorkStaticInfoReport,staticInfo);}
	this._OnQueueReport = function (ServiceReportInfo){this._invokeEvent(eventOnQueueReport,ServiceReportInfo);}
	
	//2.4.3	监控事件 12
	this._OnAgentReport = function (AgentReportInfo){this._invokeEvent(eventOnAgentReport,AgentReportInfo);}
	this._OnTelReport = function (TelReportInfo){this._invokeEvent(eventOnTelReport,TelReportInfo);}
	this._OnServiceReport = function (ServiceReportInfo){this._invokeEvent(eventOnServiceReport,ServiceReportInfo);}
	this._OnIvrReport = function (IvrReportInfo){this._invokeEvent(eventOnIvrReport,IvrReportInfo);}
	this._OnTaskReport = function (TaskReportInfo){this._invokeEvent(eventOnTaskReport,TaskReportInfo);}
	this._OnOutboundReport = function (TaskInfo){this._invokeEvent(eventOnOutboundReport,TaskInfo);}
	this._OnCallReportInfo = function (CallInfo){this._invokeEvent(eventOnCallReportInfo,CallInfo);}
	this._OnQueryMonitorSumReport = function (cmdName,reportInfo){this._invokeEvent(eventOnQueryMonitorSumReport,GetApspParam(cmdName,reportInfo));}	
	this._OnWallServiceReport = function (serviceReportInfo){this._invokeEvent(eventOnWallServiceReport,serviceReportInfo);}
	this._OnWallQueueReport = function (queueInfo){this._invokeEvent(eventOnWallQueueReport,queueInfo);}
	this._OnServiceStaticReport = function (staticInfo){this._invokeEvent(eventOnServiceStaticReport,staticInfo);}
	this._OnAgentStaticReport = function (staticInfo){this._invokeEvent(eventOnAgentStaticReport,staticInfo);}

	
	//--------------------------------------------------------------------------------------------------
	// 外部方法,对外接口
	//--------------------------------------------------------------------------------------------------
	//base command
	this.PopAsynResponseEvent = function(){
		var oItem = this.oAsynMothmod.getHeadItem();
		if(oItem != null){
			this._invokeAsynMethodReturn(oItem.cmdName, oItem.param);
			DisplayLog(VccBar_Log_Debug,"JOCXBar:PopAsynResponseEvent(cmdName:【"+oItem.cmdName+"】 param: 【"+oItem.param+"】)");
			this.oAsynMothmod.removeHeadItem();
		}

	}
	this._invokeAsynMethodReturn = function (cmdName, param) {
	    if (this.methodCallBack != null) {
	        this.methodCallBack(cmdName, param);
	    }
	}
	this.AsynInvokeMechod = function (cmdName, param) {
	    if (this.asynExecuteMethod == 1) {
			//g_oAsynTimer = setTimeout( function(){AsynOnMethodResponseEvent(cmdName, param);}, 100);
			BeginAsynFunctionTimer(500);
			DisplayLog(VccBar_Log_Debug,"JOCXBar:AsynInvokeMechod(cmdName:【"+cmdName+"】 param: 【"+param+"】)");
			this.oAsynMothmod.addNewItem(cmdName,param);
	        return 0;
	    }
	    return param;
	}
	this.GetBarType = function () { return vccBarTypeOCX; }
	this.Initial = function Initial() { return this.AsynInvokeMechod("Initial", this.oATL_BarShow.Initial()); }
	this.SerialBtn = function SerialBtn(btnIDS, hiddenIDS) { return this.AsynInvokeMechod("SerialBtn", this.oATL_BarShow.SerialBtn(btnIDS, hiddenIDS)); }
	this.GetBtnStatus = function GetBtnStatus(CallNum) { return this.AsynInvokeMechod("GetBtnStatus", this.oATL_BarShow.GetBtnStatus(CallNum)); }
	this.Configurate = function Configurate(Params) { return this.AsynInvokeMechod("Configurate", this.oATL_BarShow.Configurate(Params)); }
	this.GetConfiguration = function GetConfiguration() { return this.AsynInvokeMechod("GetConfiguration", this.oATL_BarShow.GetConfiguration()); }
	this.UnInitial = function UnInitial(code) { return this.AsynInvokeMechod("UnInitial", this.oATL_BarShow.UnInitial(code)); }
	this.SetUIStyle = function SetUIStyle(barStyle) { return this.AsynInvokeMechod("SetUIStyle", this.oATL_BarShow.SetUIStyle(barStyle)); }
	this.GetVersion = function GetVersion() { return this.oATL_BarShow.GetVersion();}
	
	//base status
	this.SetBusy = function SetBusy(subStatus) {
	    var lReturn = this.oATL_BarShow.SetBusy(subStatus);
	    if (lReturn == 0) {
	        this._agentSubBusyStatus = subStatus;
	    }
	    lReturn = this.AsynInvokeMechod("SetBusy", lReturn);
	    return lReturn;
	}
	this.SetIdle = function SetIdle() { return this.AsynInvokeMechod("SetIdle", this.oATL_BarShow.SetIdle()); }
	this.SetWrapUp = function SetWrapUp() { return this.AsynInvokeMechod("SetWrapUp", this.oATL_BarShow.SetWrapUp()); }
	this.SetCTICalloutTask = function SetCTICalloutTask(TastNum) { return this.AsynInvokeMechod("SetCTICalloutTask", this.oATL_BarShow.SetCTICalloutTask(TastNum)); }
	this.GetCTICalloutTask = function GetCTICalloutTask() { return this.AsynInvokeMechod("GetCTICalloutTask", this.oATL_BarShow.GetCTICalloutTask()); }
	this.GetCallData = function GetCallData(destAgentID) { return this.AsynInvokeMechod("GetCallData", this.oATL_BarShow.GetCallData(destAgentID)); }
	this.SetCallData = function SetCallData(destAgentID, calldata) { return this.AsynInvokeMechod("SetCallData", this.oATL_BarShow.SetCallData(destAgentID, calldata)); }
	this.GetTransfer = function GetTransfer() { return this.AsynInvokeMechod("GetTransfer", this.oATL_BarShow.GetTransfer()); }
	this.SetTransfer = function SetTransfer(forwardDeviceID, forwardState, answerType) { return this.AsynInvokeMechod("SetTransfer", this.oATL_BarShow.SetTransfer(forwardDeviceID, forwardState, answerType)); }
	this.ChangeCallQueue = function ChangeCallQueue(calling, sid, orderid) { return this.AsynInvokeMechod("ChangeCallQueue", this.oATL_BarShow.ChangeCallQueue(calling, sid, orderid)); }
	this.GetCallID = function GetCallID() { return this.AsynInvokeMechod("GetCallID", this.oATL_BarShow.GetCallID()); }
	this.QuerySPGroupList = function QuerySPGroupList(groupID, agentStatus, cmdType, checkAuthor,action,interval) { return this.AsynInvokeMechod("QuerySPGroupList", this.oATL_BarShow.QuerySPGroupList(groupID, agentStatus, cmdType, checkAuthor,action,interval)); }
	this.GetCallInfo = function GetCallInfo() { return this.AsynInvokeMechod("GetCallInfo", this.oATL_BarShow.GetCallInfo()); }
	this.SetTransparentParameter = function SetTransparentParameter(transparentParam) { return this.AsynInvokeMechod("SetTransparentParameter", this.oATL_BarShow.SetTransparentParameter(transparentParam)); }
	this.GetAgentStatus = function GetAgentStatus(){	return this.oATL_BarShow.GetAgentStatus();}
	this.GetAgentSubBusyStatus = function GetAgentSubBusyStatus(){	
	    if(this.oATL_BarShow.GetAgentStatus() == 1)
	        return this._agentSubBusyStatus;
	    return -1;}
	this.GetBusySubStatus = function GetBusySubStatus() { return this.oATL_BarShow.GetBusySubStatus(); }
	this.SetDisplayNumber = function SetDisplayNumber(dstNum) { return this.AsynInvokeMechod("SetDisplayNumber", this.oATL_BarShow.SetDisplayNumber(dstNum)); }
	this.GetDisplayNumber = function GetDisplayNumber() { return this.AsynInvokeMechod("GetDisplayNumber", this.oATL_BarShow.GetDisplayNumber()); }
	this.CallQueueQuery = function CallQueueQuery(serviceID,action,interval) { return this.AsynInvokeMechod("CallQueueQuery", this.oATL_BarShow.CallQueueQuery(serviceID,action,interval)); }
	this.QueryGroupAgentStatus = function QueryGroupAgentStatus(groupIDs, action, interval,type) { return this.AsynInvokeMechod("QueryGroupAgentStatus", this.oATL_BarShow.QueryGroupAgentStatus(groupIDs, action, interval,type)); }
	this.QueryPreViewCallOutNumbers = function QueryPreViewCallOutNumbers(serviceNum, agentID, num, realloc) { return this.AsynInvokeMechod("QueryPreViewCallOutNumbers", this.oATL_BarShow.QueryPreViewCallOutNumbers(serviceNum, agentID, num, realloc)); }
	this.QueryMonitorSumInfo = function QueryMonitorSumInfo(cmdName, amdParam) { return this.AsynInvokeMechod("QueryMonitorSumInfo", this.oATL_BarShow.QueryMonitorSumInfo(cmdName, amdParam)); }
	this.GetBase64Data = function GetBase64Data(data){	return this.oATL_BarShow.GetBase64Data(data);}
	this.GetDataFromBase64 = function GetDataFromBase64(data){	return this.oATL_BarShow.GetDataFromBase64(data);}
	this.SetWeChatQueueFlag = function SetWeChatQueueFlag(flag) { return this.AsynInvokeMechod("SetWeChatQueueFlag", this.oATL_BarShow.SetWeChatQueueFlag(flag)); }
	this.GetWeChatQueueFlag = function GetWeChatQueueFlag() { return this.AsynInvokeMechod("GetWeChatQueueFlag", this.oATL_BarShow.GetWeChatQueueFlag()); }
	this.TransferCallQueue = function TransferCallQueue(queuekey, lTransferType, destNum) { return this.AsynInvokeMechod("TransferCallQueue", this.oATL_BarShow.TransferCallQueue(queuekey, lTransferType, destNum)); }
	this.SetActiveService = function SetActiveService(ServiceNum) { return this.AsynInvokeMechod("SetActiveService", this.oATL_BarShow.SetActiveService(ServiceNum)); }
	this.GetActiveService = function GetActiveService() { return this.AsynInvokeMechod("GetActiveService", this.oATL_BarShow.GetActiveService()); }
	this.GetExitCause = function GetExitCause() { return this.oATL_BarShow.GetExitCause(); }
	this.SetForwardNumber = function SetForwardNumber(Num,State) { return this.AsynInvokeMechod("SetForwardNumber", this.oATL_BarShow.SetForwardNumber(Num,State)); }
	this.GetForwardNumber = function GetForwardNumber() { return this.AsynInvokeMechod("GetForwardNumber", this.oATL_BarShow.GetForwardNumber()); }
	this.SetAgentReservedStatus = function SetAgentReservedStatus(agentStatus,subBusyStatus) { return this.AsynInvokeMechod("SetAgentReservedStatus", this.oATL_BarShow.SetAgentReservedStatus(agentStatus,subBusyStatus)); }
	this.GetAgentLogFile = function(destAgentID,urlType,uploadServer){
		return this.AsynInvokeMechod("GetAgentLogFile", this.oATL_BarShow.GetAgentLogFile(destAgentID,urlType,uploadServer));
	}

	//call command 
	this.MakeCall = function MakeCall(DestNum, serviceDirect, taskID, transParentParam, phoneID) { return this.AsynInvokeMechod("MakeCall", this.oATL_BarShow.MakeCall(DestNum, serviceDirect, taskID, transParentParam, phoneID)); }
	this.CallIn = function CallIn(DestAgentID, serviceDirect, taskID, transParentParam) { return this.AsynInvokeMechod("CallIn", this.oATL_BarShow.CallIn(DestAgentID, serviceDirect, taskID, transParentParam)); }
	this.TransferOut = function TransferOut(lTransferType, DestNum) { return this.AsynInvokeMechod("TransferOut", this.oATL_BarShow.TransferOut(lTransferType, DestNum)); }
	this.Hold = function Hold() { return this.AsynInvokeMechod("Hold", this.oATL_BarShow.Hold()); }
	this.RetrieveHold = function RetrieveHold() { return this.AsynInvokeMechod("RetrieveHold", this.oATL_BarShow.RetrieveHold()); }
	this.Disconnect = function Disconnect(callType) { return this.AsynInvokeMechod("Disconnect", this.oATL_BarShow.Disconnect(callType)); }
	this.Answer = function Answer(recordFlag) { return this.AsynInvokeMechod("Answer", this.oATL_BarShow.Answer(recordFlag)); }
	this.Consult = function Consult(lConsultType, ConsultNum) { return this.AsynInvokeMechod("Consult", this.oATL_BarShow.Consult(lConsultType, ConsultNum)); }
	this.Transfer = function Transfer() { return this.AsynInvokeMechod("Transfer", this.oATL_BarShow.Transfer()); }
	this.Conference = function Conference() { return this.AsynInvokeMechod("Conference", this.oATL_BarShow.Conference()); }
	this.SendDTMF = function SendDTMF(TapKey) { return this.AsynInvokeMechod("SendDTMF", this.oATL_BarShow.SendDTMF(TapKey)); }
	this.Bridge = function Bridge(IVRNum, bEndCall) { return this.AsynInvokeMechod("Bridge", this.oATL_BarShow.Bridge(IVRNum, bEndCall)); }
	this.Mute = function Mute(flag) { return this.AsynInvokeMechod("Mute", this.oATL_BarShow.Mute(flag)); }
	this.ReleaseThirdOne = function ReleaseThirdOne(retrieveCall) { return this.AsynInvokeMechod("ReleaseThirdOne", this.oATL_BarShow.ReleaseThirdOne(retrieveCall)); }
	this.ForceReset = function ForceReset() { return this.AsynInvokeMechod("ForceReset", this.oATL_BarShow.ForceReset()); }
	this.SendIMMessage = function SendIMMessage(destTarget0, destTarget1, destTarget2, logicOperator, msgtype, message) { return this.AsynInvokeMechod("SendIMMessage", this.oATL_BarShow.SendIMMessage(destTarget0, destTarget1, destTarget2, logicOperator, msgtype, message)); }
	this.BeginPlay = function BeginPlay(DestAgentID, destDeviceID, nType, fileName, varparam) { return this.AsynInvokeMechod("BeginPlay", this.oATL_BarShow.BeginPlay(DestAgentID, destDeviceID, nType, fileName, varparam)); }
	this.StopPlay = function StopPlay(DestAgentID, DestDeviceID) { return this.AsynInvokeMechod("StopPlay", this.oATL_BarShow.StopPlay(DestAgentID, DestDeviceID)); }
	this.BeginCollect = function BeginCollect(destAgentID, destDeviceID, playType, filename, min, max, end, cel, fto, ito) { return this.AsynInvokeMechod("BeginCollect", this.oATL_BarShow.BeginCollect(destAgentID, destDeviceID, playType, filename, min, max, end, cel, fto, ito)); }
	this.StopCollect = function StopCollect(destAgentID, destDeviceID) { return this.AsynInvokeMechod("StopCollect", this.oATL_BarShow.StopCollect(destAgentID, destDeviceID)); }
    //不用的命令	
	this.BeginRecord = function BeginRecord(destAgentID, fileName) { return this.AsynInvokeMechod("BeginRecord", this.oATL_BarShow.BeginRecord(destAgentID, fileName)); }
	this.StopRecord = function StopRecord(destAgentID) { return this.AsynInvokeMechod("StopRecord", this.oATL_BarShow.StopRecord(destAgentID)); }
	this.AlterNate = function AlterNate(destDeviceID) { return this.AsynInvokeMechod("AlterNate", this.oATL_BarShow.AlterNate(destDeviceID)); }
	this.CallBack = function CallBack() { return this.AsynInvokeMechod("CallBack", this.oATL_BarShow.CallBack()); }
	this.ReCall = function ReCall() { return this.AsynInvokeMechod("ReCall", this.oATL_BarShow.ReCall()); }
	this.SMMsg = function SMMsg(DestAddress, ShortMessage) { return this.AsynInvokeMechod("SMMsg", this.oATL_BarShow.SMMsg(DestAddress, ShortMessage)); }
	
	//质检命令
	this.ForeReleaseCall = function ForeReleaseCall(DestAgentID, type) { return this.AsynInvokeMechod("ForeReleaseCall", this.oATL_BarShow.ForeReleaseCall(DestAgentID, type)); }
	this.Insert = function Insert(DestAgentID, type, callID) { return this.AsynInvokeMechod("Insert", this.oATL_BarShow.Insert(DestAgentID, type, callID)); }
	this.Listen = function Listen(DestAgentID, type, callID) { return this.AsynInvokeMechod("Listen", this.oATL_BarShow.Listen(DestAgentID, type, callID)); }
	this.Intercept = function Intercept(DestAgentID, type, callID) { return this.AsynInvokeMechod("Intercept", this.oATL_BarShow.Intercept(DestAgentID, type, callID)); }
	this.Help = function Help(DestAgentID, type, callID) { return this.AsynInvokeMechod("Help", this.oATL_BarShow.Help(DestAgentID, type, callID)); }
	this.Lock = function Lock(DestAgentID) { return this.AsynInvokeMechod("Lock", this.oATL_BarShow.Lock(DestAgentID)); }
	this.UnLock = function UnLock(DestAgentID) { return this.AsynInvokeMechod("UnLock", this.oATL_BarShow.UnLock(DestAgentID)); }
	this.ForceIdle = function ForceIdle(DestAgentID) { return this.AsynInvokeMechod("ForceIdle", this.oATL_BarShow.ForceIdle(DestAgentID)); }
	this.ForceBusy = function ForceBusy(DestAgentID) { return this.AsynInvokeMechod("ForceBusy", this.oATL_BarShow.ForceBusy(DestAgentID)); }
	this.ForceOut = function ForceOut(DestAgentID) { return this.AsynInvokeMechod("ForceOut", this.oATL_BarShow.ForceOut(DestAgentID)); }

	//质检命令
	this.InitialState = function InitialState() { return this.AsynInvokeMechod("InitialState", this.oATL_BarShow.InitialState()); }
	this.AgentQuery = function AgentQuery(monitorid, curpos) { return this.AsynInvokeMechod("AgentQuery", this.oATL_BarShow.AgentQuery(monitorid, curpos)); }
	this.TelQuery = function TelQuery(monitorid, curpos) { return this.AsynInvokeMechod("TelQuery", this.oATL_BarShow.TelQuery(monitorid, curpos)); }
	this.IvrQuery = function IvrQuery(monitorid, curpos) { return this.AsynInvokeMechod("IvrQuery", this.oATL_BarShow.IvrQuery(monitorid, curpos)); }
	this.ServiceQuery = function ServiceQuery(monitorid, curpos) { return this.AsynInvokeMechod("ServiceQuery", this.oATL_BarShow.ServiceQuery(monitorid, curpos)); }
	this.TaskQuery = function TaskQuery(monitorid, curpos) { return this.AsynInvokeMechod("TaskQuery", this.oATL_BarShow.TaskQuery(monitorid, curpos)); }
	this.CallReportQuery = function CallReportQuery(monitorid, curpos) { return this.AsynInvokeMechod("CallReportQuery", this.oATL_BarShow.CallReportQuery(monitorid, curpos)); }
	this.GetTaskSummary = function GetTaskSummary(monitorid, taskid) { return this.AsynInvokeMechod("GetTaskSummary", this.oATL_BarShow.GetTaskSummary(monitorid, taskid)); }
	this.StartNotification = function StartNotification(id, type, flag) { return this.AsynInvokeMechod("StartNotification", this.oATL_BarShow.StartNotification(id, type, flag)); }
	this.EndNotification = function EndNotification(id) { return this.AsynInvokeMechod("EndNotification", this.oATL_BarShow.EndNotification(id)); }
	
	//扩展命令
	this.SendWeiboMsg = function SendWeiboMsg(message) { return this.AsynInvokeMechod("SendWeiboMsg", this.oATL_BarShow.SendWeiboMsg(message)); }
	this.UploadFileToMMS = function UploadFileToMMS(fileName, userId, vccPublicId) { return this.AsynInvokeMechod("UploadFileToMMS", this.oATL_BarShow.UploadFileToMMS(fileName, userId, vccPublicId)); }
	this.DownFileFromMMS = function DownFileFromMMS(url, userId, vccPublicId, sessionId, msgSeq) { return this.AsynInvokeMechod("DownFileFromMMS", this.oATL_BarShow.DownFileFromMMS(url, userId, vccPublicId, sessionId, msgSeq)); }
	this.SendWeChatMsg = function SendWeChatMsg(sessionId, type, userId, vccPublicId, msgtype, content, tempURL, title, data, needMmcOpenData) { return this.AsynInvokeMechod("SendWeChatMsg", this.oATL_BarShow.SendWeChatMsg(sessionId, type, userId, vccPublicId, msgtype, content, tempURL, title, data, needMmcOpenData)); }
	this.QueryWeChatData = function QueryWeChatData(type, userId, vccPublicId, sessionId, msgSeq, count, direction) { return this.AsynInvokeMechod("QueryWeChatData", this.oATL_BarShow.QueryWeChatData(type, userId, vccPublicId, sessionId, msgSeq, count, direction)); }
	this.QueryWeChatHistory = function QueryWeChatHistory(Type, userId, vccPublicId, formTime, toTime, key, curpos) { return this.AsynInvokeMechod("QueryWeChatHistory", this.oATL_BarShow.QueryWeChatHistory(Type, userId, vccPublicId, formTime, toTime, key, curpos)); }
	this.GetWeChatParam = function GetWeChatParam(userId) { return this.AsynInvokeMechod("GetWeChatParam", this.oATL_BarShow.GetWeChatParam(userId)); }

    this.SetCtrlAttribute = function(aName,aValue){
        //cti
        if(aName == "MainIP"){
            this.oATL_BarShow.MainIP = aValue;}
        else if(aName == "BackIP"){
            this.oATL_BarShow.BackIP = aValue;}
        else if(aName == "MainPortID"){
            this.oATL_BarShow.MainPortID = aValue;}
        else if(aName == "BackPortID"){
            this.oATL_BarShow.BackPortID = aValue;}
        else if(aName == "AgentID"){
            this.oATL_BarShow.AgentID = aValue;}
        else if(aName == "Dn"){
            this.oATL_BarShow.Dn = aValue;}
        else if(aName == "PassWord"){
            this.oATL_BarShow.PassWord = aValue;}
        else if(aName == "MediaFlag"){//MediaFlag
            this.oATL_BarShow.MediaFlag = aValue;}
        else if(aName == "PhonType"){
            this.oATL_BarShow.PhonType = aValue;}
        else if(aName == "AppType"){
            this.oATL_BarShow.AppType = aValue;}
        //sip
        else if(aName == "SipServerIP"){
            this.oATL_BarShow.SipServerIP = aValue;}
        else if(aName == "SipServerPort"){
            this.oATL_BarShow.SipServerPort = aValue;}
        else if(aName == "SipProtocol"){
            this.oATL_BarShow.SipProtocol = aValue;}
        else if(aName == "SipDn"){
            this.oATL_BarShow.SipDn = aValue;}
        else if(aName == "SipAuthType"){
            this.oATL_BarShow.SipAuthType = aValue;}
        else if(aName == "SipDomain"){
            this.oATL_BarShow.SipDomain = aValue;}
        else if(aName == "SipPassWord"){
            this.oATL_BarShow.SipPassWord = aValue;}
        else if(aName == "SipBackServerIP"){
            this.oATL_BarShow.SipBackServerIP = aValue;}
        else if(aName == "SipBackServerPort"){
            this.oATL_BarShow.SipBackServerPort = aValue;}
        else if(aName == "SipBackProtocol"){
            this.oATL_BarShow.SipBackProtocol = aValue;}
        else if(aName == "SipBackAuthType"){
            this.oATL_BarShow.SipBackAuthType = aValue;}
        else if(aName == "SipBackDomain"){
            this.oATL_BarShow.SipBackDomain = aValue;}
        else if(aName == "SipBackPassWord"){
            this.oATL_BarShow.SipBackPassWord = aValue;}
        //monitor
        else if(aName == "MonitorIP"){
            this.oATL_BarShow.MonitorIP = aValue;}
        else if(aName == "MonitorPort"){
            this.oATL_BarShow.MonitorPort = aValue;}
        //setting
        else if(aName == "WeChatServer"){
            this.oATL_BarShow.WeChatServer = aValue;}
        else if(aName == "SelfPrompt"){
            this.oATL_BarShow.SelfPrompt = aValue;}
        else if(aName == "MinotorVersion"){
            this.oATL_BarShow.MinotorVersion = aValue;}
        else if(aName == "TaskID"){
            this.oATL_BarShow.TaskID = aValue;}
        else if(aName == "AutoUpdateURL"){
            this.oATL_BarShow.AutoUpdateURL = aValue;}
        else if(aName == "SipPassWdCryptType"){
            this.oATL_BarShow.SipPassWdCryptType = aValue;}
		else if(aName == "PassWdCryptType"){
			this.oATL_BarShow.PassWdCryptType = aValue;}
        else if(aName == "AutoSelectAgent"){
            this.oATL_BarShow.AutoSelectAgent = aValue;}
		else if(aName == "VersionType"){
			this.oATL_BarShow.VersionType = aValue;}
        //no use
        else if(aName == "IsAllTimeRecord"){
            this.oATL_BarShow.IsAllTimeRecord = aValue;}
        else if(aName == "RecordType"){
            this.oATL_BarShow.RecordType = aValue;}
        else if(aName == "AgentName"){
            this.oATL_BarShow.AgentName = aValue;}
        else if(aName == "msgFlag"){
            this.oATL_BarShow.msgFlag = aValue;}
        else if(aName == "AgentType"){
            this.oATL_BarShow.AgentType = aValue;}
        else if(aName == "LocalPort"){
            this.oATL_BarShow.LocalPort = aValue;}
        else if(aName == "ServiceLists"){
            this.oATL_BarShow.ServiceLists = aValue;}
        else if(aName == "TimeOut"){
            this.oATL_BarShow.TimeOut = aValue;}
        else if(aName == "ftpServerIP"){
            this.oATL_BarShow.ftpServerIP = aValue;}
        else if(aName == "ftpServerPort"){
            this.oATL_BarShow.ftpServerPort = aValue;}
        else if(aName == "ftpUser"){
            this.oATL_BarShow.ftpUser = aValue;}
        else if(aName == "ftpPassWord"){
            this.oATL_BarShow.ftpPassWord = aValue;}
        else if(aName == "ftpDirectory"){
            this.oATL_BarShow.ftpDirectory = aValue;}
		else if(aName == "forceEndProcess"){
			}
		else{
            alert("bad attribute name:"+aName);}
    }
    this.GetCtrlAttribute = function(aName){
        //cti
        if(aName == "MainIP"){
            return this.oATL_BarShow.MainIP  ;}
        else if(aName == "BackIP"){
            return this.oATL_BarShow.BackIP  ;}
        else if(aName == "MainPortID"){
            return this.oATL_BarShow.MainPortID  ;}
        else if(aName == "BackPortID"){
            return this.oATL_BarShow.BackPortID  ;}
        else if(aName == "AgentID"){
            return this.oATL_BarShow.AgentID  ;}
        else if(aName == "Dn"){
            return this.oATL_BarShow.Dn  ;}
        else if(aName == "PassWord"){
            return this.oATL_BarShow.PassWord  ;}
        else if(aName == "MediaFlag"){//MediaFlag
            return this.oATL_BarShow.MediaFlag  ;}
        else if(aName == "PhonType"){
            return this.oATL_BarShow.PhonType  ;}
        else if(aName == "AppType"){
            return this.oATL_BarShow.AppType  ;}
        //sip
        else if(aName == "SipServerIP"){
            return this.oATL_BarShow.SipServerIP  ;}
        else if(aName == "SipServerPort"){
            return this.oATL_BarShow.SipServerPort  ;}
        else if(aName == "SipProtocol"){
            return this.oATL_BarShow.SipProtocol  ;}
        else if(aName == "SipDn"){
            return this.oATL_BarShow.SipDn  ;}
        else if(aName == "SipAuthType"){
            return this.oATL_BarShow.SipAuthType  ;}
        else if(aName == "SipDomain"){
            return this.oATL_BarShow.SipDomain  ;}
        else if(aName == "SipPassWord"){
            return this.oATL_BarShow.SipPassWord  ;}
        else if(aName == "SipBackServerIP"){
            return this.oATL_BarShow.SipBackServerIP  ;}
        else if(aName == "SipBackServerPort"){
            return this.oATL_BarShow.SipBackServerPort  ;}
        else if(aName == "SipBackProtocol"){
            return this.oATL_BarShow.SipBackProtocol  ;}
        else if(aName == "SipBackAuthType"){
            return this.oATL_BarShow.SipBackAuthType  ;}
        else if(aName == "SipBackDomain"){
            return this.oATL_BarShow.SipBackDomain  ;}
        else if(aName == "SipBackPassWord"){
            return this.oATL_BarShow.SipBackPassWord  ;}
        //monitor
        else if(aName == "MonitorIP"){
            return this.oATL_BarShow.MonitorIP  ;}
        else if(aName == "MonitorPort"){
            return this.oATL_BarShow.MonitorPort  ;}
        //setting
        else if(aName == "WeChatServer"){
            return this.oATL_BarShow.WeChatServer  ;}
        else if(aName == "SelfPrompt"){
            return this.oATL_BarShow.SelfPrompt  ;}
        else if(aName == "MinotorVersion"){
            return this.oATL_BarShow.MinotorVersion  ;}
        else if(aName == "TaskID"){
            return this.oATL_BarShow.TaskID  ;}
        else if(aName == "AutoUpdateURL"){
            return this.oATL_BarShow.AutoUpdateURL  ;}
        else if(aName == "PassWdCryptType"){
            return this.oATL_BarShow.SipPassWdCryptType  ;}
		else if(aName == "SipPassWdCryptType"){
			return this.oATL_BarShow.PassWdCryptType  ;}
        else if(aName == "AutoSelectAgent"){
            return this.oATL_BarShow.AutoSelectAgent  ;}
		else if(aName == "VersionType"){
			return this.oATL_BarShow.VersionType  ;}
        //no use
        else if(aName == "IsAllTimeRecord"){
            return this.oATL_BarShow.IsAllTimeRecord  ;}
        else if(aName == "RecordType"){
            return this.oATL_BarShow.RecordType  ;}
        else if(aName == "AgentName"){
            return this.oATL_BarShow.AgentName  ;}
        else if(aName == "msgFlag"){
            return this.oATL_BarShow.msgFlag  ;}
        else if(aName == "AgentType"){
            return this.oATL_BarShow.AgentType  ;}
        else if(aName == "LocalPort"){
            return this.oATL_BarShow.LocalPort  ;}
        else if(aName == "ServiceLists"){
            return this.oATL_BarShow.ServiceLists  ;}
        else if(aName == "TimeOut"){
            return this.oATL_BarShow.TimeOut  ;}
        else if(aName == "ftpServerIP"){
            return this.oATL_BarShow.ftpServerIP  ;}
        else if(aName == "ftpServerPort"){
            return this.oATL_BarShow.ftpServerPort  ;}
        else if(aName == "ftpUser"){
            return this.oATL_BarShow.ftpUser  ;}
        else if(aName == "ftpPassWord"){
            return this.oATL_BarShow.ftpPassWord  ;}
        else if(aName == "ftpDirectory"){
            return this.oATL_BarShow.ftpDirectory  ;}
		else if(aName == "forceEndProcess"){
			return "";}
		else{
            alert("bad attribute name:"+aName);
            return "";
        }
    }



	this.GetBarCtrl = function (){ return this;}
	this.GetOCXCtrl = function (){ return this.oATL_BarShow;}
    //this.isSurpportWebSocket = function (){ return false;} 

	this.Display = function Display(flag){
		if(flag == 1)
		{
			this.oBarShow.style.display = "";
		}
		else
		{
			this.oBarShow.style.display = "none";
		}				
	}
	this.attachEventfun = function attachEventfun(callbackFun){ this.eventCallBack = callbackFun;}
	this.attachResponsefun = function attachResponsefun(callbackFun) { this.methodCallBack = callbackFun; }
	this.SetAsysMode = function SetAsysMode(flag) {
		this.asynExecuteMethod = flag;
		if(this.asynExecuteMethod == 1){
			BeginAsynFunctionTimer(500);
		}
		else{
			EndAsynFunctionTimer();
		}
	}
	this.GetAsysMode = function GetAsysMode() {
		return this.asynExecuteMethod; }

	
	//--------------------------------------------------------------------------------------------------
	// 调整显示区域的大小
	//--------------------------------------------------------------------------------------------------
	this.show = function show()
	{
		if( this.oATL_BarShow )
		{
			this.oATL_BarShow.style.left = this.left;
			this.oATL_BarShow.style.top = this.top;
			this.oATL_BarShow.style.width = this.width;
			this.oATL_BarShow.style.height = this.height;
		}
		this.resize(this.left,this.top,this.width,this.height);
	}
	this.resize=function resize(nLeft,nTop,nWidth,nHeight)
	{
		this.left	= (typeof(nLeft)=="number")?nLeft:0;
		this.top	= (typeof(nTop)=="number")?nTop:0;
		this.width	= (nWidth>0)?nWidth:100;
		this.height	= (nHeight>0)?nHeight:100;
		with(this.oBarShow.style)
		{
			pixelWidth		= this.width;
			pixelHeight		= this.height;
			pixelLeft		= this.left;
			pixelTop		= this.top;
		}
		this.oATL_BarShow.style.width = this.width;
		this.oATL_BarShow.style.height = this.height;
	}

	this._createObject();
	
	return this;
}

//--------------------------------------------------------------------------------------------------
// 特殊处理非IE浏览器的响应问题
//--------------------------------------------------------------------------------------------------

function altEventOnCallRing (CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,filename,networkInfo,queueTime,opAgentID,ringTime){
	application.oJVccBar.GetBarCtrl()._OnCallRing(CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,filename,networkInfo,queueTime,opAgentID,ringTime);
}
function altEventOnAnswerCall (UserNo,AnswerTime,SerialID,ServiceDirect,CallID,UserParam,TaskID){
	application.oJVccBar.GetBarCtrl()._OnAnswerCall(UserNo,AnswerTime,SerialID,ServiceDirect,CallID,UserParam,TaskID);
}
function altEventOnCallEnd (CallID,SerialID,ServiceDirect,UserNo,BgnTime,EndTime,AgentAlertTime,UserAlertTime,FileName,Directory,DisconnectType,UserParam,TaskID,serverName,networkInfo){
	application.oJVccBar.GetBarCtrl()._OnCallEnd(CallID,SerialID,ServiceDirect,UserNo,BgnTime,EndTime,AgentAlertTime,UserAlertTime,FileName,Directory,DisconnectType,UserParam,TaskID,serverName,networkInfo);
}

//2.4.2	提示事件 18
function altEventOnPrompt (code,description){ application.oJVccBar.GetBarCtrl()._OnPrompt(code,description);}
function altEventOnReportBtnStatus (btnIDS){ application.oJVccBar.GetBarCtrl()._OnReportBtnStatus(btnIDS);}
function altEventOnInitalSuccess(){application.oJVccBar.GetBarCtrl()._OnInitalSuccess();}
function altEventOnInitalFailure (code,description){application.oJVccBar.GetBarCtrl()._OnInitalFailure(code,description);}
function altEventOnEventPrompt (eventIndex,eventParam){application.oJVccBar.GetBarCtrl()._OnEventPrompt(eventIndex,eventParam);}
function altEventOnAgentWorkReport (workStatus,description){application.oJVccBar.GetBarCtrl()._OnAgentWorkReport(workStatus,description);}
function altEventOnCallDataChanged (callData){application.oJVccBar.GetBarCtrl()._OnCallDataChanged(callData);}
function altEventOnBarExit (code,description){application.oJVccBar.GetBarCtrl()._OnBarExit(code,description);}
function altEventOnCallQueueQuery (QueueInfo){application.oJVccBar.GetBarCtrl()._OnCallQueueQuery(QueueInfo);}
function altEventOnQueryGroupAgentStatus (QueryInfo,type){application.oJVccBar.GetBarCtrl()._OnQueryGroupAgentStatus(QueryInfo,type);}
function altEventOnSystemMessage  (code,description){application.oJVccBar.GetBarCtrl()._OnSystemMessage(code,description);}
function altEventOnRecvWeiboMsg (message){application.oJVccBar.GetBarCtrl()._invokeEvent(eventOnRecvWeiboMsg,message);}
function altEventOnIMMessage (msgType,message){application.oJVccBar.GetBarCtrl()._OnRecvWeiboMsg(msgType,message);}
function altEventOnRecvWeChatMessage (sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp){
    application.oJVccBar.GetBarCtrl()._OnRecvWeChatMessage(sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp);
}
function altEventOnSendWeChatMsgReport(sessionId,msgseq,code,des,timeStamp){application.oJVccBar.GetBarCtrl()._OnSendWeChatMsgReport(sessionId,msgseq,code,des,timeStamp);}
function altEventOnUploadFileToMMSReport (strFileName,status,strUrl){application.oJVccBar.GetBarCtrl()._OnUploadFileToMMSReport(strFileName,status,strUrl);}
function altEventOnDownloadFileToMMSReport (strUrl,status,strFileName,msgSeq){application.oJVccBar.GetBarCtrl()._OnDownloadFileToMMSReport(strUrl,status,strFileName,msgSeq);}
function altEventOnWorkStaticInfoReport (staticInfo){application.oJVccBar.GetBarCtrl()._OnWorkStaticInfoReport(staticInfo);}
function altEventOnQuerySPGroupList (type,ctiInfo){application.oJVccBar.GetBarCtrl()._OnQuerySPGroupList(type,ctiInfo);}
function altEventOnAgentBusyReason (type,des){application.oJVccBar.GetBarCtrl()._OnAgentBusyReason(type,des);}
function altEventOnAgentLogUpload (destAgent,urlType,uploadServer,fileName,code,des){application.oJVccBar.GetBarCtrl()._OnAgentLogUpload(destAgent,urlType,uploadServer,fileName,code,des);}
//2.4.3	监控事件 13
function altEventOnAgentReport (AgentReportInfo){application.oJVccBar.GetBarCtrl()._OnAgentReport(AgentReportInfo);}
function altEventOnTelReport (TelReportInfo){application.oJVccBar.GetBarCtrl()._OnTelReport(TelReportInfo);}
function altEventOnServiceReport (ServiceReportInfo){application.oJVccBar.GetBarCtrl()._OnServiceReport(ServiceReportInfo);}
function altEventOnIvrReport (IvrReportInfo){application.oJVccBar.GetBarCtrl()._OnIvrReport(IvrReportInfo);}
function altEventOnTaskReport (TaskReportInfo){application.oJVccBar.GetBarCtrl()._OnTaskReport(TaskReportInfo);}
function altEventOnOutboundReport (TaskInfo){application.oJVccBar.GetBarCtrl()._OnOutboundReport(TaskInfo);}
function altEventOnCallReportInfo (CallInfo){application.oJVccBar.GetBarCtrl()._OnCallReportInfo(CallInfo);}
function altEventOnQueueReport (ServiceReportInfo){application.oJVccBar.GetBarCtrl()._OnQueueReport(ServiceReportInfo);}
function altEventOnQueryMonitorSumReport (cmdName,reportInfo){application.oJVccBar.GetBarCtrl()._OnQueryMonitorSumReport(cmdName,reportInfo);}	
function altEventOnWallServiceReport (serviceReportInfo){application.oJVccBar.GetBarCtrl()._OnWallServiceReport(serviceReportInfo);}
function altEventOnWallQueueReport (queueInfo){application.oJVccBar.GetBarCtrl()._OnWallQueueReport(queueInfo);}
function altEventOnServiceStaticReport (staticInfo){application.oJVccBar.GetBarCtrl()._OnServiceStaticReport(staticInfo);}
function altEventOnAgentStaticReport (staticInfo){application.oJVccBar.GetBarCtrl()._OnAgentStaticReport(staticInfo);}

