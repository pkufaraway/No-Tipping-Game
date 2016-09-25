<?php
ini_set('display_errors', true); 
ini_set('display_startup_errors', true); 
error_reporting(E_ALL);
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Index Page for No Tipping</title>
</head>
<body>
<?php
  echo "Hello World!";
  echo 'Hello ' . htmlspecialchars($_GET["name"]) . '!';
?>
</body>
</html>
