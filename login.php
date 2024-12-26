<?php
session_start();
$mysqli = new mysqli('localhost', 'root', '', 'auth_demo');

if ($mysqli->connect_error) {
    die('Connection failed: ' . $mysqli->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $mysqli->real_escape_string($_POST['email']);
    $password = $_POST['password'];

    $result = $mysqli->query("SELECT * FROM users WHERE email='$email'");

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['email'] = $user['email'];
            header("location: index.html");
        } else {
            $_SESSION['message'] = "Mot de passe incorrect.";
        }
    } else {
        $_SESSION['message'] = "Adresse mail non trouvée.";
    }
}
?>