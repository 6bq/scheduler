function init() {
  scheduler.config.mark_now = true;
  scheduler.config.show_loading = true;
  scheduler.config.details_on_create=true;
  scheduler.config.details_on_dblclick=true;
  scheduler.config.quick_info_detached = false;
  scheduler.config.scroll_hour = moment().hours();
  scheduler.config.start_on_monday = false;

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

  //scheduler.parse([
  //	{"id": "11102", text:"TEST", start_date:"11/26/2018 10:00", end_date:"11/26/2018 17:00", color:"black"},
  //],"json");

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
      method: "DELETE",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", 
      referrer: "no-referrer",
      body: "id=" + event.id
  })
  .then(response => { response.text().then(text => console.log(text)) },
  error => {console.log(error);});
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
      method: "PUT",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: form
  })
  .then(response => { response.text().then(text => console.log(text)) },
  error => {console.log(error);});
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
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: form
  });
}

function parameterize(kvpairs) {
  var str = "";
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
		// Parse events into scheduler
        scheduler.parse(data, "json");
      }
    )
  })
  .then(error => {
    console.log(error);
  });
}

function show_minical(){
	if (scheduler.isCalendarVisible())
		scheduler.destroyCalendar();
	else
		scheduler.renderCalendar({
			position:"dhx_minical_icon",
			date:scheduler._date,
			navigation:true,
			handler:function(date,calendar){
				scheduler.setCurrentView(date);
				scheduler.destroyCalendar()
			}
		});
}