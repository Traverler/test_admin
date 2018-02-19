<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <script>

        function inIframe() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        }
        //检查页面是否处于iframe中，如果不是，则返回首页
        if( inIframe() == false){
            location.href="/";
        }
    </script>

    <link rel="stylesheet" href="/css/fonts/linecons/css/linecons.css">
    <link rel="stylesheet" href="/css/fonts/fontawesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="/css/bootstrap.css">
    <link rel="stylesheet" href="/css/xenon-core.css?version=3">
    <link rel="stylesheet" href="/css/xenon-forms.css?version=2">
    <link rel="stylesheet" href="/css/xenon-components.css?version=2">
    <link rel="stylesheet" href="/css/xenon-skins.css?version=3">
    <link rel="stylesheet" href="/js/daterangepicker/daterangepicker-bs3.css?version=2">
    <link rel="stylesheet" href="/css/custom.css?version=2">

    <script src="/js/jquery-1.11.1.min.js"></script>
    {{--<script src="/js/main.js?version=3"></script>--}}
    <script src="/js/app.js"></script>
    <script src="http://fecdn.qfq.me/act_platform/static/js/common/watermark.js"></script>
    <script src="/js/ZeroClipboard/ZeroClipboard.min.js"></script>

</head>
<body class="page-body" style="background: #f8f8f8">


<div class="page-container"><!-- add class "sidebar-collapsed" to close sidebar by default, "chat-visible" to make chat appear always -->
    
    <div class="main-content" style="padding: 10px; padding-right: 20px;" >
        @if (session('status'))
            <div class="alert alert-block alert-success">
                <button type="button" class="close" data-dismiss="alert">
                    <span aria-hidden="true">×</span>
                    <span class="sr-only">Close</span>
                </button>
                &nbsp;&nbsp;
                {{ session('status') }}
            </div>
        @endif
        
        @yield('content')

    </div>
</div>

<!-- Bottom Scripts -->
<script src="/js/bootstrap.min.js"></script>
<script src="/js/TweenMax.min.js"></script>
<script src="/js/resizeable.js"></script>
<script src="/js/joinable.js"></script>
<script src="/js/xenon-api.js"></script>
<script src="/js/xenon-toggles.js"></script>

<!-- Imported scripts on this page -->
<script src="/js/xenon-widgets.js"></script>
<script src="/js/toastr/toastr.js"></script>
<link rel="stylesheet" href="/js/toastr/toastr.css">

<!-- JavaScripts initializations and stuff -->
<script src="/js/xenon-custom.js"></script>

<!-- lib -->
<script src="/js/datepicker/bootstrap-datepicker.js"></script>
<script src="/js/datepicker/bootstrap-datepicker.zh-CN.min.js"></script>
<link rel="stylesheet" href="/js/select2/select2.css">
<link rel="stylesheet" href="/js/select2/select2-bootstrap.css">
<script src="/js/select2/select2.min.js"></script>

<script src="/js/bootstrap-multiselect/bootstrap-multiselect.js"></script>
<link rel="stylesheet" href="/js/bootstrap-multiselect/bootstrap-multiselect.css">

@section('lib')
@show

@section('bodyEnd')
@show

<script type="text/javascript">
</script>
<div class="page-loading-overlay">
    <div class="loader-2"></div>
</div>


</body>
</html>