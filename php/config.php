<?php
// php script to connect to sql
session_start();
$host = "localhost";
$dbuser = "root";
$database = "easytel";

$conn = mysqli_connect($host, $dbuser, "", $database);

// Check the connection
if ($conn->connect_errno) {
    echo '<script>console.log("error here");</script>';

}

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>