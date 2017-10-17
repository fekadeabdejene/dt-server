var dtQuery = {
  draw: '1',
  columns: [
    {
      data: 'id',
      name: 'SomeName1',
      searchable: 'false',
      orderable: 'true',
      search: {
        value: 'Column-1 Filter',
        regex: 'true'
      }
    },
    {
      data: 'name',
      name: 'SomeName2',
      searchable: 'true',
      orderable: 'false',
      search: {
        value: 'Column-2 Filter',
        regex: 'false'
      }
    },
    {
      data: 'address',
      name: 'SomeName3',
      searchable: 'true',
      orderable: 'true',
      search: {
        value: 'Column-3 Filter',
        regex: 'false'
      }
    },
    {
      data: 'zip',
      name: 'SomeName4',
      searchable: 'false',
      orderable: 'false',
      search: {
        value: 'Column-1 Filter',
        regex: 'true'
      }
    },
    {
      data: 'number',
      name: 'SomeName5',
      searchable: 'true',
      orderable: 'true',
      search: {
        value: 'Column-5 Filter',
        regex: 'true'
      }
    }
  ],
  order: [
    { column: '0', dir: 'desc' },
    { column: '1', dir: 'asc'  },
    { column: '2', dir: 'desc' },
    { column: '3', dir: 'desc' },
    { column: '4', dir: 'asc'  }
  ],
  start: '0',
  length: '10',
  search: {
    value: 'GlobalFilter',
    regex: 'false'
  },
  _: '1507217433999'
}

module.exports = {
  dtQuery: dtQuery
}
