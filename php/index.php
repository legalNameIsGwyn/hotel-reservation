<?php
include('config.php');

$user_data_stmt = $conn -> prepare("INSERT into ");

if(isset($_POST['register-form'])){
    $first_name = $_POST['first-name'];
    $last_name = $_POST['last-name'];
    $sex = $_POST['sex'];
    $age = $_POST['age'];
    $contact_number = $_POST['contact-number'];
    $birthday = $_POST['birthday'];
    $email = $_POST['email'];
    $address = $_POST['address'];

    $username = $_POST['username'];
    $password = $_POST['password'];

    exit;
}
?>