<?php

// GET: get all events

require("config.php");

if($mysqli === false) {
    die("Connection failed.");
}

$query = "SELECT * FROM `event`";

$result = mysqli_query($mysqli, $query);

$events = array();

while($row = mysqli_fetch_array($result)) {
	
	$event = new stdClass();	
	$event->id = $row['id'];
	$event->text = $row['text'];
	
	// Convert date to correct format for database
	$event->start_date = date_format(date_create($row['start_date']), "m/d/Y H:i");
	$event->end_date = date_format(date_create($row['end_date']), "m/d/Y H:i");

	if($row['color'] != null) {
		$event->color = $row['color'];
	}
	if($row['textColor'] != null) {
		$event->textColor = $row['textColor'];
	}

	// Add event to array
	$events[] = $event;
}

// Return json
echo json_encode($events);

?>
