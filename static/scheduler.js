function init() {
  scheduler.config.mark_now = true;
  scheduler.config.show_loading = true;

  scheduler.locale.labels.section_color = "Background Color";
  scheduler.locale.labels.section_textColor = "Text Color";
  scheduler.config.lightbox.sections = [
    {name: "description", height: 130, map_to: "text", type: "textarea", focus: true},
    {name: "color", height: 40, type: "textarea", map_to: "color", default_value: "#0288d1" },
    {name: "textColor", height: 40, type: "textarea", map_to: "textColor", default_value: "white" },
    {name: "time", height: 72, type: "time", map_to: "auto"}
  ];

  scheduler.init('scheduler_here',new Date(),"week");

  // LOAD EVENTS
  getEvents();

  // scheduler.parse([
  // 	{"id": "11102", text:"HELLO? ID?", start_date:"11/26/2018 14:00", end_date:"11/26/2018 17:00", color:"#9575CD"},
  // ],"json");

  scheduler.attachEvent("onEventAdded", function(id,ev){
    //any custom logic here
    addEvent(ev).then(response => {
        response.text().then(text => {
          var insertedId = text;
          // set inserted event id
          scheduler.changeEventId(id, insertedId);
        })
      },
    error => {
      console.log(error);
    });
  });

  scheduler.attachEvent("onEventChanged", function(id,ev) {
    updateEvent(ev);
  });

  scheduler.attachEvent("onEventIdChange", function(oldId,newId) {
    console.log(newId);
  });

  scheduler.attachEvent("onEventDeleted", function(id,ev){
    deleteEvent(ev);
  });
}

function deleteEvent(event) {
  fetch("/actions/event_delete.php", {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
          //"Content-Type": "application/json; charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: "id=" + event.id // body data type must match "Content-Type" header
  })
  .then(response => { response.text().then(text => console.log(text)) },
  error => {console.log(error);}); // parses response to JSON
  }

function updateEvent(event) {
  var form = parameterize([
    {key: "id", value: event.id},
    {key: "text", value: event.text},
    {key: "start_date", value: moment(event.start_date).format("MM/D/YYYY HH:mm")},
    {key: "end_date", value: moment(event.end_date).format("MM/D/YYYY HH:mm")},
    {key: "color", value: event.color},
    {key: "textColor", value: event.textColor}
  ]);

  fetch("/actions/event_update.php", {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
          //"Content-Type": "application/json; charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: form // body data type must match "Content-Type" header
  })
  .then(response => { response.text().then(text => console.log(text)) },
  error => {console.log(error);}); // parses response to JSON
}

function addEvent(event) {
  // Default options are marked with *

  var form = parameterize([
    {key: "id", value: event.id},
    {key: "text", value: event.text},
    {key: "start_date", value: moment(event.start_date).format("MM/D/YYYY HH:mm")},
    {key: "end_date", value: moment(event.end_date).format("MM/D/YYYY HH:mm")},
    {key: "color", value: event.color},
    {key: "textColor", value: event.textColor}
  ]);

  return fetch("/actions/event_add.php", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
          //"Content-Type": "application/json; charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: form // body data type must match "Content-Type" header
  });
}

function parameterize(kvpairs) {
  str = "";
  for(var i=0; i<kvpairs.length; ++i) {
    kvp = kvpairs[i];
    str += kvp.key + "=" + kvp.value;
    str += (i+1<kvpairs.length ? "&" : "");
  }
  return str;
}

function getEvents() {
  fetch("/actions/event_get.php")
  .then(response => {
    response.json().then(
      data => {
        scheduler.parse(data, "json");
      }
    )
  })
  .then(error => {
    console.log(error);
  });
}
