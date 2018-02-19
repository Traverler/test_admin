<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">

    <title>商家中心</title>

    <link rel="stylesheet" href="/css/fonts/linecons/css/linecons.css">
    <link rel="stylesheet" href="/css/fonts/fontawesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="/css/bootstrap.css">
    <link rel="stylesheet" href="/css/xenon-core.css?version=3">
    <link rel="stylesheet" href="/css/xenon-forms.css?version=2">
    <link rel="stylesheet" href="/css/xenon-components.css?version=2">
    <link rel="stylesheet" href="/css/xenon-skins.css?version=3">
    <link rel="stylesheet" href="/css/custom.css?version=2">

    <script src="/js/jquery-1.11.1.min.js"></script>

</head>
<body class="page-body skin-facebook" style="background: #f8f8f8">


<div class="page-container"><!-- add class "sidebar-collapsed" to close sidebar by default, "chat-visible" to make chat appear always -->

    @include('layouts.menu')

    <div class="main-content">

        @include('layouts.notifications')
        @include('layouts.tabs')

    </div>
</div>


<script src="/js/bootstrap.min.js"></script>
<script src="/js/TweenMax.min.js"></script>
<script src="/js/resizeable.js"></script>
<script src="/js/joinable.js"></script>
<script src="/js/xenon-api.js"></script>
<script src="/js/xenon-toggles.js"></script>
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
<script>

    $('#logout').click(function(){
        return false;
        $.ajax({
            url: "/ssocookie",
            type: "GET",
            dataType: 'json',
            success: function (data) {
                window.location.reload();
            },
            error: function (er) {
                window.location.reload();
            }
        });
    });


    function toastrSuccess(msg){
        toastr.options.positionClass = "toast-bottom-center";
        toastr.success(msg);
    }

    window.onbeforeunload = function() {
        return "确定离开?";
    };
</script>

</body>
</html>