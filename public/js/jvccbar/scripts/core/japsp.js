//  *****************************************************************************
//  文 件 名：	japsp.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		   websocket及APSP协议
//  说    明：
//		   websocket及APSP协议
//  修改说明：
// *****************************************************************************


///////////////////////////////////////////////////////////////////////////// 
// websocket information
var  websocket_guard_connecting                        = 3000;
var  websocket_guard_connected                         = websocket_guard_connecting+1;
var  websocket_guard_colsed                            = websocket_guard_connected+1;
var  websocket_guard_remoteserver_disconnected         = websocket_guard_connected+2;

var  websocket_connecting                        = 3100;
var  websocket_connected                         = websocket_connecting+1;
var  websocket_closed                            = websocket_connected+1;
var  websocket_remoteserver_disconnected         = websocket_connected+2;
var  websocket_reconnecting                        = websocket_connected+3;

///////////////////////////////////////////////////////////////////////////// 
// 事件类型 event Type
var APSP_Type_NONE            = -1;
var APSP_Type_Action          = 0;
var APSP_Type_Event           = 1;
var APSP_Type_Command         = 2;
var APSP_Type_Prompt          = 3;


///////////////////////////////////////////////////////////////////////////// 
// apsp protect content
var APSP_NONE                      = -1;
var APSP_GetLocalPort_CONF         = APSP_NONE+1;
var APSP_UpdateSetup_CONF          = APSP_GetLocalPort_CONF+1;
var APSP_GetVersion_CONF           = APSP_UpdateSetup_CONF+1;
var APSP_Initial_CONF              = APSP_GetVersion_CONF+1;
var APSP_MakeCall_CONF             = APSP_Initial_CONF+1;
var APSP_TransferOut_CONF          = APSP_MakeCall_CONF+1;
var APSP_SerialBtn_CONF            = APSP_TransferOut_CONF+1;
var APSP_ForeReleaseCall_CONF      = APSP_SerialBtn_CONF+1;
var APSP_Insert_CONF               = APSP_ForeReleaseCall_CONF+1;
var APSP_Listen_CONF               = APSP_Insert_CONF+1;
var APSP_Help_CONF        = APSP_Listen_CONF+1;
var APSP_Bridge_CONF        = APSP_Help_CONF+1;
var APSP_SetBusy_CONF        = APSP_Bridge_CONF+1;
var APSP_SetIdle_CONF        = APSP_SetBusy_CONF+1;
var APSP_CallIn_CONF        = APSP_SetIdle_CONF+1;
var APSP_Hold_CONF        = APSP_CallIn_CONF+1;
var APSP_RetrieveHold_CONF        = APSP_Hold_CONF+1;
var APSP_Disconnect_CONF        = APSP_RetrieveHold_CONF+1;
var APSP_Conference_CONF        = APSP_Disconnect_CONF+1;
var APSP_Answer_CONF        = APSP_Conference_CONF+1;
var APSP_Consult_CONF        = APSP_Answer_CONF+1;
var APSP_GetBtnStatus_CONF        = APSP_Consult_CONF+1;
var APSP_Intercept_CONF        = APSP_GetBtnStatus_CONF+1;
var APSP_SendDTMF_CONF        = APSP_Intercept_CONF+1;
var APSP_BeginRecord_CONF        = APSP_SendDTMF_CONF+1;
var APSP_StopRecord_CONF        = APSP_BeginRecord_CONF+1;
var APSP_BeginPlay_CONF        = APSP_StopRecord_CONF+1;
var APSP_StopPlay_CONF        = APSP_BeginPlay_CONF+1;
var APSP_ForceReset_CONF        = APSP_StopPlay_CONF+1;
var APSP_Configurate_CONF        = APSP_ForceReset_CONF+1;
var APSP_Transfer_CONF        = APSP_Configurate_CONF+1;
var APSP_Mute_CONF        = APSP_Transfer_CONF+1;
var APSP_Lock_CONF        = APSP_Mute_CONF+1;
var APSP_UnLock_CONF        = APSP_Lock_CONF+1;
var APSP_SetWrapUp_CONF        = APSP_UnLock_CONF+1;
var APSP_ForceIdle_CONF        = APSP_SetWrapUp_CONF+1;
var APSP_ForceBusy_CONF        = APSP_ForceIdle_CONF+1;
var APSP_ForceOut_CONF        = APSP_ForceBusy_CONF+1;
var APSP_AlterNate_CONF        = APSP_ForceOut_CONF+1;
var APSP_CallBack_CONF        = APSP_AlterNate_CONF+1;
var APSP_ReCall_CONF        = APSP_CallBack_CONF+1;
var APSP_GetConfiguration_CONF        = APSP_ReCall_CONF+1;
var APSP_GetCallInfo_CONF        = APSP_GetConfiguration_CONF+1;
var APSP_ChangeCallQueue_CONF        = APSP_GetCallInfo_CONF+1;
var APSP_GetCallID_CONF        = APSP_ChangeCallQueue_CONF+1;
var APSP_QueryQueueInfo_CONF        = APSP_GetCallID_CONF+1;
var APSP_QueryIvrInfo_CONF        = APSP_QueryQueueInfo_CONF+1;
var APSP_SMMsg_CONF        = APSP_QueryIvrInfo_CONF+1;
var APSP_SetCTICalloutTask_CONF        = APSP_SMMsg_CONF+1;
var APSP_GetCTICalloutTask_CONF        = APSP_SetCTICalloutTask_CONF+1;
var APSP_QuerySPGroupList_CONF        = APSP_GetCTICalloutTask_CONF+1;
var APSP_ReleaseThirdOne_CONF        = APSP_QuerySPGroupList_CONF+1;
var APSP_GetCallData_CONF        = APSP_ReleaseThirdOne_CONF+1;
var APSP_SetCallData_CONF        = APSP_GetCallData_CONF+1;
var APSP_BeginCollect_CONF        = APSP_SetCallData_CONF+1;
var APSP_StopCollect_CONF        = APSP_BeginCollect_CONF+1;
var APSP_GetTransfer_CONF        = APSP_StopCollect_CONF+1;
var APSP_SetTransfer_CONF        = APSP_GetTransfer_CONF+1;
var APSP_GetMonitoredAgentList_CONF        = APSP_SetTransfer_CONF+1;
var APSP_UnInitial_CONF        = APSP_GetMonitoredAgentList_CONF+1;
var APSP_SetTransparentParameter_CONF        = APSP_UnInitial_CONF+1;
var APSP_InitialState_CONF        = APSP_SetTransparentParameter_CONF+1;
var APSP_AgentQuery_CONF        = APSP_InitialState_CONF+1;
var APSP_IvrQuery_CONF        = APSP_AgentQuery_CONF+1;
var APSP_TelQuery_CONF        = APSP_IvrQuery_CONF+1;
var APSP_ServiceQuery_CONF        = APSP_TelQuery_CONF+1;
var APSP_TaskQuery_CONF        = APSP_ServiceQuery_CONF+1;
var APSP_StartNotification_CONF        = APSP_TaskQuery_CONF+1;
var APSP_EndNotification_CONF        = APSP_StartNotification_CONF+1;
var APSP_GetTaskSummary_CONF        = APSP_EndNotification_CONF+1;
var APSP_CallReportQuery_CONF    = APSP_GetTaskSummary_CONF+1;
var APSP_QueryCTIInfo_CONF	= APSP_CallReportQuery_CONF+1;
var APSP_CallQueueQuery_CONF	= APSP_QueryCTIInfo_CONF+1;
var APSP_SetCTIInfo_CONF	= APSP_CallQueueQuery_CONF+1;
var APSP_QueryMonitorSumInfo_CONF	= APSP_SetCTIInfo_CONF+1;
var APSP_SendWeiboMsg_CONF= APSP_QueryMonitorSumInfo_CONF+1;
var APSP_SendIMMessage_CONF= APSP_SendWeiboMsg_CONF+1;
var APSP_SendWeChatMsg_CONF= APSP_SendIMMessage_CONF+1;
var APSP_QueryWeChatData_CONF= APSP_SendWeChatMsg_CONF+1;
var APSP_QueryWeChatHistory_CONF= APSP_QueryWeChatData_CONF+1;
var APSP_UploadFileToMMS_CONF= APSP_QueryWeChatHistory_CONF+1;
var APSP_DownFileFromMMS_CONF= APSP_UploadFileToMMS_CONF+1;
var APSP_GetWeChatParam_CONF= APSP_DownFileFromMMS_CONF+1;
var APSP_TransferCallQueue_CONF= APSP_GetWeChatParam_CONF+1;

var APSP_ComingCall_EVENT     = APSP_TransferCallQueue_CONF+1;
var APSP_RecordFileUpLoaded_EVENT             = APSP_ComingCall_EVENT+1;
var APSP_AnswerCall_EVENT       = APSP_RecordFileUpLoaded_EVENT+1;
var APSP_OnPrompt_EVENT            = APSP_AnswerCall_EVENT+1;
var APSP_OnReportBtnStatus_EVENT               = APSP_OnPrompt_EVENT+1;
var APSP_OnTelephoneStatusChanged_EVENT               = APSP_OnReportBtnStatus_EVENT+1;
var APSP_OnAgentStatusChanged_EVENT               = APSP_OnTelephoneStatusChanged_EVENT+1;
var APSP_OnQueueStatusChanged_EVENT               = APSP_OnAgentStatusChanged_EVENT+1;
var APSP_OnlockStatusReport_EVENT               = APSP_OnQueueStatusChanged_EVENT+1;
var APSP_OnInitalSuccess_EVENT               = APSP_OnlockStatusReport_EVENT+1;
var APSP_OnShortCutKey_EVENT               = APSP_OnInitalSuccess_EVENT+1;
var APSP_OnIVRStatusChanged_EVENT               = APSP_OnShortCutKey_EVENT+1;
var APSP_OnEventPrompt_EVENT               = APSP_OnIVRStatusChanged_EVENT+1;
var APSP_OnAgentWorkReport_EVENT               = APSP_OnEventPrompt_EVENT+1;
var APSP_OnInitalFailure_EVENT               = APSP_OnAgentWorkReport_EVENT+1;
var APSP_OnCallEnd_EVENT               = APSP_OnInitalFailure_EVENT+1;
var APSP_OnAgentReport_EVENT               = APSP_OnCallEnd_EVENT+1;
var APSP_OnIvrReport_EVENT               = APSP_OnAgentReport_EVENT+1;
var APSP_OnTelReport_EVENT               = APSP_OnIvrReport_EVENT+1;
var APSP_OnServiceReport_EVENT               = APSP_OnTelReport_EVENT+1;
var APSP_OnTaskReport_EVENT        = APSP_OnServiceReport_EVENT+1;
var APSP_OutboundReport_EVENT     = APSP_OnTaskReport_EVENT+1;
var APSP_CallReportInfo_EVENT        = APSP_OutboundReport_EVENT+1;
var APSP_QueryMonitorSumReport_EVENT        = APSP_CallReportInfo_EVENT+1;
var APSP_OnCallRing_EVENT        = APSP_QueryMonitorSumReport_EVENT+1;
var APSP_OnHeatBeat_EVENT        = APSP_OnCallRing_EVENT+1;
var APSP_OnBarExit_EVENT        = APSP_OnHeatBeat_EVENT+1;
var APSP_OnSystemBusy_EVENT         = APSP_OnBarExit_EVENT+1;
var APSP_OnCallQueueQuery_EVENT         = APSP_OnSystemBusy_EVENT+1;
var APSP_OnQueueReport_EVENT         = APSP_OnCallQueueQuery_EVENT+1;
var APSP_OnSystemMessage_EVENT         = APSP_OnQueueReport_EVENT+1;
var APSP_OnRecvWeiboMsg_EVENT         = APSP_OnSystemMessage_EVENT+1;
var APSP_OnIMNoticsMsg_EVENT          = APSP_OnRecvWeiboMsg_EVENT+1;  //IM通知
var APSP_OnIMTextMsg_EVENT            = APSP_OnIMNoticsMsg_EVENT+1;     //IM文本
var APSP_OnWallServiceReport_EVENT    = APSP_OnIMTextMsg_EVENT+1; 
var APSP_OnWallQueueReport_EVENT      = APSP_OnWallServiceReport_EVENT+1; 
var APSP_OnStaticInfoReport_EVENT     = APSP_OnWallQueueReport_EVENT+1;
var APSP_OnRecvWeChatMsg_EVENT        = APSP_OnStaticInfoReport_EVENT+1;
var APSP_OnServiceStaticReport_EVENT  = APSP_OnRecvWeChatMsg_EVENT+1;
var APSP_OnAgentStaticReport_EVENT    = APSP_OnServiceStaticReport_EVENT+1;
var APSP_OnUploadFileToMMSReport_EVENT    = APSP_OnAgentStaticReport_EVENT+1;
var APSP_OnDownloadFileToMMSReport_EVENT   = APSP_OnUploadFileToMMSReport_EVENT+1;
var APSP_OnSendWeChatMsgReport_EVENT   =   APSP_OnDownloadFileToMMSReport_EVENT +1;
var APSP_OnAQueryCTIInfo_EVENT   =   APSP_OnSendWeChatMsgReport_EVENT +1;
var APSP_OnAgentBusyReason_EVENT   =   APSP_OnAQueryCTIInfo_EVENT +1;

var APSP_OnAction_EVENT         = APSP_OnAgentBusyReason_EVENT+1;
var APSP_OnSetDlgStatusText_EVENT         = APSP_OnAction_EVENT+1;
var APSP_OnChangeBtnSerial_EVENT         = APSP_OnSetDlgStatusText_EVENT+1;
var APSP_Test_CONF        = APSP_OnChangeBtnSerial_EVENT+1;
var APSP_Item_End            = APSP_Test_CONF+1;
var APSP_WebSocket_Event            = APSP_Item_End+1;


///////////////////////////////////////////////////////////////////////////////
//  共用函数 

function getCmdType(eType){
    var  ret = APSP_Type_NONE;
    if(eType == "event")
	    ret = APSP_Type_Event;
    if(eType == "command")
	    ret = APSP_Type_Command;
    if(eType == "action")
	    ret = APSP_Type_Action;
    return ret;
}
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
function buildApspMsg(strCmd,strParam)
{
    var  msg = "<apspMessage ver=\"2.0.0\" time=\""+getTimeString()+"\">";
           msg = msg+ "<header><sessionID>0</sessionID></header>";
	       msg = msg+ "<body type=\"command\" name=\""+strCmd+"\">";
	       msg = msg+ "<paspparam>"+strParam+"</paspparam>";
	       msg = msg+ "</body></apspMessage>";
    return  msg;
}



////////////////////////////////////////////////////////////////////////////////////
//  websocket
function JAPSPWebSocket(appName)
{
	this._ws = null;
	this._connectFlag = false;
	this._msgCallback = null;
	this._appName = appName;
    this.m_arrCmd = new Array(); 
    this.m_arrCmdIndex = new Array(); 
	
	///////////////////////////////////////////////////////////////////
	//// Method
	this.WSConnect  = function WSConnect(server,port) {
         try{
    	    this._ws = new WebSocket("ws://" + server+":"+ port);
          }
		  catch (ex) {
            try{
	            this._ws = new MozWebSocket("ws://" + server+":"+ port);
            }
            catch (ex) {
	             alert(ex);
                 this._ws = null;
                 return;
            }
	     }
        this._ws.onopen = this.WSonOpen;
        this._ws.onmessage = this.WSonMessage;
        this._ws.onclose = this.WSonClose;
        this._ws.onerror = this.WSonError;	
        this._ws.oParent = this;	
        
    }	
	this.WSDisconnect = function WSDisconnect(){
	     if(this._connectFlag && (this._ws.readyState == 0 || this._ws.readyState == 1)){
				this._ws.close();
			}
	};
	this.WSSendMsg = function  WSSendMsg(msg){
		 if(msg == "")
			return -1;
		if (this._connectFlag ){
		    DisplayLog(VccBar_Log_Protocol,"SenPAS:"+msg);
			this._ws.send(msg);
			return 0;
		}
		return -1;
     }	
	 this.SetMsgCallBack = function SetMsgCallBack(callback){ 
	    this._msgCallback = callback;
	 }
	//////////////////////////////////////////////////////////////////
	///event
	this.WSonOpen = function WSonOpen(){
		this.oParent._connectFlag = true;
		this.oParent.invokeCallBack(APSP_Type_Prompt,APSP_WebSocket_Event,websocket_connected);
	}
	this.WSonMessage = function WSonMessage(event){
	     DisplayLog(VccBar_Log_Protocol,"RecPAS:"+event.data);
	     var  type = getSubString(event.data,"type=\"","\"");		 
		 var  name = getSubString(event.data,"name=\"","\"");
		 var  param = getSubString(event.data,"<paspparam>","</paspparam>");
	//	 DisplayLog(VccBar_Log_Info,"Recv:type:【"+type+"】name:【"+name+"】param:【"+param+"】");
		 this.oParent.invokeCallBack(getCmdType(type),this.oParent.GetCmdIndex(name),param);
	}
	this.WSonClose = function WSonClose(){
	    DisplayLog(VccBar_Log_Error, "WebSocket::WSonClose(" + this.oParent._appName + ")");
		this.oParent.invokeCallBack(APSP_Type_Prompt,APSP_WebSocket_Event,websocket_closed);
		this.oParent._connectFlag = false;
	}
	this.WSonError = function WSonError(e){
	    DisplayLog(VccBar_Log_Error, "WebSocket::WSonError(" + this.oParent._appName + ")");
		this.oParent.invokeCallBack(APSP_Type_Prompt,APSP_WebSocket_Event,websocket_remoteserver_disconnected);
		this.oParent._connectFlag = false;
	}
	this.invokeCallBack = function invokeCallBack(cmdType,cmdIndex,param){
		if(this._msgCallback != null){
			this._msgCallback(cmdType,cmdIndex,param);
		}
	}
    
    this._APSPInit = function() {
	    if(this.m_arrCmd.length>0)
		    return ;
	    this.m_arrCmd.push("GetLocalPort");                  this.m_arrCmdIndex.push(APSP_GetLocalPort_CONF);
	    this.m_arrCmd.push("UpdateSetup");                   this.m_arrCmdIndex.push(APSP_UpdateSetup_CONF);
		this.m_arrCmd.push("GetVersion");                    this.m_arrCmdIndex.push(APSP_GetVersion_CONF);
	    this.m_arrCmd.push("Initial");                       this.m_arrCmdIndex.push(APSP_Initial_CONF);
	    this.m_arrCmd.push("MakeCall");                      this.m_arrCmdIndex.push(APSP_MakeCall_CONF);	
	    this.m_arrCmd.push("TransferOut");                   this.m_arrCmdIndex.push(APSP_TransferOut_CONF);	
	    this.m_arrCmd.push("SerialBtn");                     this.m_arrCmdIndex.push(APSP_SerialBtn_CONF);	
	    this.m_arrCmd.push("ForeReleaseCall");               this.m_arrCmdIndex.push(APSP_ForeReleaseCall_CONF);	
	    this.m_arrCmd.push("Insert");                        this.m_arrCmdIndex.push(APSP_Insert_CONF);	
	    this.m_arrCmd.push("Listen");                        this.m_arrCmdIndex.push(APSP_Listen_CONF);	
	    this.m_arrCmd.push("Help");                          this.m_arrCmdIndex.push(APSP_Help_CONF);	
	    this.m_arrCmd.push("Bridge");                        this.m_arrCmdIndex.push(APSP_Bridge_CONF);
	    this.m_arrCmd.push("SetBusy");                       this.m_arrCmdIndex.push(APSP_SetBusy_CONF);
	    this.m_arrCmd.push("SetIdle");                       this.m_arrCmdIndex.push(APSP_SetIdle_CONF);
	    this.m_arrCmd.push("CallIn");                        this.m_arrCmdIndex.push(APSP_CallIn_CONF);
	    this.m_arrCmd.push("Hold");                          this.m_arrCmdIndex.push(APSP_Hold_CONF);
	    this.m_arrCmd.push("RetrieveHold");                  this.m_arrCmdIndex.push(APSP_RetrieveHold_CONF);
	    this.m_arrCmd.push("Disconnect");                    this.m_arrCmdIndex.push(APSP_Disconnect_CONF);
	    this.m_arrCmd.push("Conference");                    this.m_arrCmdIndex.push(APSP_Conference_CONF);
	    this.m_arrCmd.push("Answer");                        this.m_arrCmdIndex.push(APSP_Answer_CONF);
	    this.m_arrCmd.push("Consult");                       this.m_arrCmdIndex.push(APSP_Consult_CONF);
	    this.m_arrCmd.push("GetBtnStatus");                  this.m_arrCmdIndex.push(APSP_GetBtnStatus_CONF);
	    this.m_arrCmd.push("Intercept");                     this.m_arrCmdIndex.push(APSP_Intercept_CONF);
	    this.m_arrCmd.push("SendDTMF");                      this.m_arrCmdIndex.push(APSP_SendDTMF_CONF);
	    this.m_arrCmd.push("BeginRecord");                   this.m_arrCmdIndex.push(APSP_BeginRecord_CONF);
	    this.m_arrCmd.push("StopRecord");                    this.m_arrCmdIndex.push(APSP_StopRecord_CONF);
	    this.m_arrCmd.push("BeginPlay");                     this.m_arrCmdIndex.push(APSP_BeginPlay_CONF);
	    this.m_arrCmd.push("StopPlay");                      this.m_arrCmdIndex.push(APSP_StopPlay_CONF);
	    this.m_arrCmd.push("ForceReset");                    this.m_arrCmdIndex.push(APSP_ForceReset_CONF);
	    this.m_arrCmd.push("Configurate");                   this.m_arrCmdIndex.push(APSP_Configurate_CONF);
	    this.m_arrCmd.push("Transfer");                      this.m_arrCmdIndex.push(APSP_Transfer_CONF);
	    this.m_arrCmd.push("Mute");                          this.m_arrCmdIndex.push(APSP_Mute_CONF);
	    this.m_arrCmd.push("Lock");                          this.m_arrCmdIndex.push(APSP_Lock_CONF);
	    this.m_arrCmd.push("UnLock");                        this.m_arrCmdIndex.push(APSP_UnLock_CONF);
	    this.m_arrCmd.push("SetWrapUp");                     this.m_arrCmdIndex.push(APSP_SetWrapUp_CONF);
	    this.m_arrCmd.push("ForceIdle");                     this.m_arrCmdIndex.push(APSP_ForceIdle_CONF);
	    this.m_arrCmd.push("ForceBusy");                     this.m_arrCmdIndex.push(APSP_ForceBusy_CONF);
	    this.m_arrCmd.push("ForceOut");                      this.m_arrCmdIndex.push(APSP_ForceOut_CONF);
	    this.m_arrCmd.push("AlterNate");                     this.m_arrCmdIndex.push(APSP_AlterNate_CONF);
	    this.m_arrCmd.push("CallBack");                      this.m_arrCmdIndex.push(APSP_CallBack_CONF);
	    this.m_arrCmd.push("ReCall");                        this.m_arrCmdIndex.push(APSP_ReCall_CONF);
	    this.m_arrCmd.push("GetConfiguration");              this.m_arrCmdIndex.push(APSP_GetConfiguration_CONF);
	    this.m_arrCmd.push("GetCallInfo");                   this.m_arrCmdIndex.push(APSP_GetCallInfo_CONF);
	    this.m_arrCmd.push("ChangeCallQueue");               this.m_arrCmdIndex.push(APSP_ChangeCallQueue_CONF);
	    this.m_arrCmd.push("GetCallID");                     this.m_arrCmdIndex.push(APSP_GetCallID_CONF);
	    this.m_arrCmd.push("QueryQueueInfo");                this.m_arrCmdIndex.push(APSP_QueryQueueInfo_CONF);
	    this.m_arrCmd.push("QueryIvrInfo");                  this.m_arrCmdIndex.push(APSP_QueryIvrInfo_CONF);
	    this.m_arrCmd.push("SMMsg");                         this.m_arrCmdIndex.push(APSP_SMMsg_CONF);
	    this.m_arrCmd.push("SetCTICalloutTask");             this.m_arrCmdIndex.push(APSP_SetCTICalloutTask_CONF);
	    this.m_arrCmd.push("GetCTICalloutTask");             this.m_arrCmdIndex.push(APSP_GetCTICalloutTask_CONF);
	    this.m_arrCmd.push("QuerySPGroupList");              this.m_arrCmdIndex.push(APSP_QuerySPGroupList_CONF);
	    this.m_arrCmd.push("ReleaseThirdOne");               this.m_arrCmdIndex.push(APSP_ReleaseThirdOne_CONF);
	    this.m_arrCmd.push("GetCallData");                   this.m_arrCmdIndex.push(APSP_GetCallData_CONF);
	    this.m_arrCmd.push("SetCallData");                   this.m_arrCmdIndex.push(APSP_SetCallData_CONF);
	    this.m_arrCmd.push("BeginCollect");                  this.m_arrCmdIndex.push(APSP_BeginCollect_CONF);
	    this.m_arrCmd.push("StopCollect");                   this.m_arrCmdIndex.push(APSP_StopCollect_CONF);
	    this.m_arrCmd.push("GetTransfer");                   this.m_arrCmdIndex.push(APSP_GetTransfer_CONF);
	    this.m_arrCmd.push("SetTransfer");                   this.m_arrCmdIndex.push(APSP_SetTransfer_CONF);
	    this.m_arrCmd.push("GetMonitoredAgentList");         this.m_arrCmdIndex.push(APSP_GetMonitoredAgentList_CONF);
	    this.m_arrCmd.push("UnInitial");                     this.m_arrCmdIndex.push(APSP_UnInitial_CONF);
	    this.m_arrCmd.push("SetTransparentParameter");       this.m_arrCmdIndex.push(APSP_SetTransparentParameter_CONF);
	    this.m_arrCmd.push("InitialState");                  this.m_arrCmdIndex.push(APSP_InitialState_CONF);
	    this.m_arrCmd.push("AgentQuery");                    this.m_arrCmdIndex.push(APSP_AgentQuery_CONF);
	    this.m_arrCmd.push("IvrQuery");                      this.m_arrCmdIndex.push(APSP_IvrQuery_CONF);
	    this.m_arrCmd.push("TelQuery");                      this.m_arrCmdIndex.push(APSP_TelQuery_CONF);
	    this.m_arrCmd.push("ServiceQuery");                  this.m_arrCmdIndex.push(APSP_ServiceQuery_CONF);
	    this.m_arrCmd.push("TaskQuery");                     this.m_arrCmdIndex.push(APSP_TaskQuery_CONF);
	    this.m_arrCmd.push("StartNotification");             this.m_arrCmdIndex.push(APSP_StartNotification_CONF);
	    this.m_arrCmd.push("EndNotification");               this.m_arrCmdIndex.push(APSP_EndNotification_CONF);
	    this.m_arrCmd.push("GetTaskSummary");                this.m_arrCmdIndex.push(APSP_GetTaskSummary_CONF);
	    this.m_arrCmd.push("CallReportQuery");               this.m_arrCmdIndex.push(APSP_CallReportQuery_CONF);
	    this.m_arrCmd.push("QueryCTIInfo");				   this.m_arrCmdIndex.push(APSP_QueryCTIInfo_CONF);
	    this.m_arrCmd.push("CallQueueQuery");                this.m_arrCmdIndex.push(APSP_CallQueueQuery_CONF);
	    this.m_arrCmd.push("SetCTIInfo");                    this.m_arrCmdIndex.push(APSP_SetCTIInfo_CONF);
	    this.m_arrCmd.push("QueryMonitorSumInfo");           this.m_arrCmdIndex.push(APSP_QueryMonitorSumInfo_CONF);
	    this.m_arrCmd.push("SendWeiboMsg");                  this.m_arrCmdIndex.push(APSP_SendWeiboMsg_CONF);
	    this.m_arrCmd.push("SendIMMessageMsg");              this.m_arrCmdIndex.push(APSP_SendIMMessage_CONF);
	    this.m_arrCmd.push("SendWeChatMsg");                 this.m_arrCmdIndex.push(APSP_SendWeChatMsg_CONF);
	    this.m_arrCmd.push("QueryWeChatData");               this.m_arrCmdIndex.push(APSP_QueryWeChatData_CONF);
	    this.m_arrCmd.push("QueryWeChatHistory");            this.m_arrCmdIndex.push(APSP_QueryWeChatHistory_CONF);
	    this.m_arrCmd.push("UploadFileToMMS");               this.m_arrCmdIndex.push(APSP_UploadFileToMMS_CONF);
	    this.m_arrCmd.push("DownFileFromMMS");               this.m_arrCmdIndex.push(APSP_DownFileFromMMS_CONF);
	    this.m_arrCmd.push("GetWeChatParam");                this.m_arrCmdIndex.push(APSP_GetWeChatParam_CONF);
	    this.m_arrCmd.push("TransferCallQueue");             this.m_arrCmdIndex.push(APSP_TransferCallQueue_CONF);

	    this.m_arrCmd.push("ComingCall");                    this.m_arrCmdIndex.push(APSP_ComingCall_EVENT);
	    this.m_arrCmd.push("RecordFileUpLoaded");            this.m_arrCmdIndex.push(APSP_RecordFileUpLoaded_EVENT);
	    this.m_arrCmd.push("AnswerCall");                    this.m_arrCmdIndex.push(APSP_AnswerCall_EVENT);
	    this.m_arrCmd.push("OnPrompt");                      this.m_arrCmdIndex.push(APSP_OnPrompt_EVENT);
	    this.m_arrCmd.push("ReportBtnStatus");               this.m_arrCmdIndex.push(APSP_OnReportBtnStatus_EVENT);
	    this.m_arrCmd.push("OnTelephoneStatusChanged");      this.m_arrCmdIndex.push(APSP_OnTelephoneStatusChanged_EVENT);
	    this.m_arrCmd.push("OnAgentStatusChanged");          this.m_arrCmdIndex.push(APSP_OnAgentStatusChanged_EVENT);
	    this.m_arrCmd.push("OnQueueStatusChanged");          this.m_arrCmdIndex.push(APSP_OnQueueStatusChanged_EVENT);
	    this.m_arrCmd.push("OnlockStatusReport");            this.m_arrCmdIndex.push(APSP_OnlockStatusReport_EVENT);
	    this.m_arrCmd.push("OnInitalSuccess");               this.m_arrCmdIndex.push(APSP_OnInitalSuccess_EVENT);
	    this.m_arrCmd.push("OnShortCutKey");                 this.m_arrCmdIndex.push(APSP_OnShortCutKey_EVENT);
	    this.m_arrCmd.push("OnIVRStatusChanged");            this.m_arrCmdIndex.push(APSP_OnIVRStatusChanged_EVENT);
	    this.m_arrCmd.push("OnEventPrompt");                 this.m_arrCmdIndex.push(APSP_OnEventPrompt_EVENT);
	    this.m_arrCmd.push("OnAgentWorkReport");             this.m_arrCmdIndex.push(APSP_OnAgentWorkReport_EVENT);
	    this.m_arrCmd.push("OnInitalFailure");               this.m_arrCmdIndex.push(APSP_OnInitalFailure_EVENT);
	    this.m_arrCmd.push("OnCallEnd");                     this.m_arrCmdIndex.push(APSP_OnCallEnd_EVENT);
	    this.m_arrCmd.push("OnAgentReport");                 this.m_arrCmdIndex.push(APSP_OnAgentReport_EVENT);
	    this.m_arrCmd.push("OnIvrReport");                   this.m_arrCmdIndex.push(APSP_OnIvrReport_EVENT);
	    this.m_arrCmd.push("OnTelReport");                   this.m_arrCmdIndex.push(APSP_OnTelReport_EVENT);
	    this.m_arrCmd.push("OnServiceReport");               this.m_arrCmdIndex.push(APSP_OnServiceReport_EVENT);
	    this.m_arrCmd.push("OnTaskReport");                  this.m_arrCmdIndex.push(APSP_OnTaskReport_EVENT);
	    this.m_arrCmd.push("OutboundReport");                this.m_arrCmdIndex.push(APSP_OutboundReport_EVENT);
	    this.m_arrCmd.push("CallReportInfo");                this.m_arrCmdIndex.push(APSP_CallReportInfo_EVENT);
	    this.m_arrCmd.push("QueryMonitorSumReport");         this.m_arrCmdIndex.push(APSP_QueryMonitorSumReport_EVENT);
	    this.m_arrCmd.push("OnCallRing");                    this.m_arrCmdIndex.push(APSP_OnCallRing_EVENT);
	    this.m_arrCmd.push("OnHeatBeat");                    this.m_arrCmdIndex.push(APSP_OnHeatBeat_EVENT);	
	    this.m_arrCmd.push("OnBarExit");                     this.m_arrCmdIndex.push(APSP_OnBarExit_EVENT);	
	    this.m_arrCmd.push("OnSystemBusy");                  this.m_arrCmdIndex.push(APSP_OnSystemBusy_EVENT);	
	    this.m_arrCmd.push("OnCallQueueQuery");              this.m_arrCmdIndex.push(APSP_OnCallQueueQuery_EVENT);	
	    this.m_arrCmd.push("OnQueueReport");                 this.m_arrCmdIndex.push(APSP_OnQueueReport_EVENT);	
	    this.m_arrCmd.push("OnSystemMessage");               this.m_arrCmdIndex.push(APSP_OnSystemMessage_EVENT);	
	    this.m_arrCmd.push("OnRecvWeiboMsg");                this.m_arrCmdIndex.push(APSP_OnRecvWeiboMsg_EVENT);
	    this.m_arrCmd.push("OnIMNoticsMsg");                 this.m_arrCmdIndex.push(APSP_OnIMNoticsMsg_EVENT);
	    this.m_arrCmd.push("OnIMTextMsg");                   this.m_arrCmdIndex.push(APSP_OnIMTextMsg_EVENT);
	    this.m_arrCmd.push("OnWallServiceReport");           this.m_arrCmdIndex.push(APSP_OnWallServiceReport_EVENT);
	    this.m_arrCmd.push("OnWallQueueReport");             this.m_arrCmdIndex.push(APSP_OnWallQueueReport_EVENT);
	    this.m_arrCmd.push("OnStaticInfoReport");            this.m_arrCmdIndex.push(APSP_OnStaticInfoReport_EVENT);
	    this.m_arrCmd.push("OnRecvWeChatMsg");               this.m_arrCmdIndex.push(APSP_OnRecvWeChatMsg_EVENT);
	    this.m_arrCmd.push("OnServiceStaticReport");         this.m_arrCmdIndex.push(APSP_OnServiceStaticReport_EVENT);
	    this.m_arrCmd.push("OnAgentStaticReport");           this.m_arrCmdIndex.push(APSP_OnAgentStaticReport_EVENT);
	    this.m_arrCmd.push("OnUploadFileToMMSReport");       this.m_arrCmdIndex.push(APSP_OnUploadFileToMMSReport_EVENT);
	    this.m_arrCmd.push("OnDownloadFileToMMSReport");     this.m_arrCmdIndex.push(APSP_OnDownloadFileToMMSReport_EVENT);
	    this.m_arrCmd.push("OnSendWeChatMsgReport");         this.m_arrCmdIndex.push(APSP_OnSendWeChatMsgReport_EVENT);
		this.m_arrCmd.push("OnAQueryCTIInfo");               this.m_arrCmdIndex.push(APSP_OnAQueryCTIInfo_EVENT);
		this.m_arrCmd.push("OnAgentBusyReason");             this.m_arrCmdIndex.push(APSP_OnAgentBusyReason_EVENT);

	    this.m_arrCmd.push("OnAction");                      this.m_arrCmdIndex.push(APSP_OnAction_EVENT);	
	    this.m_arrCmd.push("OnSetDlgStatusText");            this.m_arrCmdIndex.push(APSP_OnSetDlgStatusText_EVENT);
	    this.m_arrCmd.push("OnChangeBtnSerial");             this.m_arrCmdIndex.push(APSP_OnChangeBtnSerial_EVENT);

	    this.m_arrCmd.push("Test");                          this.m_arrCmdIndex.push(APSP_Test_CONF);	
    }
    
    //

    this.GetCmdName = function GetCmdName(index){
	    for(var i=0;i<this.m_arrCmd.length;i++)
	    {
			    if(this.m_arrCmdIndex[i] == index)
				    return this.m_arrCmd[i];
	    }
	    return "";
    }
    this.GetCmdIndex = function GetCmdIndex(name)
    {
	    for(var i=0;i<this.m_arrCmd.length;i++)
	    {
			    if(this.m_arrCmd[i] == name)
				    return this.m_arrCmdIndex[i];
	    }
	    return  -1;
    }
    
    /////////////////////////////////////
  	//this._Check();
  	this._APSPInit();


}
