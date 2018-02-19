//  *****************************************************************************
//  文 件 名：	jocxctrl.js
//  作    者：  wsj
//  版    本：  1.0.0.0
//  日    期：  2014-07-15
//  文件描述：
// 		   基于websocket的电话条控件
//  说    明：
//		   基于websocket的的电话条控件
//  修改说明：
// *****************************************************************************

/////////////////////////////////////////////////////////////////////////////
var	emInitNull               = -1; //没有初始化
var	emInitParamError         =  emInitNull+1;
var	emInitSuccess            =  emInitNull+2;
var	emInitSIPError           =  emInitNull+3;
var	emInitMaccardError       =  emInitNull+4;
var	emInitCTIError           =  emInitNull+5;
var	emInitMonitorError       =  emInitNull+6;

var	emCmdLogout                  =  emInitNull+7;    //座席主动挂断    
var	emCTIDisconneted             =  emInitNull+8;    //CTI连接断开
var	emMonitorDisconneted         =  emInitNull+9;    //CTI连接断开
var	emSipDisconneted             =  emInitNull+10;   //sip注销
var	emServerDisconnected         =  emInitNull+11;   //AGENT断开连接
var	emClientDisconnected         =  emInitNull+12;   //VCCBAR断开连接
var	emExChangeAgentDisconnected  =  emInitNull+13;   //切换座席

var em_Bar_Unitial               = 0;           //
var em_Bar_Initialing            = em_Bar_Unitial+1;//
var em_Bar_Initialed             = em_Bar_Unitial+2;//
var em_Bar_Reconnecting          = em_Bar_Unitial+3;//


var	emBtnWrapUp       = 0;   //后续态   0        不可见：-1
var	emBtnSetBusy      = emBtnWrapUp+ 1;     //工作     1        不可见：-1
var	emBtnSetIdle      = emBtnWrapUp+ 2;     //空闲     2        不可见：-1
var	emBtnMakeCall     = emBtnWrapUp+ 3;     //呼出     3        不可见：-1
var	emBtnHold         = emBtnWrapUp+ 4;     //保持     4        不可见：-1
var	emBtnRetrieve     = emBtnWrapUp+ 5;     //接回     5        不可见：-1
var	emBtnEndCall      = emBtnWrapUp+ 6;     //挂断     6        不可见：-1
var	emBtnTransfer     = emBtnWrapUp+ 7;     //转移     7        不可见：-1
var	emBtnConference   = emBtnWrapUp+ 8;     //会议     8        不可见：-1
var	emBtnPickUp       = emBtnWrapUp+ 9;     //应答     9        不可见：-1
var	emBtnTransferOut  = emBtnWrapUp+10;     //转出     10        不可见：-1
var	emBtnConsult      = emBtnWrapUp+11;     //咨询     11        不可见：-1
var	emBtnSendDtmf     = emBtnWrapUp+12;     //二次拨号    12        不可见：-1
var	emBtnBridge       = emBtnWrapUp+13;     //桥接        13        不可见：-1
var	emBtnAlterNate    = emBtnWrapUp+14;     //切换        14        不可见：-
var	emBtnConfig       = emBtnWrapUp+15;     //设置     15        不可见：-1
var	emBtnForceReset   = emBtnWrapUp+16;     //强制复位 16        不可见：-1
var	emBtnRecord       = emBtnWrapUp+17;     //录音     17        不可见：-1
var	emBtnStopRecord   = emBtnWrapUp+18;     //停止录音 18        不可见：-1
var	emBtnListen       = emBtnWrapUp+19;     //监听     19        不可见：-1
var	emBtnInsert       = emBtnWrapUp+20;     //强插     20        不可见：-1
var	emBtnIntercept    = emBtnWrapUp+21;     //拦截、代答    21  不可见：-1
var	emBtnForceRelease = emBtnWrapUp+22;     //强拆          22  不可见：-1
var	emBtnBeginPlay    = emBtnWrapUp+23;     //开始放音    23  不可见：-1
var	emBtnStopPlay     = emBtnWrapUp+24;     //结束放音    24  不可见：-1
var	emBtnLock         = emBtnWrapUp+25;     //加锁        25  不可见：-1
var	emBtnUnLock       = emBtnWrapUp+26;     //解锁        26  不可见：-1
var	emBtnMute         = emBtnWrapUp+27;     //静音/取消静音 27        不可见：-1
var	emBtnCallBack     = emBtnWrapUp+28;     //重拨          28        不可见：-1
var	emBtnReCall       = emBtnWrapUp+29;     //返回          29        不可见：-1
var	emBtnHelp         = emBtnWrapUp+30;     //辅助          30        不可见：-1



// service direction
var CD_IVR_CALLIN                     = 0;         //0或空：正常呼叫
var CD_SERVRE_EXACT_CALLOUT           = 1;         //1:精确式外呼 (先呼座席、再呼用户)
var CD_PREVIEW_CALLOUT                = 2;         //2:预览式外呼
var CD_AGENT_OUTSIDE_CALLOUT          = 3;         //3:人工外呼 （CallOutside）
var CD_IVR_CALLOUT                    = 4;         //4:IVR外呼 
var CD_AGENT_INSIDE_CALLOUT           = 5;         //5:内部呼叫 （CallInside）
var CD_CONSULT_CALLOUT                = 6;         //6:咨询 
var CD_SINGLE_CALLOUT                 = 6;         //7:单步转移 
var CD_BRIDGE_CALLOUT                 = 8;         //8:桥接 
var CD_MONITOR_CALLIN                 = 9;         //9:监听 
var CD_INTERCEPT_CALLIN               = 10;         //10:拦截 
var CD_INSERT_CALLIN                  = 11;         //11:强插 
var CD_STEPBYSTEP_CALLOUT             = 12;         //12:渐进式外呼  (先呼用户、再呼座席)
var CD_FORECAST_CALLOUT               = 13;         //13:预测式外呼  (先呼用户、再呼座席)

var CD_HELP_CALLIN                   =  19;            //19:辅助

var PORT_COUNT         = 5  
var barStatus_Null = 0;                       //都没有连接

var barStatus_AgentConnecting = 5;            //正在连接agent
var barStatus_AgentConnected = 6;             //连接agent成功
var barStatus_AgentDisconnecting = 7;         //正在挂断agent
var barStatus_AgentDisconnected = 8;          //agent

var RECONNECT_AGENT_TIME_ID             =  10;
var SETAGENTSTATUS_AGENT_TIME_ID        =  12;



function JHTML5Ctrl()
{
   this.oAgentInfo = null;                    //agentInfo
   this.oApspWS  = null;                      //websocket
   this.eventCallBack = null;	 
   this.responseCallBack = null;	 
   this.oGuardCtrl    =  null;
   this._connectCount = 0;                    //连接次数  
   this._arrBtnStatus = new Array();
   this._oTimer = null;

   
	//--------------------------------------------------------------------------------------------------
	// 辅助函数
	//--------------------------------------------------------------------------------------------------
   this._load = function _load(){
		this.oAgentInfo = new  JAgentInfo();
		this.oAgentInfo.loadFromLocal();

		this.oApspWS = new JAPSPWebSocket("MacCard");
        this.oApspWS.oParent = this;
		this.oApspWS.SetMsgCallBack(this.apspCallback);

		this.oGuardCtrl = new JGuardCtrl(this.oAgentInfo._localserver,this.oAgentInfo._localGuardPort);
        this.oGuardCtrl.oParent = this;
        this.oGuardCtrl.SetCallBack(this.guardCallback);

        this._oTimer = new JTimer();
        this._oTimer.oParent = this;
        this._oTimer.SetTimerCallBack(this._OnTimerEvent);
        this._oTimer.Start();

		for(var i=0;i< emBtnHelp + 1;i++){
		    this._arrBtnStatus.push(0);
		}
		this._arrBtnStatus[emBtnWrapUp] = 1;		
		this._arrBtnStatus[emBtnConfig] = 1;		
   }
   this._IsNeedReConnected = function()
    {
        var bReturn = false;
        bReturn = bReturn || (!this.oAgentInfo._isConnected);//连接失败
        bReturn = bReturn || (!this.oAgentInfo._isInitial);//没有注册成功
        bReturn = bReturn || ( this.oAgentInfo._barStatus != em_Bar_Initialing && this.oAgentInfo._isReConnect);//重连 && 不是正在连接

        return bReturn;
    }
    this._OnTimerEvent = function(id){
       var oThis = this.oParent;
       if(id == RECONNECT_AGENT_TIME_ID){
           DisplayLog(VccBar_Log_Info,"--------ReconnectAgent-------");
           if(oThis._IsNeedReConnected())
           {
               oThis.Initial();
           }
       }
       if(id == SETAGENTSTATUS_AGENT_TIME_ID){
           oThis._oTimer.KillTimer(id);
           if(oThis.oAgentInfo._isConnected)
           {
               if(oThis.oAgentInfo._agentOldStatus == 1)
               {
                   oThis.SetBusy(0);
               }
               if(oThis.oAgentInfo._agentOldStatus == 2)
               {
                   oThis.SetIdle();
               }
               if(oThis.oAgentInfo._agentOldStatus == 4)
               {
                   oThis.SetWrapUp();
               }
           }
           oThis.oAgentInfo._agentOldStatus = -2;

       }
   }
    this._ResetBtn = function (){
		for(var i=0;i< emBtnHelp + 1;i++){
    		this._arrBtnStatus[i] = 0;		
		}
   }
    this._invokeEvent = function(cmdIndex,param){
        if(this.eventCallBack != null){
            DisplayLog(VccBar_Log_Info,"JHTML5Ctrl:_invokeEvent(cmdIndex="+cmdIndex+"  param="+param+")");
            this.eventCallBack(cmdIndex,param);
            if(cmdIndex == eventOnInitalSuccess)
            {
                this._InvokeMethod(APSP_GetConfiguration_CONF,"");
            }
        }
   }
    this._getPartenerNum = function(strParam){
        var strDN = "";
        var oParam = strParam.split("|"); 		
        switch (parseInt(oParam[5]))
        {
	        case CD_IVR_CALLIN:                  // 0或空：正常呼叫
	        case CD_SERVRE_EXACT_CALLOUT:        //1:精确式外呼
	        case CD_SINGLE_CALLOUT:              //7:单步转移 
            case CD_STEPBYSTEP_CALLOUT:          //12:渐进式外呼 
	        case CD_FORECAST_CALLOUT:            //13:预测式外呼 
	        case CD_CONSULT_CALLOUT:             //6:咨询  originalDevice存放用户号码
		        strDN = oParam[0];                //主叫  //协议中的origCallingDevice
		        break;
	        case CD_PREVIEW_CALLOUT:             //2:预览式外呼
	        case CD_AGENT_OUTSIDE_CALLOUT:       //3:人工外呼 （CallOutside）
	        case CD_AGENT_INSIDE_CALLOUT:        //5:内部呼叫 （CallInside）
	        case CD_MONITOR_CALLIN:              //9:监听 
	        case CD_INTERCEPT_CALLIN:            //10:拦截
	        case CD_INSERT_CALLIN:               //11:强插		            
		        strDN = oParam[2];               //原始被叫   //协议中的callingDevice
		        break;
	        case CD_HELP_CALLIN:                    //19:辅助
		        strDN = oParam[2];                //原始被叫   //协议中的callingDevice
		        break;
	        case CD_IVR_CALLOUT:                 //4:IVR外呼 
	        case CD_BRIDGE_CALLOUT:              //8:桥接
		        strDN = oParam[0];
		        break;
        }
    	
        return strDN;
    }
	this.connectToService = function connectToService(server,localport) {
		this.oApspWS.WSConnect(server,localport);
		var lg = getLocalLanguage();
		if(this.oAgentInfo._ctrlStatus ==  barStatus_AgentConnecting)
		{
            this._invokeEvent(eventOnWebsocketSocket,(lg == lg_zhcn )?websocket_connecting+"|正在连接电话条服务【"+server+":"+localport+"】...第【"+this._connectCount+"】次":websocket_connecting+"|connect to Maccard("+server+":"+localport+")...time:("+this._connectCount+")");
        }   
            
		this._connectCount = this._connectCount + 1;
	}
    this._InvokeMethod = function  _InvokeMethod(cmdIndex,param){
		 var  cmdName = this.oApspWS.GetCmdName(cmdIndex);
		 if( cmdName == "")
				return -1;
		if(	cmdIndex == APSP_GetLocalPort_CONF){
		    param = this.oAgentInfo._localPort+"|"+this.oAgentInfo._killMaccard;//"";
		  }
		else if(cmdIndex == APSP_Initial_CONF){
		    param = this.oAgentInfo.getInitialParam();
		  }
        DisplayLog(VccBar_Log_Info,"JHTML5Ctrl:_InvokeMethod(cmdName="+cmdName+",param="+param+")");
		return this.oApspWS.WSSendMsg(buildApspMsg(cmdName,param));
	}
	
	this.IsInitial = function(){
	    DisplayLog(VccBar_Log_Info,"JHTML5Ctrl:IsInitial("+this.oAgentInfo._isInitial+")");
	    return this.oAgentInfo._isInitial;
	}
	this.IsMethodUserFull = function(btnIndex,btnName){
    	if(this._arrBtnStatus[btnIndex] == 1)
    	    return true;
    	this._gfOnPrompt(4311,"命令["+btnName+"]不可用,无法执行!")
    	return false;		
	}
    this.ResetThisCtrl = function() {
        this.oAgentInfo._isConnected = false;
        this.oAgentInfo._isInitial = false;
        this.oAgentInfo._ctrlStatus = barStatus_Null;
        this.oAgentInfo._localPort = 4520;
        this.oAgentInfo._localGuardPort = 4510;
        this._connectCount = 0;
    }
    this.GetBtnStatuIDs = function(){
        var strResult = "";
	    for (var i = 0;i<this.oAgentInfo._arrUserBtn.length;i++) 
	    {
		    var btnID = parseInt(this.oAgentInfo._arrUserBtn[i]);
		    if(this._arrBtnStatus[btnID] == 1)
		    {
			    if(strResult == "")
				    strResult = this._arrBtnStatus[btnID];
			    else
				    strResult = strResult + "|" + this._arrBtnStatus[btnID];
		    }
	    }
        return strResult;
    }
    this.SetLogoutStatus = function(){
        this._ResetBtn();
        this._arrBtnStatus[emBtnWrapUp] = 1;		
		this._arrBtnStatus[emBtnConfig] = 1;
		this._invokeEvent(eventOnReportBtnStatus,this.GetBtnStatuIDs());
    }
    
    //提示
    this._gfOnPrompt = function(code,des) {
        if(typeof(des) == "undefined") des = "";//this.oBarControl.GetErrorItemDes(code);
        this._invokeEvent(eventOnPrompt,code + "|"+des);
    }

   
	//--------------------------------------------------------------------------------------------------
	// 电话条对外函数
	//--------------------------------------------------------------------------------------------------
	//事件回调函数
    this.attachEventfun = function attachEventfun(callbackFun){ this.eventCallBack = callbackFun;}
    //协议命令消息异步的回调函数
    this.attachResponsefun = function attachResponsefun(callbackFun){ this.responseCallBack = callbackFun;}
    //得到本对象
    this.GetBarCtrl = function GetBarCtrl(){ return this;}

    //设置属性
    this.SetCtrlAttribute = function(aName,aValue){
        //cti
        if(aName == "MainIP"){
            this.oAgentInfo._mainIP = aValue;}
        else if(aName == "BackIP"){
            this.oAgentInfo._backIP = aValue;}
        else if(aName == "MainPortID"){
            this.oAgentInfo._mainPortID = aValue;}
        else if(aName == "BackPortID"){
            this.oAgentInfo._backPortID = aValue;}
        else if(aName == "AgentID"){
            this.oAgentInfo._agentID = aValue;}
        else if(aName == "Dn"){
            this.oAgentInfo._dn = aValue;}
        else if(aName == "PassWord"){
            this.oAgentInfo._passWord = aValue;}
        else if(aName == "MediaFlag"){//MediaFlag
            this.oAgentInfo._vccId = aValue;}
        else if(aName == "PhonType"){
            this.oAgentInfo._phoneType = aValue;}
        else if(aName == "AppType"){
            this.oAgentInfo._appType = aValue;}
        //sip
        else if(aName == "SipServerIP"){
            this.oAgentInfo._sipIp = aValue;}
        else if(aName == "SipServerPort"){
            this.oAgentInfo._sipServerPort = aValue;}
        else if(aName == "SipProtocol"){
            this.oAgentInfo._sipProtocol = aValue;}
        else if(aName == "SipDn"){
            this.oAgentInfo._sipDn = aValue;}
        else if(aName == "SipAuthType"){
            //this.oAgentInfo._sipAuthType = aValue;
        }
        else if(aName == "SipDomain"){
            this.oAgentInfo._sipDomain = aValue;}
        else if(aName == "SipPassWord"){
            this.oAgentInfo._sipPassWord = aValue;}
        else if(aName == "SipBackServerIP"){
            this.oAgentInfo._sipBackIp = aValue;}
        else if(aName == "SipBackServerPort"){
            this.oAgentInfo._sipBackServerPort = aValue;}
        else if(aName == "SipBackProtocol"){
            this.oAgentInfo._sipBackProtocol = aValue;}
        else if(aName == "SipBackAuthType"){
            this.oAgentInfo._sipBackAuthType = aValue;}
        else if(aName == "SipBackDomain"){
            this.oAgentInfo._sipBackDomain = aValue;}
        else if(aName == "SipBackPassWord"){
            this.oAgentInfo._sipBackPassWord = aValue;}
        //monitor
        else if(aName == "MonitorIP"){
            this.oAgentInfo._monitorIp = aValue;}
        else if(aName == "MonitorPort"){
            this.oAgentInfo._monitorPor = aValue;}
        //setting
        else if(aName == "WeChatServer"){
            this.oAgentInfo._weChatServerIp = aValue;}
        else if(aName == "SelfPrompt"){
            this.oAgentInfo._selfPrompt = aValue;}
        else if(aName == "MinotorVersion"){
            this.oAgentInfo._minotorVersion = aValue;}
        else if(aName == "TaskID"){
            this.oAgentInfo._taskID = aValue;}
        else if(aName == "AutoUpdateURL"){
            this.oAgentInfo._autoUpdateUrl = aValue;
            if(aValue != ""){ this.CheckVesion(aValue,"check");}
        }
        else if(aName == "SipPassWdCryptType"){
            this.oAgentInfo._sipPassWdCryptType = aValue;}
        else if(aName == "PassWdCryptType"){
            this.oAgentInfo._passWdCryptType = aValue;}
        else if(aName == "AutoSelectAgent"){
            this.oAgentInfo._autoSelectAgent = aValue;}
        else if(aName == "VersionType"){
            this.oAgentInfo._versionType = aValue;}
        //no use
        else if(aName == "IsAllTimeRecord"){
            this.oAgentInfo._allTimeRecord = aValue;}
        else if(aName == "RecordType"){
            this.oAgentInfo._recordType = aValue;}
        else if(aName == "AgentName"){
            this.oAgentInfo._agentName = aValue;}
        else if(aName == "msgFlag"){
            this.oAgentInfo._msgFlag = aValue;}
        else if(aName == "AgentType"){
            this.oAgentInfo._agentType = aValue;}
        else if(aName == "LocalPort"){// this.oAgentInfo._localPort = aValue;
        }
        else if(aName == "ServiceLists"){}
        else if(aName == "TimeOut"){}
        else if(aName == "ftpServerIP"){
            this.oAgentInfo._ftpIp = aValue;}
        else if(aName == "ftpServerPort"){
            this.oAgentInfo._ftpPort = aValue;}
        else if(aName == "ftpUser"){
            this.oAgentInfo._ftpUser = aValue;}
        else if(aName == "ftpPassWord"){
            this.oAgentInfo._ftpPassWord = aValue;}
        else if(aName == "ftpDirectory"){
            this.oAgentInfo._ftpDirectory = aValue;}
        else if(aName == "forceEndProcess"){
            this.oAgentInfo._killMaccard = aValue;}
        else {
            alert("bad attribute name:"+aName)}
     }    
    this.GetCtrlAttribute = function(aName){
        //cti
        if(aName == "MainIP"){
            return this.oAgentInfo._mainIP; }
        else if(aName == "BackIP"){
            return this.oAgentInfo._backIP  ;}
        else if(aName == "MainPortID"){
            return this.oAgentInfo._mainPortID  ;}
        else if(aName == "BackPortID"){
            return this.oAgentInfo._backPortID  ;}
        else if(aName == "AgentID"){
            return this.oAgentInfo._agentID  ;}
        else if(aName == "Dn"){
            return this.oAgentInfo._dn  ;}
        else if(aName == "PassWord"){
            return this.oAgentInfo._passWord  ;}
        else if(aName == "MediaFlag"){//MediaFlag
            return this.oAgentInfo._vccId  ;}
        else if(aName == "PhonType"){
            return this.oAgentInfo._phoneType  ;}
        else if(aName == "AppType"){
            return this.oAgentInfo._appType  ;}
        //sip
        else if(aName == "SipServerIP"){
            return this.oAgentInfo._sipIp  ;}
        else if(aName == "SipServerPort"){
            return this.oAgentInfo._sipServerPort  ;}
        else if(aName == "SipProtocol"){
            return this.oAgentInfo._sipProtocol  ;}
        else if(aName == "SipDn"){
            return this.oAgentInfo._sipDn  ;}
        else if(aName == "SipAuthType"){
            return this.oAgentInfo._sipAuthType  ;}
        else if(aName == "SipDomain"){
            return this.oAgentInfo._sipDomain  ;}
        else if(aName == "SipPassWord"){
            return this.oAgentInfo._sipPassWord  ;}
        else if(aName == "SipBackServerIP"){
            return this.oAgentInfo._sipBackIp  ;}
        else if(aName == "SipBackServerPort"){
            return this.oAgentInfo._sipBackServerPort  ;}
        else if(aName == "SipBackProtocol"){
            return this.oAgentInfo._sipBackProtocol  ;}
        else if(aName == "SipBackAuthType"){
            return this.oAgentInfo._sipBackAuthType  ;}
        else if(aName == "SipBackDomain"){
            return this.oAgentInfo._sipBackDomain  ;}
        else if(aName == "SipBackPassWord"){
            return this.oAgentInfo._sipBackPassWord  ;}
        //monitor
        else if(aName == "MonitorIP"){
            return this.oAgentInfo._monitorIp  ;}
        else if(aName == "MonitorPort"){
            return this.oAgentInfo._monitorPor  ;}
        //setting
        else if(aName == "WeChatServer"){
            return this.oAgentInfo._weChatServerIp  ;}
        else if(aName == "SelfPrompt"){
            return this.oAgentInfo._selfPrompt  ;}
        else if(aName == "MinotorVersion"){
            return this.oAgentInfo._minotorVersion  ;}
        else if(aName == "TaskID"){
            return this.oAgentInfo._taskID  ;}
        else if(aName == "AutoUpdateURL"){
            return this.oAgentInfo._autoUpdateUrl  ;}
        else if(aName == "SipPassWdCryptType"){
            return this.oAgentInfo._sipPassWdCryptType  ;}
        else if(aName == "PassWdCryptType"){
            return this.oAgentInfo._passWdCryptType  ;}
        else if(aName == "AutoSelectAgent"){
            return this.oAgentInfo._autoSelectAgent  ;}
        else if(aName == "VersionType"){
            return this.oAgentInfo._versionType  ;}
        //no use
        else if(aName == "IsAllTimeRecord"){
            return this.oAgentInfo._allTimeRecord  ;}
        else if(aName == "RecordType"){
            return this.oAgentInfo._recordType  ;}
        else if(aName == "AgentName"){
            return this.oAgentInfo._agentName  ;}
        else if(aName == "msgFlag"){
            return this.oAgentInfo._msgFlag  ;}
        else if(aName == "AgentType"){
            return this.oAgentInfo._agentType  ;}
        else if(aName == "LocalPort"){
            return this.oAgentInfo._localPort  ;}
        else if(aName == "ServiceLists"){ return "";}
        else if(aName == "TimeOut"){ return ""}
        else if(aName == "ftpServerIP"){
            return this.oAgentInfo._ftpIp  ;}
        else if(aName == "ftpServerPort"){
            return this.oAgentInfo._ftpPort  ;}
        else if(aName == "ftpUser"){
            return this.oAgentInfo._ftpUser  ;}
        else if(aName == "ftpPassWord"){
            return this.oAgentInfo._ftpPassWord  ;}
        else if(aName == "ftpDirectory"){
            return this.oAgentInfo._ftpDirectory  ;}
        else {
            alert("bad attribute name:"+aName)}
     }    
	
	//--------------------------------------------------------------------------------------------------
	// 电话条核心协议（APSP）协议接口
	//--------------------------------------------------------------------------------------------------

	//base command
    this.GetBarType = function GetBarType() { return vccBarTypeHTML5; }
	this.CheckVesion = function CheckVesion(strURL,key){
	    this.oGuardCtrl.exeGuardCmd(cmd_GuardType_UpdateSetup,strURL,key);
	    return 0;
	}
	this.Initial = function Initial(){
        if(this.oAgentInfo._isConnected == true)
        {
            if(this.oAgentInfo._ctrlStatus == barStatus_AgentConnected)
            {
                if(this._IsNeedReConnected())
                {
                    this._InvokeMethod(APSP_Initial_CONF,"");
                    this.oAgentInfo._barStatus = em_Bar_Initialing;
                }
            }
            else
                return -1;
        }
        else
        {
            if(this.oAgentInfo._ctrlStatus == barStatus_Null)
            {
                this.oGuardCtrl.exeGuardCmd(cmd_GuardType_GetLocalPort,this.oAgentInfo._localPort+"|"+this.oAgentInfo._killMaccard,"");
            }
        }

	    return 0;
	}
	this.SerialBtn = function SerialBtn(btnIDS,hiddenIDS){
	    if (typeof(hiddenIDS) == "undefined") hiddenIDS = "";
	    this.oAgentInfo.InitSerialBtn(btnIDS,hiddenIDS);
	    return this._InvokeMethod(APSP_SerialBtn_CONF,GetApspParam(btnIDS));
	}
    this.GetBtnStatus = function GetBtnStatus(CallNum) {
	    if(this.IsInitial() != true)
	        return this.GetBtnStatuIDs();
        return this._InvokeMethod(APSP_GetBtnStatus_CONF,GetApspParam(CallNum));
    }
    this.Configurate = function Configurate(Params) {  
        if(typeof(Params) == "undefined") Params = "";
        var oParam = Params.split("|");
        if(oParam.length == 1 && Params == ""){        
        }
        else if(oParam.length == 5){
            this.oAgentInfo._autoAnswer = parseInt(oParam[0]);
            this.oAgentInfo._idleStatus = parseInt(oParam[1]);
            this.oAgentInfo._callIn     = parseInt(oParam[2]);
            this.oAgentInfo._warn       = parseInt(oParam[3]);
            this.oAgentInfo._sipAlert   = parseInt(oParam[4]);
        }
        else if(oParam.length == 7){
            this.oAgentInfo._autoAnswer = parseInt(oParam[0]);
            this.oAgentInfo._idleStatus = parseInt(oParam[1]);
            this.oAgentInfo._callIn     = parseInt(oParam[2]);
            this.oAgentInfo._warn       = parseInt(oParam[3]);
            this.oAgentInfo._sipAlert   = parseInt(oParam[4]);
            this.oAgentInfo._recvNs     = parseInt(oParam[5]);
            this.oAgentInfo._sendNs     = parseInt(oParam[6]);
        }
        else if(oParam.length == 10){
            this.oAgentInfo._autoAnswer = parseInt(oParam[0]);
            this.oAgentInfo._idleStatus = parseInt(oParam[1]);
            this.oAgentInfo._callIn     = parseInt(oParam[2]);
            this.oAgentInfo._warn       = parseInt(oParam[3]);
            this.oAgentInfo._sipAlert   = parseInt(oParam[4]);
            this.oAgentInfo._recvNs     = parseInt(oParam[5]);
            this.oAgentInfo._sendNs     = parseInt(oParam[6]);
            this.oAgentInfo._recvAgc    = parseInt(oParam[7]);
            this.oAgentInfo._sendAgc    = parseInt(oParam[8]);
            this.oAgentInfo._sendEc     = parseInt(oParam[9]);
        }
        else if(oParam.length == 11){
            this.oAgentInfo._autoAnswer = parseInt(oParam[0]);
            this.oAgentInfo._idleStatus = parseInt(oParam[1]);
            this.oAgentInfo._callIn     = parseInt(oParam[2]);
            this.oAgentInfo._warn       = parseInt(oParam[3]);
            this.oAgentInfo._sipAlert   = parseInt(oParam[4]);
            this.oAgentInfo._registInterVal     = parseInt(oParam[5]);
            this.oAgentInfo._vedioWnd     = parseInt(oParam[6]);
            this.oAgentInfo._bandWidth    = parseInt(oParam[7]);
            this.oAgentInfo._frameRate    = parseInt(oParam[8]);
            this.oAgentInfo._vedioFormat     = parseInt(oParam[9]);
            this.oAgentInfo._defaultIP     = oParam[10];
        }
        else if(oParam.length == 16){
            this.oAgentInfo._autoAnswer = parseInt(oParam[0]);
            this.oAgentInfo._idleStatus = parseInt(oParam[1]);
            this.oAgentInfo._callIn     = parseInt(oParam[2]);
            this.oAgentInfo._warn       = parseInt(oParam[3]);
            this.oAgentInfo._sipAlert   = parseInt(oParam[4]);
            this.oAgentInfo._registInterVal     = parseInt(oParam[5]);
            this.oAgentInfo._vedioWnd     = parseInt(oParam[6]);
            this.oAgentInfo._bandWidth    = parseInt(oParam[7]);
            this.oAgentInfo._frameRate    = parseInt(oParam[8]);
            this.oAgentInfo._vedioFormat     = parseInt(oParam[9]);
            this.oAgentInfo._defaultIP     = oParam[10];
            this.oAgentInfo._capType = parseInt(oParam[11]);
            this.oAgentInfo._minMediaPort     = parseInt(oParam[12]);
            this.oAgentInfo._maxMediaPort       = parseInt(oParam[13]);
            this.oAgentInfo._ecDelaySize   = parseInt(oParam[14]);
            this.oAgentInfo._popAlert     = parseInt(oParam[15]);
        }
        else if(oParam.length == 17){
            //自动应答(是1/否0)|挂机状态(1自动空闲/0后续态)|外呼内部号码支持内部号码(1支持/0不支持)|来电滴滴声(存在1/不存在0)|来电是否产生铃声(1是/0不存在)
            //sip重新注册时间：|是否显示视频窗口(1显示/0)|带宽(*1000)|帧率|视频格式
            //视频采集方式|指定本机IP|最小端口号|最大端口号|回声消除延时数|来电是否弹屏|是否显示子状态
            this.oAgentInfo._autoAnswer = parseInt(oParam[0]);
            this.oAgentInfo._idleStatus = parseInt(oParam[1]);
            this.oAgentInfo._callIn     = parseInt(oParam[2]);
            this.oAgentInfo._warn       = parseInt(oParam[3]);
            this.oAgentInfo._sipAlert   = parseInt(oParam[4]);
            this.oAgentInfo._registInterVal     = parseInt(oParam[5]);
            this.oAgentInfo._vedioWnd     = parseInt(oParam[6]);
            this.oAgentInfo._bandWidth    = parseInt(oParam[7]);
            this.oAgentInfo._frameRate    = parseInt(oParam[8]);
            this.oAgentInfo._vedioFormat     = parseInt(oParam[9]);
            this.oAgentInfo._defaultIP     = oParam[10];
            this.oAgentInfo._capType = parseInt(oParam[11]);
            this.oAgentInfo._minMediaPort     = parseInt(oParam[12]);
            this.oAgentInfo._maxMediaPort       = parseInt(oParam[13]);
            this.oAgentInfo._ecDelaySize   = parseInt(oParam[14]);
            this.oAgentInfo._popAlert     = parseInt(oParam[15]);
        }
        else if(oParam.length == 18){
            //自动应答(是1/否0)|挂机状态(1自动空闲/0后续态)|外呼内部号码支持内部号码(1支持/0不支持)|来电滴滴声(存在1/不存在0)|来电是否产生铃声(1是/0不存在)
            //sip重新注册时间：|是否显示视频窗口(1显示/0)|带宽(*1000)|帧率|视频格式
            //视频采集方式|指定本机IP|最小端口号|最大端口号|回声消除延时数|来电是否弹屏|是否显示子状态|sip心跳消息类型
            this.oAgentInfo._autoAnswer = parseInt(oParam[0]);
            this.oAgentInfo._idleStatus = parseInt(oParam[1]);
            this.oAgentInfo._callIn     = parseInt(oParam[2]);
            this.oAgentInfo._warn       = parseInt(oParam[3]);
            this.oAgentInfo._sipAlert   = parseInt(oParam[4]);
            this.oAgentInfo._registInterVal     = parseInt(oParam[5]);
            this.oAgentInfo._vedioWnd     = parseInt(oParam[6]);
            this.oAgentInfo._bandWidth    = parseInt(oParam[7]);
            this.oAgentInfo._frameRate    = parseInt(oParam[8]);
            this.oAgentInfo._vedioFormat     = parseInt(oParam[9]);
            this.oAgentInfo._defaultIP     = oParam[10];
            this.oAgentInfo._capType = parseInt(oParam[11]);
            this.oAgentInfo._minMediaPort     = parseInt(oParam[12]);
            this.oAgentInfo._maxMediaPort       = parseInt(oParam[13]);
            this.oAgentInfo._ecDelaySize   = parseInt(oParam[14]);
            this.oAgentInfo._popAlert     = parseInt(oParam[15]);
            this.oAgentInfo._sipHeartBeatType     = parseInt(oParam[17]);
        }
        else{
            if(	getLocalLanguage() == lg_zhcn){
                alert("Configurate设置参数不正确");
            }
            else{
                alert("bad Configurate parameter");
            }
            
            return -1;
        }
        this.oAgentInfo.saveToLocal();
        
	    if(this.IsInitial()){
	        return this._InvokeMethod(APSP_Configurate_CONF,this.oAgentInfo.getConfigParam());
	    } 
	    return -1;
    }
    this.GetConfiguration = function GetConfiguration() { 
        return this.oAgentInfo.getConfiguration();
    }
	this.UnInitial = function UnInitial(code){
	    if(this.IsInitial()){
            if(typeof(code) == "undefined") code = "0";
            this.oAgentInfo._barExitCode = code;
	        return this._InvokeMethod(APSP_UnInitial_CONF,code);
	    } 
	    return -1;
	 }  
	this.SetUIStyle = function SetUIStyle(barStyle){  
	    if(getLocalLanguage() == lg_zhcn){ alert("此方法无效");}
	    else {alert("invalidate Method")} 
	}
	this.GetVersion = function GetVersion() {
        if(this.oAgentInfo._version == "")
            this.oGuardCtrl.exeGuardCmd(cmd_GuardType_GetVersion,"","");
        return this.oAgentInfo._version;
    }
	
	//base status
	this.SetBusy = function SetBusy(subStatus){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnSetBusy,"SetBusy")){
	        return -1;
	    }
	    subStatus = getDefaultParam(subStatus);	
	    if(subStatus == "") subStatus = 0;
	    this.oAgentInfo._agentBusySubStatus = subStatus;
	    return this._InvokeMethod(APSP_SetBusy_CONF,subStatus);
	}
	this.SetIdle = function SetIdle(){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnSetIdle,"SetIdle")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_SetIdle_CONF,"");
	}
	this.SetWrapUp = function SetWrapUp(){	
	    if(this.IsMethodUserFull(emBtnSetIdle,"SetIdle") || this.IsMethodUserFull(emBtnSetBusy,"SetBusy"))
	        return this._InvokeMethod(APSP_SetWrapUp_CONF,"");
	    return -1;
	}
	this.SetCTICalloutTask = function SetCTICalloutTask(TastNum){	
	    this.oAgentInfo._taskID = TastNum;
	    return this._InvokeMethod(APSP_SetCTICalloutTask_CONF,TastNum);
	}
	this.GetCTICalloutTask = function GetCTICalloutTask(){	return this._InvokeMethod(APSP_GetCTICalloutTask_CONF,"");}
	this.GetCallData = function GetCallData(destAgentID){	return this._InvokeMethod(APSP_GetCallData_CONF,GetApspParam(destAgentID));}
	this.SetCallData = function SetCallData(destAgentID,calldata){	return this._InvokeMethod(APSP_SetCallData_CONF,GetApspParam(destAgentID,calldata));}
	this.GetTransfer = function GetTransfer(){	return this._InvokeMethod(APSP_GetTransfer_CONF,"");}
	this.SetTransfer = function SetTransfer(forwardDeviceID,forwardState,answerType){	
	    return this._InvokeMethod(APSP_SetTransfer_CONF,GetApspParam(forwardDeviceID,forwardState,answerType));}
	this.ChangeCallQueue = function ChangeCallQueue(calling,sid,orderid){ 
	    return this._InvokeMethod(APSP_ChangeCallQueue_CONF,GetApspParam(calling,sid,orderid));}
	this.GetCallID = function GetCallID(){	return this._InvokeMethod(APSP_GetCallID_CONF,"");}
	this.QuerySPGroupList = function QuerySPGroupList(groupID,agentStatus,cmdType,checkAuthor,action,interval){
	    if (typeof(cmdType) == "undefined") cmdType = "9"
	    if (typeof(checkAuthor) == "undefined") checkAuthor = "0"
	    this.oAgentInfo._realMethodName = "QuerySPGroupList";
	    return this._InvokeMethod(APSP_QueryCTIInfo_CONF,GetApspParam(cmdType,groupID,agentStatus,checkAuthor,action,interval));
	}
	this.GetCallInfo = function GetCallInfo(){	return this._InvokeMethod(APSP_GetCallInfo_CONF,"");}
	this.SetTransparentParameter = function SetTransparentParameter(transparentParam){	
	    return this._InvokeMethod(APSP_SetTransparentParameter_CONF,transparentParam);}
	this.GetAgentStatus = function GetAgentStatus(){	return this.oAgentInfo._agentStatus;}
	this.GetAgentSubBusyStatus = function GetAgentSubBusyStatus(){	
	    if( this.oAgentInfo._agentStatus == 1)
	        return this.oAgentInfo._agentBusySubStatus;
	    return -1;
	 }
	
	this.GetBusySubStatus = function GetBusySubStatus(){	return this.oAgentInfo._strBusySubStatus;}
	this.SetDisplayNumber = function SetDisplayNumber(dstNum){	
	    this.oAgentInfo._realMethodName = "SetDisplayNumber";
	    return this._InvokeMethod(APSP_SetCTIInfo_CONF,GetApspParam("8",dstNum));
	}
	this.GetDisplayNumber = function GetDisplayNumber(){	
	    this.oAgentInfo._realMethodName = "GetDisplayNumber";
	    return this._InvokeMethod(APSP_QueryCTIInfo_CONF,"21|");
	}
	this.CallQueueQuery = function CallQueueQuery(serviceID,action,interval){
        return this._InvokeMethod(APSP_CallQueueQuery_CONF,GetApspParam(serviceID,action,interval));
    }
	this.QueryGroupAgentStatus = function QueryGroupAgentStatus(groupIDs,action,interval,type){
	    this.oAgentInfo._realMethodName = "QueryGroupAgentStatus";
	    return this._InvokeMethod(APSP_QueryCTIInfo_CONF,GetApspParam("22",groupIDs,action,interval,type));
	}
	this.QueryPreViewCallOutNumbers = function QueryPreViewCallOutNumbers(serviceNum,agentID,num,realloc){	
	    this.oAgentInfo._realMethodName = "QueryPreViewCallOutNumbers";
	    return this._InvokeMethod(APSP_QueryCTIInfo_CONF,GetApspParam("23",serviceNum,agentID,num,realloc));
    }
	this.GetBase64Data = function GetBase64Data(data){	return GetBase64FromGBK(data); }
	this.GetDataFromBase64 = function GetDataFromBase64(data){	return GetGBKFromBase64(data); }
	this.SetWeChatQueueFlag = function SetWeChatQueueFlag(flag) { 
	    this.oAgentInfo._realMethodName = "SetWeChatQueueFlag";
	    return this._InvokeMethod(APSP_SetCTIInfo_CONF,GetApspParam("30",flag));
     }
	this.GetWeChatQueueFlag = function GetWeChatQueueFlag() { 
	    this.oAgentInfo._realMethodName = "GetWeChatQueueFlag";
	    return this._InvokeMethod(APSP_QueryCTIInfo_CONF,GetApspParam("30",""));
	}
	this.TransferCallQueue = function TransferCallQueue(queuekey,lTransferType,destNum) { 
	    return this._InvokeMethod(APSP_TransferCallQueue_CONF,GetApspParam(queuekey,lTransferType,destNum));
	}
	this.SetActiveService = function SetActiveService(ServiceNum){	
	    this.oAgentInfo._realMethodName = "SetActiveService";
	    return this._InvokeMethod(APSP_SetCTIInfo_CONF,GetApspParam("26",ServiceNum));
	}
	this.GetActiveService = function GetActiveService(){	
	    this.oAgentInfo._realMethodName = "GetActiveService";
	    return this._InvokeMethod(APSP_QueryCTIInfo_CONF,GetApspParam("26",""));
	}
	this.GetExitCause = function GetExitCause(){
	    return this.oAgentInfo._strExitCause;
	}
    this.SetForwardNumber = function SetForwardNumber(Num,State){
        this.oAgentInfo._realMethodName = "SetForwardNumber";
        return this._InvokeMethod(APSP_SetCTIInfo_CONF,GetApspParam("25",Num,State));
    }
    this.GetForwardNumber = function GetForwardNumber(){
        this.oAgentInfo._realMethodName = "GetForwardNumber";
        return this._InvokeMethod(APSP_QueryCTIInfo_CONF,GetApspParam("25",""));
    }
    this.SetAgentReservedStatus = function SetAgentReservedStatus(agentStatus,subBusyStatus){
        this.oAgentInfo._realMethodName = "SetAgentReservedStatus";
        return this._InvokeMethod(APSP_SetCTIInfo_CONF,GetApspParam("31",agentStatus,subBusyStatus));
    }
    this.GetAgentLogFile = function(destAgentID,urlType,uploadServer){
        this.oAgentInfo._realMethodName = "GetAgentLogFile";
        return this._InvokeMethod(APSP_SetCTIInfo_CONF,GetApspParam("32",this.oAgentInfo._agentID,destAgentID,urlType,uploadServer));
    }


    //call command
	this.MakeCall = function MakeCall(DestNum, serviceDirect, taskID, transParentParam, phoneID) {
	    if (!this.IsInitial()) {
	        return -1;
	    }
	    if (!this.IsMethodUserFull(emBtnMakeCall, "MakeCall")) {
	        return -1;
	    }
	    if (DestNum == "") {
	        this._gfOnPrompt(4312);
	        return -1;
	    }
	    DestNum = formatCallNum(DestNum);

	    if (!isPhoneNum(DestNum, true)) {
	        this._gfOnPrompt(4313);
	        return -1;
	    }
	    serviceDirect = getDefaultParam(serviceDirect);
	    if (serviceDirect == "") serviceDirect = CD_PREVIEW_CALLOUT;
	    if (typeof(taskID) == "undefined") taskID = "";
	    if (typeof(transParentParam) == "undefined") 
            transParentParam = "";
	    transParentParam = this.GetBase64Data(transParentParam);
	    if (typeof(phoneID) == "undefined") phoneID = "";
	    return this._InvokeMethod(APSP_MakeCall_CONF, GetApspParam(DestNum, serviceDirect, taskID, transParentParam, phoneID));
	}
	this.CallIn = function CallIn(DestAgentID,serviceDirect,taskID,transParentParam)	{		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnMakeCall,"CallIn")){
	        return -1;
	    }	
        serviceDirect = getDefaultParam(serviceDirect);	
        if(serviceDirect == "") serviceDirect = CD_AGENT_INSIDE_CALLOUT;
        if (typeof(taskID) == "undefined") taskID = "";
        if (typeof(transParentParam) == "undefined") transParentParam = "";
        transParentParam = this.GetBase64Data(transParentParam);
        return this._InvokeMethod(APSP_CallIn_CONF, GetApspParam(DestAgentID, serviceDirect, taskID, transParentParam));	
    }
	this.TransferOut = function TransferOut(lTransferType,DestNum){		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnTransferOut,"TransferOut")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_TransferOut_CONF,GetApspParam(lTransferType,DestNum));	
	}
	this.Hold = function Hold(){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnHold,"Hold")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_Hold_CONF,"");
	}
	this.RetrieveHold = function RetrieveHold(){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnRetrieve,"RetrieveHold")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_RetrieveHold_CONF,"");
    }
	this.Disconnect = function Disconnect(callType){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnEndCall,"Disconnect")){
	        return -1;
	    }	
        callType = getDefaultParam(callType);	
        if(callType == "") callType = 0;
        if(callType == 0){ 
            callType = 4;
        }
        else{ 
            callType = 3
        };
	    return this._InvokeMethod(APSP_Disconnect_CONF,callType);
	}
	this.Answer = function Answer(recordFlag){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnPickUp,"Answer")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_Answer_CONF,recordFlag);
	}
	this.Consult = function Consult(lConsultType,ConsultNum){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnConsult,"Consult")){
	        return -1;
	    }	
	    if(ConsultNum == "")
	    {
		    this._gfOnPrompt(4312);
		    return -1;
	    }
	    
	    if(lConsultType != 0)
	    {//0:工号 1:外部号码 2:人工服务 
		    ConsultNum = formatCallNum(ConsultNum);
		    if(!isPhoneNum(ConsultNum))
		    {
			    this._gfOnPrompt(4313);
			    return -1;
		    }
	    }
		
	    return this._InvokeMethod(APSP_Consult_CONF,GetApspParam(lConsultType,ConsultNum));	
	}
	this.Transfer = function Transfer(){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnTransfer,"Transfer")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_Transfer_CONF,"");
	}
	this.Conference = function Conference(){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnConference,"Conference")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_Conference_CONF,"");
    }
	this.SendDTMF = function SendDTMF(TapKey){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnSendDtmf,"SendDTMF")){
	        return -1;
	    }	
	 return this._InvokeMethod(APSP_SendDTMF_CONF,TapKey);
	}
	this.Bridge = function Bridge(IVRNum,bEndCall){		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnBridge,"Bridge")){
	        return -1;
	    }	
	    if(IVRNum == "")
	    {
		    this._gfOnPrompt(4312);
		    return -1;
	    }
	    return this._InvokeMethod(APSP_Bridge_CONF,GetApspParam(IVRNum,bEndCall));	
	}
	this.Mute = function Mute(flag){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnMute,"Mute")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_Mute_CONF,flag);
	}
	this.ReleaseThirdOne = function ReleaseThirdOne(retrieveCall){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnEndCall,"ReleaseThirdOne")){
	        return -1;
	    }	
	    if(typeof(retrieveCall) == "undefined") retrieveCall = 0;
	    this.oAgentInfo._retrieveCall = retrieveCall;
	    return this._InvokeMethod(APSP_ReleaseThirdOne_CONF,"");
	}
	this.ForceReset = function ForceReset(){
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnForceReset,"ForceReset")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_ForceReset_CONF,"");	
	}
	this.SendIMMessage = function SendIMMessage(destTarget0,destTarget1,destTarget2,logicOperator,msgtype,message){
    	return this._InvokeMethod(APSP_SendIMMessage_CONF,GetApspParam(destTarget0,destTarget1,destTarget2,logicOperator,msgtype,message));
    }
	this.BeginPlay = function BeginPlay(DestAgentID,destDeviceID,nType,fileName,varparam){
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnBeginPlay,"BeginPlay")){
	        return -1;
	    }	
	    strFileName = strFileName.replace(/\|/g,"【");
	    if(typeof(varparam) == "undefined" ) varparam = "";
		
	    return this._InvokeMethod(APSP_BeginPlay_CONF,GetApspParam(DestAgentID,destDeviceID,nType,fileName,varparam));
	}
	this.StopPlay = function StopPlay(DestAgentID,DestDeviceID){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnStopPlay,"StopPlay")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_StopPlay_CONF,GetApspParam(DestAgentID,DestDeviceID));
	}
	this.BeginCollect = function BeginCollect(destAgentID,destDeviceID,playType,filename,min,max,end,cel,fto,ito){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnEndCall,"BeginCollect")){
	        return -1;
	    }	
	    strFileName = strFileName.replace(/\|/g,"【");
	    return this._InvokeMethod(APSP_BeginCollect_CONF,GetApspParam(destAgentID,destDeviceID,playType,filename,min,max,end,cel,fto,ito));
	}
	this.StopCollect = function StopCollect(destAgentID,destDeviceID){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnEndCall,"StopCollect")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_StopCollect_CONF,GetApspParam(destAgentID,destDeviceID));
	}
	this.BeginRecord = function BeginRecord(destAgentID,fileName){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnRecord,"BeginRecord")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_BeginRecord_CONF,GetApspParam(destAgentID,fileName));
	}
	this.StopRecord = function StopRecord(destAgentID){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnStopRecord,"StopRecord")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_StopRecord_CONF,GetApspParam(destAgentID));
	}
	this.AlterNate = function AlterNate(destDeviceID){	
	    return 0;
	    //return this._InvokeMethod(APSP_AlterNate_CONF,GetApspParam(destDeviceID));
	}
	this.CallBack = function CallBack(){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnCallBack,"CallBack")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_CallBack_CONF,GetApspParam());
	}
	this.ReCall = function ReCall(){	
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnReCall,"ReCall")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_ReCall_CONF,GetApspParam());
	}
	this.SMMsg = function SMMsg(DestAddress,ShortMessage){	return this._InvokeMethod(APSP_SMMsg_CONF,GetApspParam(DestAddress,ShortMessage));}
	
	//质检命令
	this.ForeReleaseCall = function ForeReleaseCall(DestAgentID,type)	{		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnForceRelease,"ForeReleaseCall")){
	        return -1;
	    }	
	    if(DestAgentID == ""){
	        this._gfOnPrompt(4312);
	        return -1;
	    }
	    
	    return this._InvokeMethod(APSP_ForeReleaseCall_CONF,GetApspParam(DestAgentID,type));	
	}
	this.Insert = function Insert(DestAgentID,type,callID)	{		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnInsert,"Insert")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_Insert_CONF,GetApspParam(DestAgentID,type,callID));	
	}
	this.Listen = function Listen(DestAgentID,type,callID)	{		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnListen,"Listen")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_Listen_CONF,GetApspParam(DestAgentID,type,callID));	
	}
	this.Intercept = function Intercept(DestAgentID,type,callID)	{		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnIntercept,"Intercept")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_Intercept_CONF,GetApspParam(DestAgentID,type,callID));	
	}
	this.Help =  function Help(DestAgentID,type,callID)  {		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnHelp,"Help")){
	        return -1;
	    }	
	    return this._InvokeMethod(APSP_Help_CONF,GetApspParam(DestAgentID,type,callID));	
	}
	this.Lock =  function Lock(DestAgentID)  {		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnLock,"Lock")){
	        return -1;
	    }	
	    return this._InvokeMethod.Lock(DestAgentID);	
	}
	this.UnLock =  function UnLock(DestAgentID)  {		
	    if(!this.IsInitial()){
	        return -1;
	    }
	    if(!this.IsMethodUserFull(emBtnUnLock,"UnLock")){
	        return -1;
	    }	
	    return this._InvokeMethod.UnLock(DestAgentID);	
	}
	this.ForceIdle =  function ForceIdle(DestAgentID)  {		return this._InvokeMethod(APSP_ForceIdle_CONF,DestAgentID);	}
	this.ForceBusy =  function ForceBusy(DestAgentID)  {		return this._InvokeMethod(APSP_ForceBusy_CONF,DestAgentID);	}
	this.ForceOut =  function ForceOut(DestAgentID)  {		return this._InvokeMethod(APSP_ForceOut_CONF,DestAgentID);	}

	//监控命令
	this.InitialState =  function InitialState()  {		return this._InvokeMethod(APSP_InitialState_CONF,"");	}
	this.AgentQuery =  function AgentQuery(monitorid,curpos)  {		return this._InvokeMethod(APSP_AgentQuery_CONF,GetApspParam(monitorid,curpos));	}
	this.TelQuery =  function TelQuery(monitorid,curpos)  {		return this._InvokeMethod(APSP_TelQuery_CONF,GetApspParam(monitorid,curpos));	}
	this.IvrQuery =  function IvrQuery(monitorid,curpos)  {		return this._InvokeMethod(APSP_IvrQuery_CONF,GetApspParam(monitorid,curpos));	}
	this.ServiceQuery =  function ServiceQuery(monitorid,curpos){
        return this._InvokeMethod(APSP_ServiceQuery_CONF,GetApspParam(monitorid,curpos,""));
    }
	this.TaskQuery =  function TaskQuery(monitorid,curpos)  {		return this._InvokeMethod(APSP_TaskQuery_CONF,GetApspParam(monitorid,curpos));	}
	this.CallReportQuery =  function CallReportQuery(monitorid,curpos)  {		return this._InvokeMethod(APSP_CallReportQuery_CONF,GetApspParam(monitorid,curpos));	}
	this.GetTaskSummary =  function GetTaskSummary(monitorid,taskid)  {		return this._InvokeMethod(APSP_GetTaskSummary_CONF,GetApspParam(monitorid,taskid));	}
	this.QueryMonitorSumInfo = function QueryMonitorSumInfo(cmdName,amdParam){	
	    return this._InvokeMethod(APSP_QueryMonitorSumInfo_CONF,GetApspParam(cmdName,amdParam));}
	this.StartNotification =  function StartNotification(id,type,flag)  {		return this._InvokeMethod(APSP_StartNotification_CONF,GetApspParam(id,type,flag));	}
	this.EndNotification =  function EndNotification(id)  {		return this._InvokeMethod(APSP_EndNotification_CONF,id);	}
	
	//扩展命令
	this.SendWeiboMsg = function SendWeiboMsg(message ){	
	    return this._InvokeMethod(APSP_SendWeiboMsg_CONF,GetApspParam(message));}
	this.UploadFileToMMS = function UploadFileToMMS(fileName,userId,vccPublicId){	
	    return this._InvokeMethod(APSP_UploadFileToMMS_CONF,GetApspParam(fileName,userId,vccPublicId));}
	this.DownFileFromMMS = function DownFileFromMMS(url,userId,vccPublicId,sessionId,msgSeq){	
	    return this._InvokeMethod(APSP_DownFileFromMMS_CONF,GetApspParam(url,userId,vccPublicId,sessionId,msgSeq));}
	this.SendWeChatMsg = function SendWeChatMsg(sessionId,type,userId,vccPublicId,msgtype,content,tempURL,title,data,needMmcOpenData){	
	    content = GetBase64FromGBK(content);
	    title = GetBase64FromGBK(title);
	    data = GetBase64FromGBK(data);
	    return this._InvokeMethod(APSP_SendWeChatMsg_CONF,GetApspParam(sessionId,type,userId,vccPublicId,msgtype,content,tempURL,title,data,needMmcOpenData));
     }
	this.QueryWeChatData = function QueryWeChatData(type,userId,vccPublicId,sessionId,msgSeq,count,direction){	
	    return this._InvokeMethod(APSP_QueryWeChatData_CONF,GetApspParam(type,userId,vccPublicId,sessionId,msgSeq,count,direction));}
	this.QueryWeChatHistory = function QueryWeChatHistory(Type,userId,vccPublicId,formTime,toTime,key,curpos){	
	    return this._InvokeMethod(APSP_QueryWeChatHistory_CONF,GetApspParam(Type,userId,vccPublicId,formTime,toTime,key,curpos));}
	this.GetWeChatParam = function GetWeChatParam(userId){	
	    return this._InvokeMethod(APSP_GetWeChatParam_CONF,GetApspParam(1,userId));}

   
	//--------------------------------------------------------------------------------------------------
	// APSP协议的回调函数处理
	//--------------------------------------------------------------------------------------------------

    this.guardCallback = function guardCallback(eventIndex,param){
        var oThis = this.oParent;
        if(eventIndex == GuardEvent_WebSocket){
            oThis._invokeEvent(eventOnWebsocketSocket,param)
        }
        else if(eventIndex == GuardEvent_GetLocalPort){
            oThis.oAgentInfo._localPort = param;
            oThis.oAgentInfo._ctrlStatus = barStatus_AgentConnecting;
            oThis.connectToService(oThis.oAgentInfo._localserver,oThis.oAgentInfo._localPort);
        }
        else if(eventIndex == GuardEvent_UpdateSetup){

        }
        else if(eventIndex == GuardEvent_GetVersion){
            oThis.oAgentInfo._version = param;
        }
    }
    this.apspCallback = function apspCallback(cmdType,cmdIndex,param){        
        if(cmdType == APSP_Type_Prompt){
            this.oParent.OnWebSocketEvent(cmdIndex,param);
            return ;
        }
        DisplayLog(VccBar_Log_Info,"JHTML5Ctrl:apspCallback(cmdIndex("+this.oParent.oApspWS.GetCmdName(cmdIndex)+")="+cmdIndex+"  param="+param+")");
        
        if(cmdType == APSP_Type_Event){
            return this.oParent.ReportEvent(cmdIndex,param);
        }
        
        if(cmdType == APSP_Type_Action){
            if(cmdIndex == APSP_UnInitial_CONF)
            {
                //反初始化成功
                this.oParent.oAgentInfo._localPort = 4520;
                this.oParent.oAgentInfo._isInitial = (param == "0")?false:true;
                DisplayLog(VccBar_Log_Info,"JHTML5Ctrl:UnInitial("+this.oParent.oAgentInfo._isInitial+")");
                this.oParent.oAgentInfo._ctrlStatus = barStatus_AgentDisconnecting;
                if(this.oParent.oAgentInfo._isInitial == false)
                {
                    this.oParent.ReportEvent(eventOnBarExit,this.oParent.oAgentInfo._barExitCode +"|");
                    this.oParent.oAgentInfo._barExitCode = "0";
                }
            }
            
            return this.oParent.ReportResponse(cmdIndex,param);
        }
        
        this.oParent._invokeEvent(cmdIndex,param);        
   }
    //socket状态处理返回值
    this.OnWebSocketEvent = function (cmdIndex,param){
        if(cmdIndex == APSP_WebSocket_Event)
        {//WebSocket 事件处理
            var code = parseInt(param);
            if( code == websocket_connected)
            {//连接websocket 成功

                if(this.oAgentInfo._ctrlStatus == barStatus_AgentConnecting)
                {
                    this.oAgentInfo._ctrlStatus = barStatus_AgentConnected;
                    this.oAgentInfo._isConnected = true;
                    this._invokeEvent(eventOnWebsocketSocket,websocket_connected+"|连接电话条服务成功!");
                    this.Initial();
                }
            }
            else if( code == websocket_remoteserver_disconnected)
            {////远程服务器退出
                if(this.oAgentInfo._ctrlStatus == barStatus_AgentConnecting)
                {
                    if(this._connectCount < PORT_COUNT)
                    {
                        this.oAgentInfo._localPort = this.oAgentInfo._localPort;
                        this.connectToService(this.oAgentInfo._localserver,this.oAgentInfo._localPort);
                    }
                    else
                    {
                        this.ResetThisCtrl();
                        this._invokeEvent(eventOnWebsocketSocket,websocket_remoteserver_disconnected+"|和电话条服务之间连接断开！");
                    }
                }
                else if(this.oAgentInfo._ctrlStatus == barStatus_AgentConnected)
                {//重连
                    //this._invokeEvent(eventOnWebsocketSocket,"断开了-----");
                }
            }
            else if(code == websocket_closed)
            {//主动挂断,连接电话条服务
                if(this.oAgentInfo._ctrlStatus == barStatus_AgentDisconnecting)
                {
                    this._invokeEvent(eventOnWebsocketSocket,websocket_closed+"|断开电话条服务成功!");
                    if(this.oAgentInfo._isInitial == true)
                    {
                        this.ReportEvent(eventOnBarExit,this.oAgentInfo._barExitCode+"|");
                        this.oAgentInfo._barExitCode = "0";
                    }
                    this.ResetThisCtrl();
                }
                else if(this.oAgentInfo._ctrlStatus == barStatus_AgentConnected)
                {//电话条重连
                    if(this.oAgentInfo._isInitial ){
                        if(this.oAgentInfo._barStatus  == em_Bar_Initialing && this.oAgentInfo._isReConnect== 1)
                            return;

                        this.oAgentInfo._barStatus = em_Bar_Reconnecting;
                        this._connectCount = 0;
                        this.oAgentInfo._isConnected = false;
                        this.oAgentInfo._ctrlStatus = barStatus_Null;
                        this.oAgentInfo._isReConnect = 1;
                        this.oAgentInfo._agentOldStatus = this.GetAgentStatus();
                        DisplayLog(VccBar_Log_Info,"ReconnectMaccard");
                        this._oTimer.SetTimer(RECONNECT_AGENT_TIME_ID, 5000);
                    }
                    else{
                        this.ResetThisCtrl();
                    }
                }
            }
        }
    }
    //方法的返回值
    this.ReportResponse = function(cmdIndex,param){
        if(this.responseCallBack != null)
        {  
            if( cmdIndex == APSP_SetBusy_CONF)
            {
                if(param == "0"){
                    this.oAgentInfo._agentBusySubStatus_old = this.oAgentInfo._agentBusySubStatus;
                }
                else{
                    this.oAgentInfo._agentBusySubStatus = this.oAgentInfo._agentBusySubStatus_old;
                }
            }  
            if( cmdIndex == APSP_GetConfiguration_CONF)
            {
                var oParam = param.split("|");
                this.oAgentInfo._autoAnswer = parseInt(oParam[0]);
                this.oAgentInfo._idleStatus = parseInt(oParam[1]);
                this.oAgentInfo._callIn     = parseInt(oParam[2]);
                this.oAgentInfo._warn       = parseInt(oParam[3]);
                this.oAgentInfo._sipAlert   = parseInt(oParam[4]);
                this.oAgentInfo._registInterVal     = parseInt(oParam[5]);
                this.oAgentInfo._vedioWnd     = parseInt(oParam[6]);
                this.oAgentInfo._bandWidth    = parseInt(oParam[7]);
                this.oAgentInfo._frameRate    = parseInt(oParam[8]);
                this.oAgentInfo._vedioFormat     = parseInt(oParam[9]);
                this.oAgentInfo._capType     = parseInt(oParam[10]);
                this.oAgentInfo._defaultIP     = oParam[11];
                return ;
            }
            if( cmdIndex == APSP_GetConfiguration_CONF){
                if(this.oAgentInfo._barStatus == em_Bar_Initialing)
                {
                    if(param != "0") {
                        this.oAgentInfo._barStatus == em_Bar_Unitial;
                    }
                    if(param == "-2"){
                        alert("版本安装不正确，请重新更新电话条版本!");
                    }
                }
            }
            
            if( cmdIndex == APSP_SetCTIInfo_CONF || cmdIndex == APSP_QueryCTIInfo_CONF)
            {
                this.responseCallBack(this.oAgentInfo._realMethodName,param);   
            }
            else
            {
                this.responseCallBack(this.oApspWS.GetCmdName(cmdIndex),param);
            }
        }
   }
    //事件返回函数
    this.ReportEvent = function ReportEvent(cmdIndex, param) {
       var destParam = param;
       var oParam = param.split("|");

       switch (cmdIndex) {
           case APSP_ComingCall_EVENT:
               {
                   cmdIndex = eventOnCallRing;
                   var strUserDn = this._getPartenerNum(param);
                   var strOpAgentID = "";
                   var strRingTime = "";
                   if(oParam.length >14)
                       strOpAgentID = oParam[14];
                   if(oParam.length >15)
                       strRingTime = oParam[15];
                   var callData = GetGBKFromBase64(oParam[3]);
                   destParam = oParam[0] + "|" + oParam[1] + "|" + oParam[2] + "|" + callData + "|" + oParam[4] + "|" + oParam[5] + "|" + oParam[6] + "|" + oParam[7] + "|" + oParam[8];
                   destParam = destParam + "|" + strUserDn + "|" + this.oAgentInfo._dn + "|" + oParam[9] + "|" + oParam[11] + "|" + oParam[12] + "|" + oParam[13]+ "|" + strOpAgentID+"|"+strRingTime;
               }
               break;
           case APSP_AnswerCall_EVENT:
               cmdIndex = eventOnAnswerCall;
               break;
           case APSP_OnCallEnd_EVENT:
               cmdIndex = eventOnCallEnd;
               this.oAgentInfo._retrieveCall = 0;
               break;

           case APSP_OnPrompt_EVENT:
               {
                   cmdIndex = eventOnPrompt;
                   var code = parseInt(oParam[0]);
                   destParam = code + "|" ;//+ this.oBarControl.GetErrorItemDes(code);
                   switch (code) {
                       case 4002:
                           break;
                       case 4604:
                           break;
                       case 4011:
                       case 4005:
                           this.SetLogoutStatus();
                           break;
                       case 4303://CTI服务器断开,请与管理员联系!CTIDisconnected
                       case 4008:  //CTIDisconnected + calling
                       {
                           var bOptimisedReconnect = (oParam[1] == "1");
                           if(this.oAgentInfo._barStatus  == em_Bar_Initialing && this.oAgentInfo._isReConnect== 1)
                                return;
                           this.oAgentInfo._barStatus = em_Bar_Reconnecting;
                           this.oAgentInfo._isReConnect = 1;
                           this.oAgentInfo._agentOldStatus = this.GetAgentStatus();
                           if(bOptimisedReconnect)
                           {
                               DisplayLog(VccBar_Log_Info,"ReconnectMaccard");
                               this._oTimer.SetTimer(RECONNECT_AGENT_TIME_ID, 5000);
                           }

                           break;
                       }
                       case 4009://心跳检测到CTI中座席已经退出!
                       case 4305: //别人替换:OnSignOuted
                       case 4404: //OnForceOut
                           {
                               break;
                           }
                   }
                  //
               }
               break;
           case APSP_OnReportBtnStatus_EVENT:
               {
                   cmdIndex = eventOnReportBtnStatus;
                   var oBtnParam = param.split("@");
                   if(oBtnParam.length == 2){
                       param = oBtnParam[0];
                       this.oAgentInfo._agentStatus = parseInt(oBtnParam[1]);
                       oParam = param.split("|");
                   }
                   this._ResetBtn();
                   var strBtn = "";
                   for (var i = 0; i < oParam.length; i++) {
                       var id = oParam[i];
                       var index = parseInt(id);
                       if (index >= 100) {
                           this.oAgentInfo._agentStatus = index - 100;
                           id = "0";
                       }
                       else {
                           this._arrBtnStatus[index] = 1;
                       }
                       if (strBtn == "")
                           strBtn = id;
                       else
                           strBtn = strBtn + "|" + id;
                   }
                   destParam = strBtn;
               }
               break;
           case APSP_OnInitalSuccess_EVENT:
               {
                   cmdIndex = eventOnInitalSuccess;
                   if (param.lastIndexOf("@") > 0) {
                       var op = param.split("@");
                       if (op.length == 2) {
                           this.oAgentInfo.phoneType = parseInt(op[1]);
                           param = op[0];
                       }
                       else if (op.length == 3) {
                           this.oAgentInfo.phoneType = parseInt(op[1]);
                           param = op[0];
                           this.oAgentInfo._strExitCause = op[2];
                       }
                   }
                   this.oAgentInfo._strBusySubStatus = param;
                   this.oAgentInfo._barStatus = em_Bar_Initialed;
                   this.oAgentInfo._isReConnect = 0;
                   if(this.oAgentInfo._isInitial == false)
                   {
                       this.oAgentInfo._isInitial = true;
                   }
                   else{

                       this._oTimer.KillTimer(RECONNECT_AGENT_TIME_ID);
                       DisplayLog(VccBar_Log_Info,"--- Kill Reconnect  Timer  ----");
                       if(this.oAgentInfo._agentOldStatus == this.GetAgentStatus())
                       {
                           this._oTimer.SetTimer(SETAGENTSTATUS_AGENT_TIME_ID,1000);
                       }
                       return ;
                   }
               }
               break;
           case APSP_OnInitalFailure_EVENT:
               {
                   cmdIndex = eventOnInitalFailure;
                   if (parseInt(oParam[0]) == emCmdLogout) {
                       this.oAgentInfo._isInitial = false;

                   }
                   if(this.oAgentInfo._isReConnect)
                   {
                       this.oAgentInfo._barStatus = em_Bar_Unitial;
                       return ;
                   }
               }
               break;
           case APSP_OnEventPrompt_EVENT:
               cmdIndex = eventOnEventPrompt;
               if (parseInt(oParam[0]) == 108) {//eventidOnStopCollectSuccess
                   this._invokeEvent(eventOnCallDataChanged, oParam[1]);
               }
               break;
           case APSP_OnAgentWorkReport_EVENT:
               cmdIndex = eventOnAgentWorkReport;
               if (parseInt(oParam[0]) == 14) {//emPhoneHold
                   if (this.oAgentInfo._retrieveCall == 1) {
                       this.RetrieveHold();
                       this.oAgentInfo._retrieveCall = 0;
                   }
               }
               else if (parseInt(oParam[0]) == -1) {
                 //  this.oAgentInfo._ctrlStatus = barStatus_AgentDisconnecting;
                 //  this.oApspWS.WSDisconnect();
               }
               break;
           case APSP_OnBarExit_EVENT:
              {
                  this.oAgentInfo._isInitial = false;
                  if(this.oAgentInfo._isReConnect == 1){
                      this._oTimer.KillTimer(RECONNECT_AGENT_TIME_ID);
                      this.oAgentInfo._isReConnect = 0;
                  }
                  cmdIndex = eventOnBarExit;
              }
               break;
           case APSP_OnSystemBusy_EVENT:
               break;
           case APSP_OnCallQueueQuery_EVENT:
               cmdIndex = eventOnCallQueueQuery;
               break;
           case APSP_OnQueueReport_EVENT:
               cmdIndex = eventOnQueueReport;
               break;
           case APSP_OnSystemMessage_EVENT:
               {
                   oParam = param.split(",");
                   if (oParam.length == 2) {
                       var ntype = parseInt(oParam[0]);
                       switch (ntype) {
                           case 1: //1、随路数据发生改变时，向座席触发
                               cmdIndex = eventOnCallDataChanged;
                               destParam = GetGBKFromBase64(oParam[1]);
                               break;
                           case 2:
                               cmdIndex = eventOnSystemMessage;
                               destParam = "2|" + oParam[1];
                               break;
                           case 5:
                           {
                               //0000101000056603|0000101000056603|0|192.168.2.136:8089|cincc_0000101000056603_20160513_165554.zip|358|201 Created
                               cmdIndex = eventOnAgentLogUploadReport;
                               destParam = GetGBKFromBase64(oParam[1]);
                               var oDataParam = destParam.split("|");
                               if(oDataParam.length != 7)
                                    return;
                               destParam = oDataParam[1]+"|"+oDataParam[2]+"|"+oDataParam[3]+"|"+oDataParam[4]+"|"+oDataParam[5]+"|"+oDataParam[6];
                               break;
                           }
                           case 22: //1、异步查询指定组的座席情况 sysMessage@formatMessage
                               cmdIndex = eventOnQueryGroupAgentStatus;
                               destParam = oParam[1];
                               break;
                       }
                   }
               }
               break;
           case APSP_OnRecvWeiboMsg_EVENT:
               cmdIndex = eventOnRecvWeiboMsg;
               break;
           case APSP_OnIMNoticsMsg_EVENT:
               cmdIndex = eventOnIMMessage;
               destParam = "0|" + destParam;
               break;
           case APSP_OnIMTextMsg_EVENT:
               cmdIndex = eventOnIMMessage;
               destParam = "1|" + destParam;
               break;
           case APSP_OnAction_EVENT:
               cmdIndex = eventOnPrompt;
               this.oAgentInfo._allTimeRecord = parseInt(oParam[1]);
               //接通并录音   接通并不录音
               return;
           case APSP_OnSetDlgStatusText_EVENT:
               //cmdIndex = eventOnPrompt;
               break;
           case APSP_OnChangeBtnSerial_EVENT:
               //cmdIndex = eventOnPrompt;
               break;
           case APSP_OnTaskReport_EVENT:
               cmdIndex = eventOnTaskReport;
               break;
           case APSP_CallReportInfo_EVENT:
               cmdIndex = eventCallReportInfo;
               break;
           case APSP_QueryMonitorSumReport_EVENT:
               cmdIndex = eventQueryMonitorSumReport;
               break;
           case APSP_OutboundReport_EVENT:
               cmdIndex = eventOutboundReport;
               break;
           case APSP_OnAgentReport_EVENT:
               cmdIndex = eventOnAgentReport;
               break;
           case APSP_OnIvrReport_EVENT:
               cmdIndex = eventOnIvrReport;
               break;
           case APSP_OnTelReport_EVENT:
               cmdIndex = eventOnTelReport;
               break;
           case APSP_OnServiceReport_EVENT:
               cmdIndex = eventOnServiceReport;
               break;
           case APSP_OnWallServiceReport_EVENT:
               cmdIndex = eventOnWallServiceReport;
               break;
           case APSP_OnWallQueueReport_EVENT:
               cmdIndex = eventOnWallQueueReport;
               break;
           case APSP_OnStaticInfoReport_EVENT:
               cmdIndex = eventOnWorkStaticInfoReport;
               break;
           case APSP_OnServiceStaticReport_EVENT:
               cmdIndex = eventOnServiceStaticReport;
               break;
           case APSP_OnAgentStaticReport_EVENT:
               cmdIndex = eventOnAgentStaticReport;
               break;
           case APSP_OnRecvWeChatMsg_EVENT:
               {
                   destParam = oParam[0] + "|" + oParam[1] + "|" + oParam[2] + "|" + oParam[3] + "|" + oParam[4] + "|" + oParam[5] + "|" + GetGBKFromBase64(oParam[6]) + "|" + oParam[7] + "|" + oParam[8];
                   destParam = destParam + "|" + oParam[9] + "|" + oParam[10] + "|" + GetGBKFromBase64(oParam[11]) + "|" + GetGBKFromBase64(oParam[12]) + "|" + oParam[13];
               }
               cmdIndex = eventOnRecvWeChatMessage;
               break;
           case APSP_OnUploadFileToMMSReport_EVENT:
               cmdIndex = eventOnUploadFileToMMSReport;
               break;
           case APSP_OnDownloadFileToMMSReport_EVENT:
               cmdIndex = eventOnDownloadFileToMMSReport;
               break;
           case APSP_OnSendWeChatMsgReport_EVENT:
               cmdIndex = eventOnSendWeChatMsgReport;
               break;
           case APSP_OnAQueryCTIInfo_EVENT:
           {
               var cType = getSubString(param,"","|");
               if(cType == "8"||cType == "9"||cType == "10"){
                   cmdIndex = eventOnAQueryCTIInfoReport;
               }
               else
                    return ;
           }
               break;
           case APSP_OnAgentBusyReason_EVENT:
               cmdIndex = eventOnAgentBusyReasonReport;
               break;
           default:
               break;
       }
       this._invokeEvent(cmdIndex, destParam);
   }
   
    this._load();
}

//------------------------------------------
// 座席属性信息保存
//------------------------------------------
function  JAgentInfo(){
	this._agentID = "";
	this._passWord="111111";                  //4-8
    this._agentType=0;
    this._agentName="";
    this._mainIP="";
    this._backIP="";
    this._mainPortID=14800;
    this._backPortID=14800;
    this._dn = "";                            //4-12
	this._vccId="";                           //集团号
    this._version = "";     //版本号（web版本号+电话条版本号）
    this._passWdCryptType = 0;       //0:明码 1：MD5加密

	this._isConnected = false;
	this._isInitial = false;
    this._barStatus = em_Bar_Unitial;
    this._isReConnect = 0;                    //0：common  1:Reconnect

	this._idleStatus = 0;                     // 0表示人工，1表示自动
	this._autoAnswer = 0;                     //
	this._autoSelectAgent = false;

	//20080331
	this._callIn = 0;                         //内呼
	this._warn = 0;                           //告警
	this._sipAlert = 1;                       //SIP是否振铃
	this._registInterVal = 3;                 //SIP心跳保持时间
	this._ecDelaySize = 0;                    //回声消除延时包数（不用）
	this._fAudioGain = 1;                     //增益系数（不用）
	this._popAlert = 0;                       //来电是否弹窗提示
	this._setBusySupport0 = 0;

	this._vedioWnd = 0;
	this._bandWidth = 192;
	this._frameRate=30;
	this._vedioFormat=2;
	this._capType = 0;                        //0 :camra  1: windows
	this._defaultIP = "";

	this._recordType;
	
	this._phoneType = 1;                     //0:内置座席卡 1：内置Sip电话 2：外置其他终端；3：远程sip电话;4：软交换前传号码; 5：yealink话机 6：agora
	this._allTimeRecord = 0;                 //0：服务器不录1：服务器全程录音2：客户端不录3：客户端全程录音
	
	this._ftpIp="";
	this._ftpPort=0;
	this._ftpUser="";
	this._ftpPassWord="";
	this._ftpDirectory="";
	this._localDirectory="";

	this._sipDn="";                          //默认为空，使用DN向SIP服务器注册
	this._sipIp="";
	this._sipServerPort = 5060;
	this._sipProtocol="udp";
	this._sipPassWord="111111";
	this._sipDomain="";
	this._sipAuthType=1;                    // 0-NO   1-DEGEST
	this._sipPassWdCryptType = 0;           //0 sipdn不加密 1 Des加密

	this._sipBackIp="";
	this._sipBackServerPort=5060;
	this._sipBackProtocol="udp";
	this._sipBackPassWord="111111";
	this._sipBackDomain="";
	this._sipBackAuthType=1;                // 0-NO   1-DEGEST

	this._selfPrompt;                       //1：控件自己提示：0：外部提示

	this._monitorIp="";
	this._monitorPor =4502;
	this._monitorBackIp="";
	this._monitorBackPort=4502;
	this._msgFlag="";                       //老版本，组号 
	this._appType=0;                        //应用类型；Agent 0 Monitor 1  agent+minitor 2
	this._minotorVersion="";                //监控版本号：MinotorVersion
	this._taskID="";
	this._autoUpdateUrl="";
	this._barStyle="";
	this._barPath="";

	this._weChatServerIp="";

	this._configDialogFlag="";

	this._isSipRegisted=false;
	this._minMediaPort = 20000;
	this._maxMediaPort = 40000;

	this._recvAgc = 1;
	this._recvNs = 0;
	this._sendAgc = 1;
	this._sendEc = 1;
	this._sendNs = 0;
    this._sipHeartBeatType = 0;    //0:\r\n 1:options
	this._updating = false;
	this._btnIDS = "0,1,2,3,4,5,6,7,8,9,10,11,12,13,15,16";	
	this._btnMaskIDS = "";
	
	//辅助变量
	this._localserver = "127.0.0.1";
    this._localPort = 4520;
    this._localGuardPort = 4510;
    this._ctrlStatus = barStatus_Null;  
    //
    this._agentStatus        = 0;             //0：未登录  1：忙碌  2：空闲  3：通话中  4：后续态
    this._agentBusySubStatus = 0;             //子状态
    this._agentBusySubStatus_old = 0;         //子状态
    this._strBusySubStatus = "";              //子状态内容
    this._strExitCause = "";
    this._barExitCode = "0";
    
    this._retrieveCall = 0;
    this._realMethodName = "";
    this._killMaccard = 0;
    this._versionType = 0;//0：专业版 1:教育版
    this._agentOldStatus = -2;

    this._arrUserBtn = this._btnIDS.split(",");
    
	this.InitSerialBtn = function(btnIDS,hiddenIDS){
	     this._btnIDS = btnIDS;
	     this._btnMaskIDS = hiddenIDS;	     
	     this._arrUserBtn = this._btnIDS.split(","); 	
	}
	this.getInitialParam = function(){
		var arr = new Array(38);
		//  1-2   phoneType|appType 2
		arr[0] = this._phoneType;
		arr[1] = this._appType;
		//3.ctiip|ctiport|ctibkip|ctibkport|ctiagentID|ctivccID|ctipassword  7
		arr[2] = this._mainIP;
		arr[3] = this._mainPortID;
		arr[4] = this._backIP;
		arr[5] = this._mainPortID;
		arr[6] = this._agentID;
		arr[7] = this._vccId;
		arr[8] = this._passWord;
		//10.monitorip|monitorport|monitorbkip|monitorbkport     4
		arr[9] = this._monitorIp;
		arr[10] = this._monitorPor;
		arr[11] = this._monitorBackIp;
		arr[12] = this._monitorBackPort;
		//14.sipip|sipport|sipprotocol|sipdn|sipdomain|sippassword|sipauthtype 7
		arr[13] = this._sipIp;
		arr[14] = this._sipServerPort;
		arr[15] = this._sipProtocol;
		arr[16] = this._dn;
		arr[17] = this._sipDomain;
		arr[18] = this._sipPassWord;
		arr[19] = this._sipAuthType;
		//21.sipbackip|sipbackport|sipbackprotocol|sipbackdomain|sipbackpassword|sipbackauthtype 6
		arr[20] = this._sipBackIp;
		arr[21] = this._sipBackServerPort;
		arr[22] = this._sipBackProtocol;
		arr[23] = this._sipBackDomain;
		arr[24] = this._sipBackPassWord;
		arr[25] = this._sipBackAuthType;
		//27.btnIDS|SendHandle|RecvHandle|TaskID   4
		arr[26] = this._btnIDS;
		arr[27] = 0;
		arr[28] = 0;
		arr[29] = this._taskID;
		//31.ftpip|ftpport|ftpuser|ftppwd|ftpDir|sipDn|wecharServer|sippasswdcrypttype|passwdcrypttype|versionType|connectType  7+4
		arr[30] = this._ftpIp;
		arr[31] = this._ftpPort;
		arr[32] = this._ftpUser;
		arr[33] = this._ftpPassWord;
		arr[34] = this._ftpDirectory;
		arr[35] = this._sipDn;
		arr[36] = this._weChatServerIp;
		arr[37] = this._sipPassWdCryptType;
        arr[38] = this._passWdCryptType;
        arr[39] = this._versionType;
        arr[40] = this._isReConnect;
		return arr.join("|");
	}
	this.getIntCookieValue = function(strName,defaultValue){
	    var strValue = getCookie(strName);
	    if(strValue == "")
	        return defaultValue;
	    return parseInt(strValue);
	}
	this.loadFromLocal = function(){
	    this._autoAnswer = this.getIntCookieValue("AutoAnswer",0);
        this._idleStatus = this.getIntCookieValue("AutoIdle",0);
        this._callIn = this.getIntCookieValue("CallIn",0);
        this._warn = this.getIntCookieValue("Warn",0);
        this._sipAlert = this.getIntCookieValue("SipAlert",1);
        this._registInterVal = this.getIntCookieValue("RegistInterval",3);
        this._vedioWnd = this.getIntCookieValue("VedioWnd",0);
        this._bandWidth = this.getIntCookieValue("BandWidth",192);
        this._frameRate = this.getIntCookieValue("FrameRate",30);
        this._vedioFormat = this.getIntCookieValue("VedioFormat",2);
        this._capType = this.getIntCookieValue("CapType",0);
        this._defaultIP = getCookie("DefaultIP");
        this._minMediaPort = this.getIntCookieValue("MinMediaPort",20000);
        this._maxMediaPort = this.getIntCookieValue("MaxMediaPort",40000);
        this._ecDelaySize = this.getIntCookieValue("EchoCancelDelay",0);
        this._fAudioGain = this.getIntCookieValue("AudioGain",1);
        this._popAlert = this.getIntCookieValue("PopAlert",0);
        this._setBusySupport0 = this.getIntCookieValue("SetBusySupport0",0);

        this._recvAgc = this.getIntCookieValue("RecvAgc",1);
        this._recvNs = this.getIntCookieValue("RecvNs",0);
        this._sendAgc = this.getIntCookieValue("SendAgc",1);
        this._sendEc = this.getIntCookieValue("SendEc",1);
        this._sendNs = this.getIntCookieValue("SendNs",0);
        this._sipHeartBeatType = this.getIntCookieValue("SipHeartBearType",0);
	}
	
	this.saveToLocal = function(){
        setCookie("AutoAnswer",this._autoAnswer,365);
        setCookie("AutoIdle",this._idleStatus,365);
        setCookie("CallIn",this._callIn,365);
        setCookie("Warn",this._warn,365);
        setCookie("SipAlert",this._sipAlert,365);
        setCookie("RegistInterval",this._registInterVal,365);
        setCookie("VedioWnd",this._vedioWnd,365);
        setCookie("BandWidth",this._bandWidth,365);
        setCookie("FrameRate",this._frameRate,365);
        setCookie("VedioFormat",this._vedioFormat,365);
        setCookie("CapType",this._capType,365);
        setCookie("DefaultIP",this._defaultIP,365);
        setCookie("MinMediaPort",this._minMediaPort,365);
        setCookie("MaxMediaPort",this._maxMediaPort,365);
        setCookie("EchoCancelDelay",this._ecDelaySize,365);
        setCookie("AudioGain",this._fAudioGain,365);
        setCookie("PopAlert",this._popAlert,365);
        setCookie("SetBusySupport0",this._setBusySupport0,365);

        setCookie("RecvAgc",this._recvAgc,365);
        setCookie("RecvNs",this._recvNs,365);
        setCookie("SendAgc",this._sendAgc,365);
        setCookie("SendEc",this._sendEc,365);
        setCookie("SipHeartBearType",this._sipHeartBeatType,365);
	}
	this.getConfigParam = function(){
		var arr = new Array(21);
	    //AutoAnswer|IdleStatus|bCallIn|bWarn|bSipAlert    5
	    arr[0] = this._autoAnswer;
	    arr[1] = this._idleStatus;
	    arr[2] = this._callIn;
	    arr[3] = this._warn;
	    arr[4] = this._sipAlert;
	    //nRegistInterVal|bVedioWnd|bandWidth|frameRate|vedioFormat  5
	    arr[5] = this._registInterVal;
	    arr[6] = this._vedioWnd;
	    arr[7] = this._bandWidth;
	    arr[8] = this._frameRate;
	    arr[9] = this._vedioFormat;
	    //capType|m_strDefaultIP|minMediaPort|maxMediaPort|ecDelaySize|fAudioGain  6
	    arr[10] = this._capType;
	    arr[11] = this._defaultIP;
	    arr[12] = this._minMediaPort;
	    arr[13] = this._maxMediaPort;
	    arr[14] = this._ecDelaySize;
	    arr[15] = this._fAudioGain;
	    //recvAgc|recvNs|sendAgc|sendEc|sendNs|sipheartBeatType  5
	    arr[16] = this._recvAgc;
	    arr[17] = this._recvNs;
	    arr[18] = this._sendAgc;
	    arr[19] = this._sendEc;
	    arr[20] = this._sendNs;
        arr[21] = this._sipHeartBeatType;
		return arr.join("|");
	}
	this.getConfiguration = function(){
		var arr = new Array(12);
	    //AutoAnswer|IdleStatus|bCallIn|bWarn|bSipAlert    5
	    arr[0] = this._autoAnswer;
	    arr[1] = this._idleStatus;
	    arr[2] = this._callIn;
	    arr[3] = this._warn;
	    arr[4] = this._sipAlert;
	    //nRegistInterVal|bVedioWnd|bandWidth|frameRate|vedioFormat  5
	    arr[5] = this._registInterVal;
	    arr[6] = this._vedioWnd;
	    arr[7] = this._bandWidth;
	    arr[8] = this._frameRate;
	    arr[9] = this._vedioFormat;
	    //capType|m_strDefaultIP      2
	    arr[10] = this._capType;
	    arr[11] = this._defaultIP;
		return arr.join("|");
	}
}

//------------------------------------------
// 自动更新
//------------------------------------------

var barStatus_GuardConnecting = 1;            //正在连接guard
var barStatus_GuardConnected = 2;             //连接guard成功
var barStatus_GuardDisconnecting = 3;         //正在挂断guard
var barStatus_GuardDisconnected = 4;          //挂断guard成功


var cmd_GuardType_Null         = -1;
var cmd_GuardType_GetLocalPort = 0;
var cmd_GuardType_UpdateSetup  = 1;
var cmd_GuardType_GetVersion   = 2;

var GuardEvent_WebSocket        = 0;
var GuardEvent_GetLocalPort     = 1;
var GuardEvent_UpdateSetup      = 2;
var GuardEvent_GetVersion        = 3;

function JGuardCtrl(localGuardIP,localGuardPort){

    this._oGuradWS  = null;                      //websocket
    this._ctrlStatus = barStatus_Null;
    this._connectCount = 0;
    //this._oParent = oParent;
    this._cmdType = cmd_GuardType_Null;
    this._callBack  = null;
    this._cmdParam1 = "";
    this._cmdParam2 = "";
    this._localGuardIP = localGuardIP;
    this._localGuardPort = localGuardPort;


    this._Create = function(){
        this._oGuradWS    = new  JAPSPWebSocket("CINGuard");
        this._oGuradWS.SetMsgCallBack(this.apspCallbackGurad);
        this._oGuradWS.oParent = this;
    }
    this._ConnectToService = function (server,localport) {
        this._oGuradWS.WSConnect(server,localport);
        if(this._ctrlStatus ==  barStatus_GuardConnecting)
        {
            if(this._cmdType != cmd_GuardType_GetVersion)
                this._OnFireEvent(GuardEvent_WebSocket,websocket_guard_connecting+"|正在连接电话条卫士【"+server+":"+localport+"】...第【"+this._connectCount+"】次");
        }
        this._connectCount = this._connectCount + 1;
    }
    this._InvokeMethod = function  _InvokeMethod(cmdIndex,param){
        var  cmdName = this._oGuradWS.GetCmdName(cmdIndex);
        if( cmdName == "")
            return -1;
        DisplayLog(VccBar_Log_Info,"JGuardCtrl:_InvokeMethod(cmdName="+cmdName+",param="+param+")");
        this._oGuradWS.WSSendMsg(buildApspMsg(cmdName,param));
    }
    this._OnFireEvent = function(eventIndex,eventParam){
        if(this._callBack)
            this._callBack(eventIndex,eventParam);
    }

    this.exeGuardCmd = function(cmdType,cmdParam1,cmdParam2){
        this._cmdType = cmdType;
        this._cmdParam1 = cmdParam1;
        this._cmdParam2 = cmdParam2;

        if(this._ctrlStatus == barStatus_Null)
        {
            this._ctrlStatus = barStatus_GuardConnecting;
            //this._ConnectToService(this._oParent.oAgentInfo._localserver,this._oParent.oAgentInfo._localGuardPort);
            this._ConnectToService(this._localGuardIP,this._localGuardPort);
        }
        /*
         else if(this._ctrlStatus == barStatus_GuardConnected)
         {//没有获得Maccard的IP;
         if(this._cmdType == cmd_GuardType_GetLocalPort)
         {
         this._InvokeMethod(APSP_GetLocalPort_CONF,this._cmdParam1);
         }
         else if(this._cmdType == cmd_GuardType_UpdateSetup)
         {
         this._InvokeMethod(APSP_UpdateSetup_CONF,GetApspParam(this._cmdParam1,this._cmdParam2));
         }
         }
         */
        return 0;
    }
    this.SetCallBack = function(callback){
        this._callBack = callback;
    }

    //////////////////////////////////////////////////////////////////////////
    // 事件
    /////////////////////////////////////////////////////////////////////////
    this._OnGuardWebSocketEvent = function OnGuardWebSocketEvent(cmdIndex,param){
        if(cmdIndex == APSP_WebSocket_Event)
        {
            //WebSocket 事件处理
            var code = parseInt(param);
            if( code == websocket_connected)
            {
                this._ctrlStatus = barStatus_GuardConnected;
                if(this._cmdType != cmd_GuardType_GetVersion)
                    this._OnFireEvent(GuardEvent_WebSocket,websocket_guard_connected+"|");
                if(this._cmdType == cmd_GuardType_GetLocalPort)
                {
                    this._InvokeMethod(APSP_GetLocalPort_CONF,this._cmdParam1);
                }
                else if(this._cmdType == cmd_GuardType_UpdateSetup)
                {
                    this._InvokeMethod(APSP_UpdateSetup_CONF,GetApspParam(this._cmdParam1,this._cmdParam2));
                }
                else if(this._cmdType == cmd_GuardType_GetVersion)
                {
                    this._InvokeMethod(APSP_GetVersion_CONF,"");
                }
            }
            else if( code == websocket_remoteserver_disconnected)
            {
                if(this._ctrlStatus == barStatus_GuardConnecting)
                {//连接没有连上
                    if(this._connectCount < PORT_COUNT)
                    {    //连接guard
                        //this._oParent.oAgentInfo._localGuardPort = this._oParent.oAgentInfo._localGuardPort+10;
                        //this.connectToService(this._oParent.oAgentInfo._localserver,this._oParent.oAgentInfo._localGuardPort);
                        this._localGuardPort = this._localGuardPort+10;
                        this._ConnectToService(this._localGuardIP,this._localGuardPort);
                    }
                    else
                    {
                        //this._oParent.ResetThisCtrl();
                        //this._oParent._invokeEvent(eventOnWebsocketSocket,websocket_guard_remoteserver_disconnected+"|");
                        this._OnFireEvent(GuardEvent_WebSocket,websocket_guard_remoteserver_disconnected+"|");
                        if(getLocalLanguage() == lg_zhcn)
                            alert("电话条卫士没有启动");
                        else
                            alert("CINGuard.exe not work");
                    }
                }
            }
            else if(code == websocket_closed)
            {
                if(this._ctrlStatus != barStatus_GuardConnecting)
                    this._ctrlStatus = barStatus_Null;
            }
        }
    }
    this._OnGuardWebSocketActionEvent = function OnGuardWebSocketActionEvent(cmdIndex,param){
        if(cmdIndex == APSP_GetLocalPort_CONF)
        {
            if(this._ctrlStatus == barStatus_GuardConnected)
            {
                this._oGuradWS.WSDisconnect();
                //this._oParent.oAgentInfo._localPort = parseInt(param);
                var nlocalPort = parseInt(param);
                if(nlocalPort == -1)
                {
                    if(getLocalLanguage() == lg_zhcn)
                        alert("MacCard.exe不存在");
                    else
                        alert("MacCard.exe not exist");
                }
                else if(nlocalPort == -2)
                {
                    if(getLocalLanguage() == lg_zhcn)
                        alert("电话条安装包安装不正确");
                    else
                        alert("CINVccBar package setup failure");
                }
                else
                {
                    this._OnFireEvent(GuardEvent_GetLocalPort,nlocalPort);
                }
            }
        }
        else if(cmdIndex == APSP_UpdateSetup_CONF)
        {
            if(param == "-1"){
                if(getLocalLanguage() == lg_zhcn)
                    alert("自动更新程序不存在!");
                else
                    alert("Ccupdate not exist!");
            }
            else if(param == "-2"){
                if(getLocalLanguage() == lg_zhcn)
                    alert("电话条安装包安装不正确!");
                else
                    alert("CINVccBar package setup failure!");
            }
            else if(param == "-3"){
                if(getLocalLanguage() == lg_zhcn)
                    alert("更新参数不正确!");
                else
                    alert("Bad ccupdate parameter!");
            }
            else if(param == "1")
            {
                var rt;
                if(getLocalLanguage() == lg_zhcn)
                    rt = confirm("检测到服务器上有新的版本,确认你是否要更新?");
                else
                    rt = confirm("There are a new version,would you like to update?");
                if(rt == true)
                {
                    this._cmdParam2 = "update";
                    this._InvokeMethod(APSP_UpdateSetup_CONF,GetApspParam(this._cmdParam1,this._cmdParam2));
                }
            }
            else if(param == "0"){
                if(getLocalLanguage() == lg_zhcn)
                    alert("没有新的版本需要更新!");
                else
                    alert("There are no new version!");
            }
            this._oGuradWS.WSDisconnect();
        }
        else if(cmdIndex == APSP_GetVersion_CONF)
        {
            this._OnFireEvent(GuardEvent_GetVersion,param);
            this._oGuradWS.WSDisconnect();
        }

        this._ctrlStatus == barStatus_GuardDisconnecting;
        this._cmdType = cmd_GuardType_Null;
        this._cmdParam1 = "";
        this._cmdParam2 = "";
        this._connectCount = 0;

    }

    this.apspCallbackGurad = function apspCallbackGurad(cmdType,cmdIndex,param){
        if(cmdType == APSP_Type_Prompt){
            this.oParent._OnGuardWebSocketEvent(cmdIndex,param);
        }
        else if(cmdType == APSP_Type_Action) {
            this.oParent._OnGuardWebSocketActionEvent(cmdIndex,param);
        }
    }

    this._Create();
    return this;
}
