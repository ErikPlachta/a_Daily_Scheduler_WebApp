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
};

    
//-- SCHEDULER -> END
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* DATABASE MANGEMENT -> START */

function get_Database(){
    // Used to know what to build and extract questions from database to build

    // Get Database
    let database_Current = JSON.parse(localStorage.getItem(database_Name));
    
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
    // DAILY BUILD - START //
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
    let daily = {
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
    };

    let settings = {
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

    //TODO:: 12/01/2021 #EP || Add build database stuff here
};
