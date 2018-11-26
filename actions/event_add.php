<?php

// POST: add event

require("config.php");

if($mysqli === false) {
    die("Connection failed.");
}

// Get posted values
$text = $_POST['text'];

// Convert input to datetime objects
$start_date = date_create_from_format("m/d/Y H:i", $_POST['start_date']);
$end_date   = date_create_from_format("m/d/Y H:i", $_POST['end_date']);

// Ensure date is in right format for the database
$start_date = date_format($start_date, 'Y-m-d H:i');
$end_date = date_format($end_date, 'Y-m-d H:i');

$color      = $_POST['color'];
$textColor  = $_POST['textColor'];

$stmt = $mysqli->prepare("INSERT INTO `event` (text, start_date, end_date, color, textColor) VALUES(?, ?, ?, ?, ?)");
if (!$stmt->bind_param("sssss", $text, $start_date, $end_date, $color, $textColor)) {
  die("Invalid data.");
}

if ($stmt->execute()) {
  // Return the inserted row id
  echo $stmt->insert_id;
} else {
  echo "Could not create event with  id " . $id;
}

$stmt->close();
?>
