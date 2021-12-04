/* -------------------------------------------------------------------------- */
//-- GLOBALS -> START

// DIV containin all times
const schedule_Today = $("#schedule_Today");
// For local storage DB
const database_Name = "a_DailyScheduler";
// Moment JS date
const today = moment().format("dddd, MMMM Do YYYY");
// Update to Today
document.getElementById("currentDay").innerText = today;

// hour in 24 hour format
const now = moment().format("HH");

const now_full = moment().format("hh:mm:ss A");
document.getElementById("currentTime").innerText = now_full;

//-- GLOBALS -> END
/* -------------------------------------------------------------------------- */
//-- SCHEDULER -> START

function build_Schedule(){
    /* Builds the calendar */
    
    console.log("function build_Schedule()");
    
    //-- Defining Local Variables

    // in military time //
    let hours_Day = 24;

    console.log("in build_Schedule()")
    
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
    console.log(database_TimeFormat)

    //-- Building HTML --//
    
    // Grabbing div
    let schedule_Today = document.getElementById("schedule_Today");
    
    // Make sure there is nothing in list from previous questions
    schedule_Today.innerHTML="";

    for(let i =0; i < hours_Day; i++) {
       
        if (i >= hours_Start && i <= hours_End){
           
           // create div element
           var div = document.createElement("div");
           
           
        //    console.log(database_Times[i][12])
           
           //update ID to be the hour
           div.setAttribute("id","hour_"+database_Times[i][database_TimeFormat]);
           
           //update class to be an HOUR for CSS
           div.setAttribute("class","hour");
           
           //update class to be a ROW for CSS
           div.setAttribute("class","row");
           
           // if time in the past
           if (now > i){
            div.setAttribute("class","past row time-block");
            } 
            else if (now == i) {
                div.setAttribute("class","present row time-block");
            }
            else {
                div.setAttribute("class","future row time-block");
            }
            div.innerHTML = ("<span class='hour'>"+database_Times[i][database_TimeFormat]+"</span>"); 
            schedule_Today.appendChild(div);
        }
        
    };
};

    
//-- SCHEDULER -> END
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* DATABASE MANGEMENT -> START */

function get_Database(){
    // Used to know what to build and extract questions from database to build

    // Get Database
    let database_Current = JSON.parse(localStorage.getItem(database_Name));
    console.log(database_Current);
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

    

    //-- If Entry is undefined, move on. Otherwise evaluate
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

            for (key in entry.daily){
                // console.log(key);
                if(daily[key] != undefined){
                    console.log("here: ",key, daily[key]);
                    daily[key].login_Last = now_full;
                } else
                {
                    console.log("not here");
                    //Not here yet, so adding to dict
                    daily[key] = daily[key];
                }
            }
            
            
        }

        //-- If setting edit is saved --//
        if ("settings" in entry){
            console.log("Settings key exist in entry: ", settings);
            // TODO- Determine if this is going to be editable
            
            // Get settings value and updated it
            // settings += entry.settings;
            
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
/* RUNNING */
console.log("//-- script.js Running set_Database()...")
set_Database();

function verify_build_Database() {
    
    // fully fleshed out all hours for just 1 day. 
        // TODO:: 12/01/2021 #EP || This best way to do it?
    
    // console.log(moment().format("YYYY/MM/DD"));
    
    let a_DailyScheduler = {
        daily: {
            //build todays date into database
            [(moment().format("YYYYMMDD"))]: {
                login_First: now_full,
                login_Last: now_full,
            }
        },
        settings: {
           defaults: {
               timeFormat: 12, // 12 or 24

               // Business Hours - in military time for settings
               dayStart: 6, 
               dayEnd: 20
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

    //TODO:: 12/01/2021 #EP || Add build database stuff here

    // localStorage.setItem("a_DailyScheduler",JSON.stringify(a_DailyScheduler));
    // Set Default Database 
    set_Database(a_DailyScheduler);
    
};
verify_build_Database();

build_Schedule();