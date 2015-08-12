<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>QUnit <%= name %> dist tests</title>
  <link rel="stylesheet" href="../libs/qunit/qunit-1.18.0.css">
</head>
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture"></div>
  <script src="../libs/qunit/qunit-1.18.0.js"></script>
  <script src="../node_modules/crisp-base/dist/crisp-base.min.js"></script>
  <script src="../node_modules/crisp-create/dist/crisp-create.min.js"></script>
  <script src="../node_modules/crisp-event/dist/crisp-event.min.js"></script>
  <script src="../dist/<%= grunt.pkg.name %>.min.js"></script>
  <script>
  var exports = {};
  </script>
  <script src="<%= testfile %>"></script>
  <script>
  for (var item in exports) {
    QUnit.test( item, exports[item] );
  }
  </script>
</body>
</html>