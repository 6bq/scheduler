<?php

// DELETE: delete event

require("config.php");

if($mysqli === false) {
    die("Connection failed.");
}

// store input from body in $_DELETE
$method = $_SERVER['REQUEST_METHOD'];
if ('DELETE' === $method) {
    parse_str(file_get_contents('php://input'), $_DELETE);
}

$id = $_DELETE['id'];

$stmt = $mysqli->prepare("DELETE FROM `event` WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo "Delete successful for id " . $id;
}
else {
  echo "Could not delete event with id " . $id;
}

$stmt->close();
?>
