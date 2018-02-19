<div id="documentTab" style="margin-left: -25px;" >

    <ul id="pageTab" class="nav nav-tabs" style="border-bottom: 1px solid #dddddd;background-color:#fff">
        <li class="active">

            <a id="tabA_dashboard" href="#documentTab_dashboard" data-toggle="tab">
                <span class="tabs-icon fa fa-tachometer  bigger-120"></span>
                仪表盘
            </a>

        </li>

    </ul>
    <div class="tab-content" style="padding: 0px;border: 1px solid #dddddd">

        <div role="tabpanel" class="tab-pane active" id="documentTab_dashboard">

            <iframe id="iframe_dashboard" src="/dashboard"></iframe>


        </div>


    </div>


</div>

<script type="text/javascript">

    $(function(){

        setIframeHeight("#documentTab iframe");

        $(document).on('click',".documentTabLink",function() {
            addTab($(this));
        });

        $(document).on('click',"#pageTab .close",function() {
            closeTab($(this));
        });

        $(document).on('dblclick',"#pageTab [data-toggle=tab]",function() {
            $obj = $(this);
            refreshTab($obj);
        });


    })

    function setIframeHeight(selector){
        $(selector).css("height", $(document).height() - 135+"px") ;
    }

    function addTab($obj){

        var id = $obj.attr('tab-id');
        var url = $obj.attr('tab-url');
        var title = $obj.attr('tab-title');

        _addTab(id,url,title);

    }

    function _addTab(id,url,title){

        //检查tab是否存在
        if( $('#tabA_'+id).length ){
            // Tab已存在 刷新
            $( '#documentTab_'+id+' iframe' ).attr( 'src', url);
        }else{

            var $tabs = $('#pageTab');

            var $tabLi = $("<li></li>");
            var $tabA = $("<a> </a>");
            $tabA.attr("id","tabA_"+id);
            $tabA.attr("href","#documentTab_"+id);
            $tabA.attr("data-toggle","tab");
            $tabA.attr("class","newTab");
            $tabA.html(' <span class="tabs-icon fa fa-bars bigger-120"></span> '+title+' <button class="close" type="button" title="点击关闭"> × </button>');
            $tabLi.html($tabA);
            $tabs.append($tabLi);

            var $tabContent = $('#documentTab .tab-content');
            var $tabContentDiv = $('<div  role="tabpanel" class="tab-pane" > </div>');
            $tabContentDiv.attr('id',"documentTab_"+id);
            $tabContentDiv.html('<iframe src="'+url+'"></iframe>');
            $tabContent.append($tabContentDiv);

        }

        $('#tabA_' + id).tab('show');

        setIframeHeight("#documentTab iframe");

    }

    function closeTab($obj){
        $tabContent = $obj.parent().attr('href');
        $obj.parent().parent().remove();
        $($tabContent).remove();
        $('#tabA_dashboard').tab('show');

    }

    function closeCurrentTab(show){
        $tabLi = $("#documentTab .active");
        $tabHref = $tabLi.find('a').attr('href');
        $tabLi.remove();
        $($tabHref).remove();

        if( $(show).length > 0 ){
            $(show).tab('show')
        }else{
            $('#tabA_dashboard').tab('show')
        }
    }


    //处理完案件后，关闭当前tab，跳转到我的催收页面
    function closeCurrentCaseTab(){
        $tabLi = $("#documentTab .active");
        $tabHref = $tabLi.find('a').attr('href');
        $tabLi.remove();
        $($tabHref).remove();

        if( $("#tabA_workbench_mycase").length > 0 ){
            $('#tabA_workbench_mycase').tab('show')
        }else{
            $('#tabA_dashboard').tab('show')
        }
    }

    function refreshTab($obj){
        $tabContent = $obj.attr('href');
        $iframe = $($tabContent+" iframe");
        //获取当前iframe的location
        var href = $iframe[0].contentWindow.location.href;
        $($tabContent+" iframe").attr( 'src', href);
    }

</script>
