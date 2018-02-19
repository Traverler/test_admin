function uploadAttachment(e, pub, sig) {
    var _this = $(e.target), files = _this[0].files, url;
    if (pub) {
        url = '/file/public';
    } else {
        url = '/file/public';
    }

    for(var i=0; i<files.length; i++) {
        var reader = new FileReader();
        var formData = new FormData();
        console.log(files[i]);

        reader.readAsDataURL(files[i]);
        reader.fileData = files[i];
        reader.onload = function(e) {
            var g = _this.parent(), showCan = g.parent();
            var img = this.fileData.name;
            var formData = new FormData();
            var show = $('<div class="input-wrap" data-name="'+showCan.attr('data-name')+'"><a href="javascript:;" class="upload"><div class="cross-r"></div></a></div>');
            formData.append('file', this.fileData);

            if (sig) {
                show = g;
                show.attr('data-name', showCan.attr('data-name'));
                show.find('input').each(function() {
                    if ($(this).attr('type') != 'file') {
                        if ($(this).attr('data-hold') != 1) {
                            $(this).remove();
                        }
                    }
                });
            } else {
                show.find('a').on('click', function() {
                    show.remove();
                });
                showCan.append(show);
            }

            $.ajax({
                url : url,
                data: formData,
                type: 'post',
                dataType: 'json',
                cache: false,
                processData: false,
                contentType: false,
                show: show,
                img: img,
                sig: sig,
                file: this.fileData,
                success: function(re) {
                    if (re.code != 0) {
                        alert('"'+this.file.name+'"上传失败');
                        if (this.sig) {
                            show.parent().find('input[type=file]').val('');
                        } else {
                            this.show.remove();
                        }
                        return false;
                    }

                    appendImgInfo(this.show, this.img, re.data);
                }
            });
        }
    }

    function appendImgInfo(target, img, imgInfo) {
        var dataName = target.attr('data-name'), num = target.prevAll('div').length - 1;

        if (num < 0) {
            num = 0;
        }
        if (target.find('a.upload').length > 0) {
            target.find('a.upload').append(img);
        } else {
            target.find('label.upload').append(img);
        }

        imgInfo.sort = num;
        for (var key in imgInfo) {
            var inputHtml = '';
            inputHtml += '<input type="hidden" name="';
            if (dataName) {
                inputHtml += dataName;
                if (!sig) {
                    inputHtml += '['+num+']';
                }
                inputHtml += '['+key+']"';
            } else {
                inputHtml += key+'" ';
            }
            inputHtml += 'value="'+imgInfo[key]+'"/>';
            target.append(inputHtml);
        }

        target.parent().find('input[type=file]').val('');
    }
}
