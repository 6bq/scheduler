<?php

// PUT: update single event

require("config.php");

if($mysqli === false) {
    die("Connection failed.");
}

// store input from request body in $_PUT
$method = $_SERVER['REQUEST_METHOD'];
if ('PUT' === $method) {
    parse_str(file_get_contents('php://input'), $_PUT);
}

$id   = $_PUT['id'];
$text = $_PUT['text'];

// Convert input to datetime objects
$start_date = date_create_from_format("m/d/Y H:i", $_PUT['start_date']);
$end_date   = date_create_from_format("m/d/Y H:i", $_PUT['end_date']);

// Convert date to correct format for database
$start_date = date_format($start_date, 'Y-m-d H:i:s');
$end_date = date_format($end_date, 'Y-m-d H:i:s');

$color     = $_PUT['color'];
$textColor = $_PUT['textColor'];

$stmt = $mysqli->prepare("UPDATE `event` SET text = ?, start_date = ?, end_date = ?, color = ?, textColor = ? WHERE id = ?");
$stmt->bind_param("sssssi", $text, $start_date, $end_date, $color, $textColor, $id);

if ($stmt->execute()) {
  echo "Update successful for id " . $id;
} else {
  echo "Could not update event.";
}

$stmt->close();
?>
