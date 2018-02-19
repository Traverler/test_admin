$(function(){


    iframeTabLinkEvent();

    $('.input-daterange').datepicker(
        {
            autoclose:true ,
            language:'zh-CN',
            clearBtn:true,
            format: "yyyy-mm-dd"
        }
    );


    $('.multiselect').multiselect({
        nonSelectedText: '请选择',
        enableFiltering: true,
        buttonWidth: '150px',
        maxHeight: 300,
        selectAllText: '全选',
        buttonClass: 'btn btn-white'
    });



});

function iframeTabLinkEvent(){

    $(document).on('click',".iframeTabLink",function() {
        parent.addTab($(this));
    });

}

function objectifyForm(formArray) { //serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}