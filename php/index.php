<?php
include('config.php');

$user_data_stmt = $conn -> prepare("INSERT into users (username,password, first-name, last-name, sex, age, contact-number, birthday, email, address, active ) VALUES (?,?,?,?,?,?,?,?,?,?,?)");

if(isset($_POST['register-form']) && !empty($_POST['register-form'])){
    $username = $_POST['username'];
    $password = $_POST['password'];

    $first_name = $_POST['first-name'];
    $last_name = $_POST['last-name'];

    $sex = $_POST['sex'];
    $age = $_POST['age'];
    $contact_number = $_POST['contact-number'];

    $birthday = $_POST['birthday'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $active = 1;

    $user_data_stmt->bind_param("sssssiisssi", $username, $password, $first_name, $last_name, $sex, $age, $contact_number, $birthday, $email, $address, $active);

    $user_data_stmt->execute();

    session_start();
    header('Location: login.html');
    exit;
}
?>