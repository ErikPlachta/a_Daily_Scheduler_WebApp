/* -------------------------------------------------------------------------- */
//-- GLOBALS -> START

// DIV containin all times
const schedule_Today = $("#schedule_Today");
// For local storage DB
const database_Name = "a_DailyScheduler";


//-- GLOBALS -> END
/* -------------------------------------------------------------------------- */
//-- SCHEDULER -> START

function build_Schedule(){
    /* Builds the calendar */
    
    console.log("function build_Schedule()");
    
    //-- Defining Local Variables

    // in military time //
    let hours_Day = 24;
    // start of business hours. 7am //
    let hours_Start = 7;
    // end of business hours. 6 pm  //
    let hours_End = 18;

    //-- Building HTML
    
    // Grabbing div
    let schedule_Today = document.getElementById("schedule_Today");
    
    // Make sure there is nothing in list from previous questions
    schedule_Today.innerHTML="";

    for(let i =0; i < hours_Day; i++) {
       
        // console.log(i)
        // create div element
        var div = document.createElement("div");
        // add place holder content of hour
        div.innerText = i;
        //update ID to be the hour
        div.setAttribute("id","hour_"+i);
        //update class to be an HOUR for CSS
        div.setAttribute("class","hour");
        //update class to be a ROW for CSS
        // div.setAttribute("class","row");
        
        schedule_Today.appendChild(div);
    };
};

build_Schedule();

    
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
            console.log("Daily key exists in entry");
            // TODO:: 12/01 #EP || Get Hour and Description IF EU pressed save, prepare to write
            
            // Get daily value and updated it
            daily = description
        }

        //-- If setting edit is saved --//
        if ("settings" in entry){
            console.log("Settings key exist in entry");
            // TODO- Determine if this is going to be editable
            
            // Get settings value and updated it
            //settings[key_Setting] = value
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

function testing_BuildDatabase() {
    
    // fully fleshed out all hours for just 1 day. 
        // TODO:: 12/01/2021 #EP || This best way to do it?
    
    let a_DailyScheduler_demo = {
        daily: {
        '12/01/2021' : {
            '00:00' : {
                state: 0, 
                description: null
            },
            '01:00' : {
                state: 0,
                description: null
            },
            '02:00' : {
                state: 0,
                description: null
            },
            '03:00' : {
                state: 0,
                description: null
            },
            '04:00' : {
                state: 0,
                description: null
            },
            '05:00' : {
                state: 0,
                description: null
            },
            '06:00' : {
                state: 0,
                description: null
            },
            '07:00' : {
                state: 0,
                description: null
            },
            '08:00' : {
                state: 0,
                description: null
            },
            '09:00' : {
                state: 0,
                description: null
            },
            '10:00' : {
                state: 0,
                description: null
            },
            '11:00' : {
                state: 0,
                description: null
            },
            '12:00' : {
                state: 0,
                description: null
            },
            '13:00' : {
                state: 0,
                description: null
            },
            '14:00' : {
                state: 0,
                description: null
            },
            '15:00' : {
                state: 0,
                description: null
            },
            '16:00' : {
                state: 0,
                description: null
            },
            '17:00' : {
                state: 0,
                description: null
            },
            '18:00' : {
                state: 0,
                description: null
            },
            '19:00' : {
                state: 0,
                description: null
            },
            '20:00' : {
                state: 0,
                description: null
            },
            '21:00' : {
                state: 0,
                description: null
            },
            '22:00' : {
                state: 0,
                description: null
            },
            '23:00' : {
                state: 0,
                description: null
            },
            '24:00' : {
                state: 0,
                description: null
            },
        }
        },

        settings: {
           defaults: {
               timeFormat: "12", // 12 or 24

               // Business Hours - in military time for settings
               dayStart: "08:00", 
               dayEnd: "18:00"
           },

           // If user defines these settings, will over-ride defaults
           user: {
               timeFormat: null,
               dayStart: null,
               dayEnd: null,
           }
        }
    };

    //TODO:: 12/01/2021 #EP || Add build database stuff here

    localStorage.setItem("a_DailyScheduler",JSON.stringify(a_DailyScheduler_demo));
};
// testing_BuildDatabase();