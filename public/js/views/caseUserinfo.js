

$(function(){
    $(".btn-showPrivateInfo").click(function(){
        var caseId = $(this).attr('caseId');
        var content = $(this).attr('data-content');
        $.get("/common/showPrivateInfo", { caseId: caseId, content: content } );
    });
})