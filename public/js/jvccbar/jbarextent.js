//  *****************************************************************************
//  文 件 名：	jbardisplay.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		 调用电话条的辅助函数
//  说    明：
//		 调用电话条的辅助函数
//  修改说明：
// *****************************************************************************

var g_msgseq = -1;
//--------------------------------------------------------------------------------------------------
// 辅助函数
//--------------------------------------------------------------------------------------------------
window.onunload = window_onunload;
function window_onunload() {
    applicationUnLoad();
}
//创建对象成功，绑定电话条事件
function setVccBarEvent()
{
    //3
	application.oJVccBar.OnCallRing = onOnCallRing;
	application.oJVccBar.AnswerCall = onOnAnswerCall;
	application.oJVccBar.OnCallEnd = onOnCallEnd;
	//18
	application.oJVccBar.OnPrompt = onOnPrompt;
	application.oJVccBar.OnReportBtnStatus = onReportBtnStatus;
	application.oJVccBar.OnInitalSuccess = onOnInitalSuccess;
	application.oJVccBar.OnInitalFailure = onOnInitalFailure;
	application.oJVccBar.OnEventPrompt = onOnEventPrompt;
	application.oJVccBar.OnAgentWorkReport = onOnAgentWorkReport;
	application.oJVccBar.OnCallDataChanged = onOnCallDataChanged;
	application.oJVccBar.OnBarExit = onOnBarExit;
    application.oJVccBar.OnCallQueueQuery = onOnCallQueueQuery;
	application.oJVccBar.OnQueryGroupAgentStatus = onOnQueryGroupAgentStatus;
	application.oJVccBar.OnSystemMessage  = onOnSystemMessage;
	application.oJVccBar.OnRecvWeiboMsg = onOnRecvWeiboMsg;
	application.oJVccBar.OnIMMessage = onOnIMMessage
	//application.oJVccBar.OnRecvWeChatMessage = onOnRecvWeChatMessage;
	//application.oJVccBar.OnSendWeChatMsgReport = onOnSendWeChatMsgReport;
	//application.oJVccBar.OnUploadFileToMMSReport = onOnUploadFileToMMSReport;
	//application.oJVccBar.OnDownloadFileToMMSReport = onOnDownloadFileToMMSReport;
	application.oJVccBar.OnWorkStaticInfoReport = onOnWorkStaticInfoReport;
    application.oJVccBar.OnQuerySPGroupList = onOnQuerySPGroupList;

	//14	
	application.oJVccBar.OnAgentReport = onOnAgentReport;
	application.oJVccBar.OnTelReport = onOnTelReport;
	application.oJVccBar.OnServiceReport = onOnServiceReport;
	application.oJVccBar.OnIvrReport = onOnIvrReport;
	application.oJVccBar.OnTaskReport = onOnTaskReport;
	application.oJVccBar.OnOutboundReport = onOnOutboundReport;
	application.oJVccBar.OnCallReportInfo = onOnCallReportInfo;
	application.oJVccBar.OnQueueReport = onOnQueueReport;
	application.oJVccBar.OnQueryMonitorSumReport = onOnQueryMonitorSumReport;
	application.oJVccBar.OnWallServiceReport = onOnWallServiceReport;
	application.oJVccBar.OnWallQueueReport = onOnWallQueueReport;
	application.oJVccBar.OnServiceStaticReport = onOnServiceStaticReport;
	application.oJVccBar.OnAgentStaticReport = onOnAgentStaticReport;
    application.oJVccBar.OnAgentBusyReason = onOnAgentBusyReason;
    application.oJVccBar.OnAgentLogUpload  = onOnAgentLogUpload;


    application.oWechatManager.OnBeginSession = OnBeginSession;
    application.oWechatManager.OnEndSession = OnEndSession;
    application.oWechatManager.OnRecvMessage = OnRecvMessage;
    application.oWechatManager.OnSendMessageReport = OnSendMessageReport;
    application.oWechatManager.OnUploadFileStatus = OnUploadFileStatus;
    application.oWechatManager.OnDowndFileStatus = OnDowndFileStatus;

	
	application.oJVccBar.OnMethodResponseEvent = onOnMethodResponseEvent;
	if(application.oJBarDisplayer != null)
        application.oJBarDisplayer.show(1);
    displayCtrl();
}

////////////////////////--辅助函数---////////////////////////////
function displayCtrl(){
    emptyLog();
    showLog(application.oBrowserSys.expression+"\r\n\r\n");
    if(isIE())
    {
        if( getLocalLanguage() != lg_zhcn )
            showLog("browser is IE\r\n");
        else
            showLog("IE系列浏览器\r\n");
    }
    else{
        if( getLocalLanguage() != lg_zhcn )
            showLog("browser is not IE\r\n");
        else
            showLog("非IE系列浏览器\r\n");
    }
    if(application.oJVccBar.GetJVccBarType() == vccBarTypeHTML5 )
    {
        if( getLocalLanguage() != lg_zhcn )
            showLog("the vccbar is 【javascript】 version!\r\n");
        else
            showLog("当前使用【纯JS】版本电话条!\r\n");
    }
    else if(application.oJVccBar.GetJVccBarType() == vccBarTypeSILVERLIGHT )
    {
        if( getLocalLanguage() != lg_zhcn )
            showLog("the vccbar is 【silverlight】 version!\r\n");
        else
            showLog("当前使用【silverlight】版本电话条!\r\n");
    }
    else
    {
        if( getLocalLanguage() != lg_zhcn )
            showLog("the vccbar is 【ocx】 version\r\n");
        else
            showLog("当前使用【OCX】版本电话条!\r\n");
    }
    showLog("当前版本:【"+application.oJVccBar.GetVersion()+"】\r\n");
}
function showLog(Text) 
{
    var oTextareaInfo= document.getElementById("TextareaInfo");
    if(oTextareaInfo != null)
	    oTextareaInfo.value = oTextareaInfo.value + Text;
}
function emptyLog()
{
    var oTextareaInfo= document.getElementById("TextareaInfo");
    if(oTextareaInfo != null)
        oTextareaInfo.value = "";
    var oLog = document.getElementById("idLog");
    if(oLog != null)
        oLog.value="";

}
//--------------------------------------------------------------------------------------------------
// 电话条重载事件函数
//--------------------------------------------------------------------------------------------------

///////////////////////////////////////////////////
//呼叫事件
function onOnCallRing(CallingNo,CalledNo,OrgCalledNo,CallData,SerialID,ServiceDirect,CallID,UserParam,TaskID,UserDn,AgentDn,AreaCode,fileName,networkInfo,queueTime,opAgentID,ringTime)
{
    showLog("【OnCallRing】：\r\n");
    showLog("         CallingNo：【"+CallingNo+"】\r\n");
    showLog("         CalledNo：【"+CalledNo+"】\r\n");
    showLog("         OrgCalledNo：【"+OrgCalledNo+"】\r\n");
    showLog("         CallData：【"+CallData+"】\r\n");
    showLog("         CallID ：【"+CallID+"】\r\n");
    showLog("         SerialID ：【"+SerialID+"】\r\n");
    showLog("         ServiceDirect ：【"+ServiceDirect+"】\r\n");
    showLog("         UserParam ：【"+UserParam+"】\r\n");
    showLog("         TaskID ：【"+TaskID+"】\r\n");
    showLog("         UserDn ：【"+UserDn+"】\r\n");
    showLog("         AgentDn ：【"+AgentDn+"】\r\n");
    showLog("         AreaCode ：【"+AreaCode+"】\r\n");
    showLog("         fileName ：【"+fileName+"】\r\n");
    showLog("         networkInfo：【"+networkInfo+"】\r\n");
    showLog("         queueTime ：【"+queueTime+"】\r\n");
    showLog("         opAgenID ：【"+opAgentID+"】\r\n");
    showLog("         ringTime ：【"+ringTime+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnAnswerCall(UserNo,AnswerTime,SerialID,ServiceDirect,CallID,UserParam,TaskID)
{
    showLog(" 【OnAnswerCall】:\r\n");
    showLog("         AnswerTime ：【"+AnswerTime+"】\r\n");
    showLog("        UserNo ：【"+UserNo+"】\r\n");
    showLog("        CallID ：【"+CallID+"】\r\n");
    showLog("        SerialID ：【"+SerialID+"】\r\n");
    showLog("        ServiceDirect ：【"+ServiceDirect+"】\r\n");
    showLog("        UserParam ：【"+UserParam+"】\r\n");
    showLog("        TaskID ：【"+TaskID+"】\r\n");
    showLog(" *******************************************************************\r\n");
}	
function onOnCallEnd(callID,serialID,serviceDirect,userNo,bgnTime,endTime,agentAlertTime,userAlertTime,fileName,directory,disconnectType,userParam,taskID,serverName,networkInfo)
{
    showLog(" 【OnCallEnd】:\r\n");
    showLog("         fileName   ：【"+fileName+"】\r\n");
    showLog("         directory：【"+directory+"】\r\n");
    showLog("         bgnTime  ：【"+bgnTime+"】\r\n");
    showLog("         endTime  ：【"+endTime+"】\r\n");
    showLog("         userNo ：【"+userNo+"】\r\n");
    showLog("         CallID   ：【"+callID+"】\r\n");
    showLog("         SerialID ：【"+serialID+"】\r\n");
    showLog("         ServiceDirect  ：【"+serviceDirect+"】\r\n");
    showLog("         userAlertTime  ：【"+userAlertTime+"】\r\n");
    showLog("         agentAlertTime ：【"+agentAlertTime+"】\r\n");
    showLog("         fileName      ：【"+fileName+"】\r\n");
    showLog("         directory      ：【"+directory+"】\r\n");
    showLog("         disconnectType      ：【"+disconnectType+"】\r\n");
    showLog("         userParam      ：【"+userParam+"】\r\n");
    showLog("         taskID         ：【"+taskID+"】\r\n");
    showLog("         serverName         ：【"+serverName+"】\r\n");
    showLog("         networkInfo         ：【"+networkInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}


//提示事件	
function onOnPrompt(code,description)
{
    showLog("【OnPrompt】：\r\n");
    showLog(" code:【"+code+"】 description:【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onReportBtnStatus(btnIDS)
{
    if(application.oVccBarAssist.oBarBtnControl != null)
    {
        application.oVccBarAssist.oBarBtnControl.UpdateUI(btnIDS);
    }
    if(application.oVccBarAssist.oBarAgentStatus != null)
    {
       application.oVccBarAssist.oBarAgentStatus.SetAgentStatus(application.oJVccBar.GetAgentStatus());
    }

    showLog("【ReportBtnStatus】：\r\n");
    var agentStatus = application.oJVccBar.GetAgentStatus();
    if(agentStatus == 1)
    {
        if( getLocalLanguage() != lg_zhcn )
            agentStatus = agentStatus + " agent subStatus:【"+application.oJVccBar.GetAgentSubBusyStatus()+"】";
        else
            agentStatus = agentStatus + " 子状态:【"+application.oJVccBar.GetAgentSubBusyStatus()+"】";
    }
    if( getLocalLanguage() != lg_zhcn )
        showLog("         usefull ids  ：【"+btnIDS+"】\r\n agent status：【"+agentStatus+"】\r\n");
    else
        showLog("         可现状态值   ：【"+btnIDS+"】\r\n 当前座席状态：【"+agentStatus+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnEventPrompt(code,description)
{
    showLog("【OnEventPrompt】：");
    showLog(" code:【"+code+"】 description:【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}  
function onOnInitalSuccess()
{
    if(application.oVccBarAssist.oBarAgentStatus != null)
    {
        application.oVccBarAssist.oBarAgentStatus.SetSubBusyStatus(application.oJVccBar.GetBusySubStatus());
    }
    showLog("【OnInitalSuccess】\r\n ");
    if( getLocalLanguage() != lg_zhcn )
        showLog("        used phoneType:【"+application.oJVccBar.GetAttribute("PhonType")+"】\r\n        其中 1：inside sipphone 2：outer device；3：remote sipphone;4：soft switch pretransfer;5：yealink phone\r\n");
    else
        showLog("        当时使用phoneType:【"+application.oJVccBar.GetAttribute("PhonType")+"】\r\n        其中 1：内置Sip电话 2：外置其他终端；3：远程sip电话;4：软交换前传号码;5：yealink话机\r\n");
    showLog(" exitCause:" + application.oJVccBar.GetExitCause() + "\r\n ");
    showLog(" *******************************************************************\r\n");
//    alert(application.oJVccBar.GetActiveService());
}
function onOnInitalFailure(code,description)
{
    showLog("【OnInitalFailure】\r\n 【"+code+"】 【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnBarExit(code,description)
{
    showLog("【OnBarExit】 \r\n【"+code+"】 【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnAgentWorkReport(workStatus,description)
{
    if( getLocalLanguage() != lg_zhcn )
        showLog("【OnAgentWorkReport】 sceneid：【"+workStatus+"】 scene description：【"+description+"】\r\n");
    else
        showLog("【OnAgentWorkReport】 场景编号：【"+workStatus+"】 场景描述：【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnCallDataChanged(callData)
{
    showLog("【OnCallDataChanged】：\r\n【"+callData+"】\r\n");
    showLog(" *******************************************************************\r\n");
}

function onOnCallQueueQuery(QueueInfo)
{
    showLog("【OnCallQueueQuery】：\r\n param:【"+QueueInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}

function onOnQueryGroupAgentStatus(QueryInfo,type)
{
    showLog("【OnQueryGroupAgentStatus】：\r\n param:【"+QueryInfo+"】\r\n type:【"+type+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnSystemMessage(code,description)
{
    showLog("【OnSystemMessage】：\r\n");
    showLog(" code:【"+code+"】 description:【"+description+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnRecvWeiboMsg(message)
{
    showLog("【OnRecvWeiboMsg】 \r\n msgtype:【"+msgtype+"】 \r\n message:【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function  onOnIMMessage(msgtype,message)
{
    showLog("【OnIMMessage】  \r\n msgtype:【"+msgtype+"】 message:【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnRecvWeChatMessage(sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp)
{
    showLog("【OnRecvWeChatMessage】：\r\n");
    showLog("         sessionId   ：【"+sessionId+"】\r\n");
    showLog("         type        ：【"+type+"】\r\n");
    showLog("         msgseq      ：【"+msgseq+"】\r\n");
    showLog("         userId      ：【"+userId+"】\r\n");
    showLog("         vccPublicId ：【"+vccPublicId+"】\r\n");
    showLog("        msgType      ：【"+msgType+"】\r\n");
    showLog("        content      ：【"+content+"】\r\n");
    showLog("        sessionUrl   ：【"+sessionUrl+"】\r\n");
    showLog("        recongnition ：【"+recongnition+"】\r\n");
    showLog("        event        ：【"+msgevent+"】\r\n");
    showLog("        eventKey     ：【"+eventKey+"】\r\n");
    showLog("        title        ：【"+title+"】\r\n");
    showLog("        data         ：【"+data+"】\r\n");
    showLog("        timeStamp    ："+timeStamp+"\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnSendWeChatMsgReport(userId, sessionId, msgseq, code, des, timeStamp)
{
    showLog("【OnSendWeChatMsgReport】：\r\n");
    showLog("         userId   ：【"+userId+"】\r\n");
    showLog("         sessionId：【"+sessionId+"】\r\n");
    showLog("         msgseq   ：【"+msgseq+"】\r\n");
    showLog("         code     ：【"+code+"】\r\n");
    showLog("         des      ：【"+des+"】\r\n");
    showLog("         timeStamp：【"+timeStamp+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnUploadFileToMMSReport(strFileName,status,strUrl)
{
    showLog("【OnUploadFileToMMSReport】：\r\n");
    showLog("         strFileName   ：【"+strFileName+"】\r\n");
    showLog("         status        ：【"+status+"】\r\n");
    showLog("         strUrl        ：【"+strUrl+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnDownloadFileToMMSReport(strUrl,status,strFileName)
{
    showLog("【OnDownloadFileToMMSReport】：\r\n");
    showLog("         strUrl        ：【"+strUrl+"】\r\n");
    showLog("         status        ：【"+status+"】\r\n");
    showLog("         strFileName   ：【"+strFileName+"】\r\n");
    showLog(" *******************************************************************\r\n");
}

//监控事件
function onOnAgentReport(AgentReportInfo)
{
    showLog("【OnAgentReport】：\r\n param：【"+AgentReportInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnIvrReport(IvrReportInfo)
{
    showLog("【OnIvrReport】：\r\n"+IvrReportInfo+")\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnTelReport(TelReportInfo)
{
    showLog("【OnTelReport】：\r\n"+TelReportInfo+")\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnServiceReport(ServiceReportInfo)
{
    showLog("【OnServiceReport】(\r\n"+ServiceReportInfo+")\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnTaskReport(TaskReportInfo)
{
    showLog("【OnTaskReport】\r\n"+TaskReportInfo+")\r\n");
    showLog(" *******************************************************************\r\n");
}

function onOnOutboundReport(TaskInfo)
{
    showLog("【OnOutboundReport】\r\n param：【"+TaskInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");

}
function onOnCallReportInfo(CallInfo)
{
    showLog("【OnCallReportInfo】\r\n param：【"+CallInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnQueueReport(QueueInfo)
{
    showLog("【OnQueueReport】：\r\n"+QueueInfo+"\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnQueryMonitorSumReport(cmdName,reportInfo)
{
    showLog("【OnQueryMonitorSumReport】\r\n name:【"+cmdName+"】\r\n reportInfo:【"+reportInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function  onOnWallServiceReport(message)
{return;
    showLog("【OnWallServiceReport】\r\n  【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function  onOnWallQueueReport(message)
{return;
    showLog("【OnWallQueueReport】\r\n 【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function  onOnWorkStaticInfoReport(message)
{return;
    showLog("【OnWorkStaticInfoReport】 \r\n 【"+message+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnQuerySPGroupList(type,ctiInfo){
    showLog("【onOnQuerySPGroupList】 \r\n type:【"+type+"】\r\n");
    showLog(" ctiInfo:【"+ctiInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function  onOnServiceStaticReport(StaticInfo)
{return;
    showLog("【OnServiceStaticReport】 \r\n 【"+StaticInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function  onOnAgentStaticReport(StaticInfo)
{return;
    showLog("【OnAgentStaticReport】 \r\n 【"+StaticInfo+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnAgentBusyReason(type,des){
    showLog("【OnAgentBusyReason】 \r\n type:【"+type+"】\r\n");
    showLog(" des:【"+des+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function onOnAgentLogUpload(destAgent,urlType,uploadServer,fileName,code,des){
    showLog("【OnAgentLogUpload】 \r\n urlType:【"+urlType+"】\r\n");
    showLog(" uploadServer:【"+uploadServer+"】\r\n");
    showLog(" fileName:【"+fileName+"】\r\n");
    showLog(" code:【"+code+"】\r\n");
    showLog(" des:【"+des+"】\r\n");
    showLog(" *******************************************************************\r\n");
}

//命令异步返回事件
function onOnMethodResponseEvent(cmdName,param)
{
    showLog("【OnMethodResponseEvent】：\r\n");
    showLog(" cmdName:【"+cmdName+"】\r\n");
    showLog(" return param:【"+param+"】\r\n");
    showLog(" *******************************************************************\r\n");

    if (!(typeof (oMakeCallDlg) == "undefined" || oMakeCallDlg == null))
        oMakeCallDlg.Display(param);
}


function OnBeginSession(sessionId)
{
    showLog("开始微信会话：【OnBeginSession】：\r\n");
    showLog(" sessionId:【"+sessionId+"】\r\n");
    showLog(" *******************************************************************\r\n");
}
function OnEndSession(sessionId)
{
    showLog("结束微信会话：【OnEndSession】：\r\n");
    showLog(" *******************************************************************\r\n");
}
function OnRecvMessage(sessionId,msgseq)
{
    showLog("接收对方消息：【OnRecvMessage("+sessionId+","+msgseq+")】：\r\n");
    g_msgseq = msgseq;
    var oSession = application.oWechatManager.GetSessionItem(sessionId,msgseq);
    if(oSession != null){
        var strValue = "";
        if(oSession.msgType == "text"){
            strValue = oSession.content;
        }
        else{
            strValue = oSession.sessionUrl;
        }
        showLog("接收对方内容：【"+strValue+"】\r\n");
    }
    showLog(" *******************************************************************\r\n");
}
function OnSendMessageReport(sessionId,msgseq)
{
    showLog("发送消息：【OnSendMessageReport("+sessionId+","+msgseq+")】：\r\n");
    g_msgseq = msgseq;
    var oSession = application.oWechatManager.GetSessionItem(sessionId,msgseq);
    if(oSession != null){
        var strValue = "";
        if(oSession.msgType == "text"){
            strValue = oSession.content;
        }
        else{
            strValue = oSession.sessionUrl;
        }
        showLog("发送内容：【"+strValue+"】\r\n");
    }
    showLog(" *******************************************************************\r\n");
}
function OnUploadFileStatus(sessionID,status,strUrl){
    showLog("上传文件状态事件：【OnUploadFileStatus("+sessionID+","+status+","+strUrl+")】：\r\n");
    showLog(" *******************************************************************\r\n");
}

function OnDowndFileStatus(sessionID,msgseq,status,strUrl){
    showLog("下载文件状态事件：【OnDowndFileStatus("+sessionID+","+msgseq+","+status+","+strUrl+")】：\r\n");
    showLog(" *******************************************************************\r\n");

}