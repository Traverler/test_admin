1、1.0.0.0 (20.20140702)       （20140730）
      新建。

2、1.0.0.1(20.20140801)       (20140808)
      1）、简化了头文件的使用，只要引用：scripts/japp.js
	  2）、applicationLoad中增加了relationPath参数；
	  3）、增加了座席卫士进程；
	  4）、当浏览器不支持websocket时，自动使用OCX控件；
	  
3、1.0.0.2
     重构文档。

4、1.0.0.3(20.20140901)   (20140912) 
      1）、监控的集成；
	  2）、电话条中把OCX中大部分工作移动Maccard.exe；
	  3）、微信的集成；
	  4）、电话条自动更新；
	  
5、1.0.0.4(20.20141001)  (20140926) 
      1）、增加支持english版本；
	  2）、电话条提示说明也支持english版本（界面部分支持）；
	  3）、电话条对CINRTP.dll自注册；
	  
6、1.0.0.5(20.20141204)  (20141226)
      1）、对html5方式的方法的默认参数的处理；
	  2）、集成Monitor对象；
	  3）、监控支持跨企业，并增加了强制置闲、强制置忙、强制挂断、强制退出功能；
	  4）、监控中增加大屏显示功能；
	  5）、增加析构函数applicationUnLoad；

7、1.0.0.6(20.20150301)  (20150320)
       1）、增加了PassWdCryptTypec参数；
	   2）、增加了微信消息的处理；
	   
8、1.0.0.7(20.20150302)  (20150326)
       1）、解决websocket下MacCard电话条死机的问题；
	   2）、增加了微信消息的处理；

9、1.0.0.8(20.20150503)  (20150527)	   
	   1）、方法FroceReset改成ForceReset；
	   2）、 完成Silverlight的版本；
	   3）、 增加SetForwardNumber、GetForwardNumber；
       4）、 修改了内部相对路径的处理；
	   5）、修改CallDataChange事件参数中有%s导致随路数据出现问题;
	   6）、OnCallRing中内部传输的时候callData参数进行Base64编解码；
       适配版本CINVCCBAR-Setup(20.150503).rar

10、1.0.0.9(20.20150703)  (20150727)
    1）、正式发布silverlight版本；
	2）、支持自动更新；
    3）、优化电话条使用;
		>> CallQueueQuery 增加轮询，需要兼容以前的版本；        
		>> QuerySPGroupList 增加轮询，需要兼容以前的版本；     
		>> 增加了OnQuerySPGroupList事件 ；
        >> QueryGroupAgentStatus和OnQueryGroupAgentStatus中增加了type参数；
	4）、Silverlight控件正式发布；
	5）、电话条说明文档；
	6）、电话条退出导致的问题（优化）；                             
	   >> OnForceOut          
	   >> OnSignOuted     
	   >> 异常退出      
	7）、电话条刷新快就不能重新登录的问题；
	   >> ocx和CINGuard.exe中都增加了kill Maccard功能；
	8）、电话挂断后ns之后自动置闲或者自动置忙，增加了日志，增加了绝对时间间隔的限制（程曦）;

11、1.0.0.10(20.20150801)  (20150811)
    1）、增加了VersionType参数，支持企业版和教育版的区分，交流参数增加到【40】个；
	2）、电话条增加了OnAgentStatus事件，增加了动态加载JQuery库的变化的判断；没有界面不支持

11、1.0.0.11(20.20151201)  (20151217)
    1）、增加了事件OnAgentBusyReason事件；
	2）、Silverlight模式的相对路径的问题；

12、1.0.0.12(20.20160501)  (20160517)
	1）、增加了IsReconnect参数，支持普通连接和重连的区分，交流参数增加到【41】个；
    2）、增加SetAgentReservedStatus方法，设置座席预留状态；
	3）、OnCallEnd中disconnectType参数起作用；
	4）、电话条重连机制优化；
	5）、电话条安装回复默认设置；
