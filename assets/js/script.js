/* -------------------------------------------------------------------------- */
//-- GLOBALS -> START

// DIV containin all times
const schedule_Today = $("#schedule_Today");
// For local storage DB
const database_Name = "a_DailyScheduler";
// Moment JS date
const today = function() {return moment().format("dddd, MMMM Do YYYY")};
// Update to Today
document.getElementById("currentDay").innerText = today();


// Total Hours in Day
let hours_Day = 24;

// hour in 24 hour format
const now = function() { return moment().format("HH")};

const now_full = function() {return moment().format("hh:mm:ss A")};
document.getElementById("currentTime").innerText = now_full();



//-- GLOBALS -> END
/* -------------------------------------------------------------------------- */
//-- MODAL -> START


// Event when Event modal opened
$('#add_TimeBlock_Event').on('shown.bs.modal', function (event) {
    // Update TIME based on event block selected
    $( "#time_holder" ).text($(event.relatedTarget)[0].id);
    // grab the inner text of SPAN holding description if it exists to update modal
    
    let description_Holder = document.getElementById("description_"+ (time_holder.innerText));
    console.log("Detail grab",description_Holder.innerText);
    description_Holder = description_Holder.innerText;
    
    // let thisDate = (get_Database()).daily[(moment().format("YYYYMMDD"))];
    // console.log(document.getElementById("description_"+ (time_holder.innerText.split(" ")[0])));
    // $( "#modal_EventDescription" ).html({variable});
    if (description_Holder != ""){
        // Add alert message indicating you're updating an existing event
        $( "#event_Message").html('<span class="alert alert-info" role="alert"><i>Updated event and press <em class="badge badge-primary">Save</em> to change event.</i></span>');
        
        // Update Text Area with content from within calendar
        $("#modal_EventDescription").replaceWith('<textarea class="form-control" id="modal_EventDescription" rows="3" placeholder="This event is for...">'+description_Holder+'</textarea>');
        
    };
    
    // Set FOCUS to text-area for typing
    $("#modal_EventDescription").trigger('focus');
    
    var val = $("#modal_EventDescription").val(); //store the value of the element
    $("#modal_EventDescription").val(''); //clear the value of the element
    $("#modal_EventDescription").val(val); //set that value back.  

    
});


// Event that if typed into Description and delete button is there, set to defaults
$("#modal_EventDescription").bind('input propertychange', function(){
    // alert("The text has been changed.");

    if($(".btn-delete").text() != ""){
        set_BTN_Defaults();
    }
});

$(".btn-clear").click( function() {
    $("#modal_EventDescription").val('');
    
    var description_Holder = $("#modal_EventDescription").val();

    // If NO description and pressed Save, prompt delete
    if ((description_Holder.trim().length != 0 ) && $(".btn-clear")) {
        
        set_BTN_Cancel();
        set_BTN_Delete();
    }
});

// set modal buttons to default configurations
function set_BTN_Defaults(){
    
    // If they exist, replace extra buttons
    $(".btn-cancel").replaceWith('<button type="button" class="btn btn-secondary btn-close" data-dismiss="modal">Close</button>');
    $(".btn-delete").replaceWith('<button type="button" class="btn btn-primary btn-save">Save</button>');

    // DEFAULT ALERT
    $( "#event_Message").html('<span class="alert alert-primary" role="alert"><i>Add Description & press <em class="badge badge-primary">Save</em> to create an event.</i></span>');
    
    
    // CLEAR Button - - EVENT LISTENER
    $("btn-clear").click( function() {
        $("#modal_EventDescription").val('');
        console.log("clear");

        // // If NO description and pressed Save, prompt delete
        // if (description_Holder.trim() == "" && $(".btn-clear")) {
        //     console.log("description_Holder:",description_Holder, "and .btn-save pressed.");
        //     set_BTN_Cancel();
        //     set_BTN_Delete();
        // }
    });
    
    // SAVE Button - EVENT LISTENER
    $(".btn-save").click(function () {

        // get description values user has typed in
        var description_Holder = $("#modal_EventDescription").val();
        
        // If Description was filled out our had a value already ( because event existed )
        if (description_Holder != '') {
            // Build what will be saved in database
            let database = {
                daily : {
                    [(moment().format("YYYYMMDD"))]: {
                        [time_holder.innerText]: {
                            description: description_Holder,
                            state: 1
                        }
                    }
                }
            };
            // Update the Database
            set_Database(database);
            // Update HTML for time-block with saved Description
            document.getElementById("description_"+ time_holder.innerText).innerText = description_Holder;
            //Hide modal
            $("#add_TimeBlock_Event").modal("hide");
            // empty description on save for new edits
            $("#modal_EventDescription").val('');
        }
        // If NO description and pressed Save, prompt delete
        else if (description_Holder.trim() == "" && $(".btn-save")) {
            console.log("description_Holder:",description_Holder, "and .btn-save pressed.");
            set_BTN_Cancel();
            set_BTN_Delete();
        }
    });
    console.log("updated btns to default"); // TODO:: 12/04/2021 #EP || Delete once done testing
    
}

// make sure default configuration
function set_BTN_Close(){ 
    $(".btn-close").click(function () { 
    set_BTN_Defaults();
    });
}

//Replace Close, create cancel, make event listener
function set_BTN_Cancel(){
    // replace close with cancel
    $(".btn-close").replaceWith('<button type="button" class="btn btn-secondary btn-cancel" data-dismiss="modal">Cancel</button>')
    // at listner to set to defaults if canceled
    $(".btn-cancel").click(function () {
        set_BTN_Defaults();    
    });
};
// Update Alert, replace Save with Delete, make event listener
function set_BTN_Delete(){
    // Add ALERT Warning
    $( "#event_Message").html('<span class="alert alert-danger" role="alert"><i>Press <em class="badge badge-danger">Delete</em> to remove event.</i></span>');
    // Replace save with delete
    $(".btn-save").replaceWith('<button type="button" class="btn btn-danger btn-delete" data-dismiss="modal">Delete</button>')    
    // Add event listener
    $(".btn-delete").click(function () {
        console.log(".btn-delete");        
        
        //delete event content for time by making description empty
        let database = {
            daily : {
                [(moment().format("YYYYMMDD"))]: {
                    [time_holder.innerText]: {
                        description: '',
                        state: 0
                    }
                }
            }
        };
        // Update Database
        set_Database(database);
       
        // Delete from daily scheduler
        document.getElementById("description_"+ time_holder.innerText).innerText = '';
        
        // Hide Window to go back to calendar
        $("#add_TimeBlock_Event").modal("hide");

        //wait .5 seconds then reset buttons to defaults ( once off screen )
        setTimeout(function() {
            set_BTN_Defaults();    
          }, 500);
    });
};

//-- MODAL -> END
/* -------------------------------------------------------------------------- */
//-- SCHEDULER -> START

function build_Schedule(){
    /* Builds the calendar */
    
    console.log("//-- function build_Schedule()");
    //-- Defining Local Variables

    
    // GET database
    let database = JSON.parse(localStorage.getItem(database_Name));

    // Extract settings
    database_Settings = database.settings;
    // start of business hours. //
    let hours_Start = database_Settings.defaults.dayStart;
    // end of business hours.   //
    let hours_End = database_Settings.defaults.dayEnd;

    // All Time Values
    let database_Times = database.settings.times;
    // 12 or 24 hours?
    let database_TimeFormat = database_Settings.defaults.timeFormat;
    // console.log("database_TimeFormat: ",database_TimeFormat)

    let database_Daily = database.daily;

    //-- Building HTML --//
    
    // Grabbing div
    let schedule_Today = document.getElementById("schedule_Today");
    
    // Make sure there is nothing in list from previous questions
    schedule_Today.innerHTML="";

    for(let i =0; i < hours_Day; i++) {
       
        if (i >= hours_Start && i <= hours_End){
           
           // create div element
           var div = document.createElement("div");
           
           
           //console.log(database_Times[i][12])
           
           //update ID to be the hour
           div.setAttribute("id",database_Times[i][database_TimeFormat]);
                   
           //update class to be a ROW for CSS
           div.setAttribute("class","row");
           
           div.setAttribute("data-toggle","modal")
           div.setAttribute('data-target','#add_TimeBlock_Event');
           
           // Past-Tense
           if (now() > i){
            div.setAttribute("class","past row time-block");
            } 
            // Present-Tense
            else if (now() == i) {
                div.setAttribute("class","present row time-block");
            }
            // Future-Tense
            else {
                div.setAttribute("class","future row time-block");
            }
  
            //database_Daily
            if (database_Times[i][database_TimeFormat] in database_Daily[(moment().format("YYYYMMDD"))]) {
                
                div.innerHTML = (
                    "<span class='hour'>"+database_Times[i][database_TimeFormat]
                    +"</span>"
                    +"<span class='description' id='description_"
                    +(database_Times[i][database_TimeFormat])
                    +"'>"
                    +[database_Daily[(moment().format("YYYYMMDD"))][database_Times[i][database_TimeFormat]].description]
                    +"</span>"
                 );
                // console.log("dbdaily[i]: ",database_Times[i][database_TimeFormat]);
            } else {
                div.innerHTML = (
                    "<span class='hour'>"+database_Times[i][database_TimeFormat]
                    +"</span>"
                    +"<span class='description' id='description_"
                    +(database_Times[i][database_TimeFormat])
                    +"'></span>"
                );        
            }
            schedule_Today.appendChild(div);
        }        
    };
    // show ONCE loaded
    document.getElementById("schedule_Today").style.display = "block";
};
  

//-- SCHEDULER -> END
/* -------------------------------------------------------------------------- */
//-- ADD EVENT -> START


    
//-- ADD EVENT -> START
/* -------------------------------------------------------------------------- */
/* DATABASE MANGEMENT -> START */

function get_Database(){
    // Used to know what to build and extract questions from database to build

    // Get Database
    let database_Current = JSON.parse(localStorage.getItem(database_Name));
    console.log("database_Current: ",database_Current);
    // If database exists
    if (database_Current != null) {
        
        // if daily key doesn't exist, create it
        if (("daily" in database_Current) == false) {
            database_Current['daily'] = {};
        };
        
        
        // if settings key doesn't exist, create it
        if (database_Current.settings == null) {
            database_Current['settings'] = {};
        };
    };
    return database_Current;
};


function set_Database(entry) {
    /* Ran to update and Create database. If no entry provided, NP. It will just
        rebuild existing or build a new one. */
   
     //--------------------------------//
     //-- var used locally

    // obj to hold what will be written back to LocalStorage. Defining so always creates.
    let DailyScheduler_Holder = {daily: {},settings:{} };
    
    // Used to hold daily data DB values
    let daily = {};
    // Used to hold settings DB values
    let settings = {};
    
     //--------------------------------//
     // DATABASE VERIFICATION -> START // 
    
    // Getting local storage database to add to new OBJ to re-write to storage once verified
    let database_Current = get_Database(); 

    // If Database exists, verify key/value pairs
    if (database_Current != null) {
        //--------------------------------//
        // DAILY VERIFY -> START  //
        
        // If daily is defined, grab it's content
        if (database_Current.daily != null) {
            daily = database_Current.daily;
        }
        else {
        }
        
        // LEADERBOARD VERIFY -> END  //
        //--------------------------------//
        // SETTINGS VERIFY -> START  //
        
        // If Settings doesn't exist, count and store existing settings in local var
        if (database_Current.settings != null) {
            settings = database_Current.settings;
        }
        // SETTINGS VERIFY -> END  //
        //--------------------------------//
    }
    // If Database doesn't exist ( shouldn't happen ) 
    // TODO:: 11/27/2021 #EP || Welcome Message trigger?
    else { 
        console.log("// ./assets/js/script.js function set_Database(entry) - ELSE. ( see admin )");
    };

    // DATABASE VERIFICATION -> END // 
    //--------------------------------//
    //-- VALIDATE ENTRY -> START //

    
    //-- TODO:: 12/04/2021 #EP || be able to take entry. Make sure it's accurate
    //-- If Entry is provided, merge data. On load ALWAYS provides default dict
    if(entry != undefined){
        
        //-- If daily edit is saved --//
        if("daily" in entry){
            console.log("Daily key exists in entry: ", daily);
            // TODO:: 12/01 #EP || Get Hour and Description IF EU pressed save, prepare to write
            // Get daily value and updated it
            
            // if (entry.daily == daily){
            //     console.log("Yes");
            // } else {
            //     console.log('no');
            // }

            // Build daily results
            for (key in entry.daily){
                console.log("entry.daily[key]: ", key)
                
                
                // If the current DAY is in the database already
                if(daily[key] != undefined){
                    // set Last Login time to now
                    daily[key].login_Last = now_full();
                }
                
                // IF date isn't in database, add it.
                else {
                    console.log("Key",key, "not yet enetered by EU. Added to database.")
                    //No there yet so adding it
                    daily[key] = entry.daily[key];
                }
            };
            
            //Itterate through dates in entries, update database accordingly.
            for(date in entry.daily){
                
                for (time in entry.daily[date]){
                    console.log(entry.daily[date][time]);
                    daily[date][time] = entry.daily[date][time];
                }
            }
            
            // Merge daily logs together from curent and entry
            // daily = Object.assign({},daily, entry.daily);
            console.log("Daily: ",daily)
        };

        //-- If setting edit is saved --//
        if ("settings" in entry){
            console.log("Settings key exist in entry: ", settings);
            
            // Merge settings together from curent and entry
            settings = Object.assign({},settings, entry.settings);            
        } 
    };    
    //-- VALIDATE ENTRY -> END //
    //--------------------------------//
    // DAILY BUILD -> START //
    /* itterate and rebuild daily */ 

    // get ALL keys within daily
    let keys = Object.keys(daily);
    // add them to new OBJ used to update Local Storage
    keys.forEach((key) => {
        // Add key to dictionary
        DailyScheduler_Holder.daily[key] = (daily[key]);
    });
    // DAILY BUILD - END //
    //--------------------------------//
    /* SETTINGS BUILD -> START *
    /* itterate and rebuild daily */ 

    // get ALL keys within settings
    keys = Object.keys(settings);
    // add them to new OBJ used to update Local Storage
    keys.forEach((key) => {
        // Add key to dictionary
        DailyScheduler_Holder.settings[key] = settings[key];
    });
    /* SETTINGS BUILD -> END */

    //--------------------------------//
    // END OF BUILDING DICTIONARY //
    //--------------------------------//

    // Updating Database
    localStorage.setItem(database_Name, JSON.stringify(DailyScheduler_Holder));
};

/* DATABASE MANGEMENT -> END */
/* -------------------------------------------------------------------------- */
/* VERIFY DATABASE --> START */

console.log("//-- script.js Running set_Database()...")

// MAKE SURE DATABASE EXISTS
function verify_build_Database() {
    
    // fully fleshed out all hours for just 1 day. 
        // TODO:: 12/01/2021 #EP || This best way to do it?
    
    // console.log(moment().format("YYYY/MM/DD"));
    
    let a_DailyScheduler = {
        daily: {
            //build todays date into database
            [(moment().format("YYYYMMDD"))]: {
                login_First: now_full(),
                login_Last: now_full(),
            }
        },
        settings: {
           defaults: {
               timeFormat: 12, // 12 or 24

               // Business Hours - in military time for settings
               dayStart: 8, 
               dayEnd: 18
           },

           // If user defines these settings, will over-ride defaults
           user: {
               timeFormat: null,
               dayStart: null,
               dayEnd: null,
           },
            times : {
                 0: {
                    state: 0, 
                    description: null,
                    12: '12:00 AM',
                    24: '00:00 AM'
                },
                1: {
                    state: 0,
                    description: null,
                    12: '01:00 AM',
                    24: '01:00 AM'
                },
                2 : {
                    state: 0,
                    description: null,
                    12: '02:00 AM',
                    24: '02:00 AM'
                },
                3 : {
                    state: 0,
                    description: null,
                    12: '03:00 AM',
                    24: '03:00 AM'
                },
                4: {
                    state: 0,
                    description: null,
                    12: '04:00 AM',
                    24: '04:00 AM',
                },
                5: {
                    state: 0,
                    description: null,
                    12: '05:00 AM',
                    24: '05:00 AM'
                },
                6: {
                    state: 0,
                    description: null,
                    12: '06:00 AM',
                    24: '06:00 AM'
                },
                7: {
                    state: 0,
                    description: null,
                    12: '07:00 AM',
                    24: '07:00 AM'
                },
                8: {
                    state: 0,
                    description: null,
                    12: '08:00 AM',
                    24: '08:00 AM'
                },
                9 : {
                    state: 0,
                    description: null,
                    12: '09:00 AM',
                    24: '09:00 AM'
                },
                10 : {
                    state: 0,
                    description: null,
                    12: '10:00 AM',
                    24: '10:00 AM'
                },
                11 : {
                    state: 0,
                    description: null,
                   12: '11:00 AM',
                   24: '11:00 AM'
                },
                12 : {
                    state: 0,
                    description: null,
                    12: '12:00 PM',
                    24: '12:00 PM'
                },
                13 : {
                    state: 0,
                    description: null,
                    12: '01:00 PM',
                    24: '13:00 PM'
                },
                14 : {
                    state: 0,
                    description: null,
                    12: '02:00 PM',
                    24: '14:00 PM'
                },
                15 : {
                    state: 0,
                    description: null,
                    12: '03:00 PM',
                    24: '15:00 PM'
                },
                16 : {
                    state: 0,
                    description: null,
                    12: '04:00 PM',
                    24: '16:00 PM'
                },
                17 : {
                    state: 0,
                    description: null,
                    12: '05:00 PM',
                    24: '17:00 PM'
                },
                18 : {
                    state: 0,
                    description: null,
                    12: '06:00 PM',
                    24: '18:00 PM'
                },
                19 : {
                    state: 0,
                    description: null,
                    12: '07:00 PM',
                    24: '19:00 PM'
                },
                20 : {
                    state: 0,
                    description: null,
                    12: '08:00 PM',
                    24: '20:00 PM'
                },
                21 : {
                    state: 0,
                    description: null,
                    12: '09:00 PM',
                    24: '20:00 PM'
                },
                22 : {
                    state: 0,
                    description: null,
                    12: '10:00 PM',
                    24: '22:00 PM'
                },
                23 : {
                    state: 0,
                    description: null,
                    12: '11:00 PM',
                    24: '23:00 PM'
                },
                24 : {
                    state: 0,
                    description: null,
                    12: '12:00 PM',
                    24: '24:00 PM'
                },
            }
        }
    };

    console.log("aDailyScheduler: ",a_DailyScheduler)
    //TODO:: 12/01/2021 #EP || Add build database stuff here

    // localStorage.setItem("a_DailyScheduler",JSON.stringify(a_DailyScheduler));
    // Set Default Database 
    set_Database(a_DailyScheduler);
    
};

/* VERIFY DATABASE --> END */
/* -------------------------------------------------------------------------- */
/* VERIFY TIMEBLOCK_TENSE --> START */


 //-- Update if times pass
function set_TimeBlock_Tense(){

    // Bool for present tense 
    let hour_Current = false;

    // Itterate each business hour
    $(".row").each(function(index, el) {
        
        // Present-Tense
        if(el.id == (moment().format("hh:00 A"))){
            document.getElementById(el.id).classList = "present row time-block";
            hour_Current = true; //Makes sure only 1 hour is current
        } 
        // Future-Tense
        else if (hour_Current == true) {
            document.getElementById(el.id).classList = "future row time-block";
        } 
        // Past-Tense
        else {
            document.getElementById(el.id).classList = "past row time-block";
        }
    });
};
//-- set_TimeBlock_Tense() --> END



/* VERIFY TIMEBLOCK_TENSE --> END */
/* -------------------------------------------------------------------------- */
/* RUN-LOOP --> START */

// ONCE Document is loaded
$(document).ready( function(){
    verify_build_Database();
    build_Schedule();
    set_BTN_Defaults();
});

// Event that re-runs every X miliseconds to keep up to date
setInterval(function () {
    
    //Update Date
    document.getElementById("currentDay").innerText = today();
    //Update Time
    document.getElementById("currentTime").innerText = now_full();

    set_TimeBlock_Tense();
}, 1000); // }, 1800000); // 30 minutes

/* RUN-LOOP --> END */
