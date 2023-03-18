<?php
include('config.php');

$user_data_stmt = $conn -> prepare("INSERT into users (username, password, first_name, last_name, sex, age, contact_number, birthday, email, address, active ) VALUES (?,?,?,?,?,?,?,?,?,?,?)");

$username_stmt = $conn->prepare("SELECT username FROM users WHERE username = ?");


var_dump($_POST);
print_R($_POST);
echo ($_POST['register_button']);

if(isset($_POST['register_button'])){
    $username_stmt->bind_param("s", $_POST['username']);
    $username_stmt->execute();
    $username_stmt->store_result();

    if ($username_stmt->num_rows > 0) {
        echo '<script type ="text/JavaScript">';  
        echo 'alert("Username already taken.")';  
        echo '</script>';
        $username_stmt->close();
        exit();
    } else {
        // Username is available
        echo "Username available";
        $username_stmt->close();
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];

    $sex = $_POST['sex'];
    $age = $_POST['age'];
    $contact_number = $_POST['contact_number'];

    $birthday = $_POST['birthday'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $active = 1;

    $user_data_stmt->bind_param("sssssiisssi", $username, $password, $first_name, $last_name, $sex, $age, $contact_number, $birthday, $email, $address, $active);

    $user_data_stmt->execute();

    session_start();
    header('Location: ../login.html');
    exit;
}

?>