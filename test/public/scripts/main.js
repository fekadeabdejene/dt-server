$(document).ready(function() {
  var datatable = $('#basic').DataTable( {
    "processing": true,
    "serverSide": true,
    "ajax": "/dtsql3",
    "columns": [
      {data: 'id'},
      {data: 'name'},
      {data: 'address'},
      {data: 'postalcode'}
    ]
  });

  $('#basic tfoot th').each( function () {
    var title = $(this).text();
    $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
  });

  datatable.columns().every( function () {
    var column = this;
    $('input', this.footer()).on('keyup change', function() {
      if(column.search() !== this.value) {
        column.search( this.value )
          .draw();
      }
    });
  });
})
