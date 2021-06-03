
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Kecamatan</h1>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->
    <p hidden id='link'>api/get_districts_data_table</p>
    <div class="card">
              <div class="card-header">
                <h3 class="card-title">Data Kecamatan di Bali</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <table id="table" class="table table-bordered table-striped">
                  <thead>
                  <tr>
                    <th>Kecamatan</th>
                    <th>Termasuk kedalam Kabupaten</th>
                    <th>Aksi</th>
                  </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
              <button onClick="add_districts()" style="margin-bottom: 0.3em; margin-left: 1em; margin-top: 0.3em"  class="btn btn-block btn-outline-primary btn-sm col-sm-2 col-11">Tambah Kecamatan</button>
            </div>