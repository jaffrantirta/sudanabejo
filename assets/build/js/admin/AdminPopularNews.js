function add_popular_news(){
    $.ajax({
        url: base_url+"api/get_data_news/news_complate_data",
        type: "get",
        success: function(result){
            var v = "'add_popular_news'";
            // console.log('data 222 : '+result);
            var data = JSON.parse(result);
            var size = data.data.length;
            var i = 0;
            var txt;
            var d;
            for(i=0;i<size;i++){
                d = data.data[i];
                txt = txt+'<option value="'+d.id+'" >'+d.title+'</option>';
            }
            Swal.fire({
                html:
                '<div class="form-group">'+
                    '<label>Tambah Berita Populer</label><br>'+
                    '<small id="msg_select" hidden style="color: red">pilih judul berita terlebih dahulu</small>'+
                    '<select title="pilih judul berita" id="select" class="form-control select2" style="width: 100%;">'+
                        '<option value="not selected yet">Pilih Judul Berita</option>'+
                        txt+
                    '</select>'+
                '</div>'+
                '<div class="form-group">'+
                    '<button class="btn btn-primary btn-sm" onClick="action_check('+v+')">tambah</button>'+
                '</div>',
                showConfirmButton: false
            });
        },
        error: function (result, ajaxOptions, thrownError) {
            // console.log('data : '+result.responseText);
            error_message('error', 'Oops! sepertinya ada kesalahan', 'kesalahan tidak diketahui');
            if(result.response.status == false){
                var string = JSON.stringify(result.responseText);
                var msg = JSON.parse(result.responseText);
                error_message('error', 'Oops! sepertinya ada kesalahan', msg.message['indonesia']);
            }
        }
    });
}

function add_popular_news_process(news_id){
    $.ajax({
        url: base_url+"api/insert_popular_news",
        type: "post",
        data: {'news_id':news_id},
        success: function(result){
            // console.log('data : '+result);
            var data = JSON.parse(result);
            Swal.fire({
                allowOutsideClick: false,
                text: data.response.message['indonesia'],
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload(true);
                }
              });
        },
        error: function (result, ajaxOptions, thrownError) {
            // console.log('data : '+result.responseText);
            error_message('error', 'Oops! sepertinya ada kesalahan', 'kesalahan tidak diketahui');
            if(result.response.status == false){
                var string = JSON.stringify(result.responseText);
                var msg = JSON.parse(result.responseText);
                error_message('error', 'Oops! sepertinya ada kesalahan', msg.message['indonesia']);
            }
        }
    });
}
function delete_popular_news(id){
    Swal.fire({
        title: 'Yakin Hapus ?',
    }).then((result) => {
        if (result.isConfirmed) {
            delete_data_popular_news(id);
        }
    });
}
function delete_data_popular_news(id){
    // console.log(id);
    $.ajax({
        url: base_url+"api/delete_popular_news",
        type: "post",
        data: {"id":id},
        success: function(result){
            // console.log('data : '+result);
            var data = JSON.parse(result);
            Swal.fire({
                title: data.response.message['indonesia'],
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload(true);
                }
              });
        },
        error: function (result, ajaxOptions, thrownError) {
            // console.log('data : '+result.responseText);
            error_message('error', 'Oops! sepertinya ada kesalahan', 'kesalahan tidak diketahui');
            if(result.response.status == false){
                var string = JSON.stringify(result.responseText);
                var msg = JSON.parse(result.responseText);
                error_message('error', 'Oops! sepertinya ada kesalahan', msg.message['indonesia']);
            }
        }
    });
}