function course_search_jquery() {
    // get form data
    var level = $('#level').val();
    var college = $('#colleges').val();
    var program = $('#programs').val();
    var subject = $('#subject').val();
    var catNum = $('#catalog_number').val();
    var classNum = $('#class_number').val();
    var grading = $('#grading').val();
    var session = $('#session').val();
    
    var it_commons = $('#it_commons').val();
    var online = $('#online').val();
    var gened = $('#gened').val();
    var honors = $('#honors').val();
    var writing = $('#writing').val();
    var oral = $('#oral').val();
    var infolit = $('#infolit').val();
    
    var special_restrictions = $('#spec_restrict').val();

    var semester = $('#semester').val();
    
    // is 0007 vs. 0009 the difference between Spring and Fall semesters?
    // the answer to that question is YES! -- Spring = 0007 and Fall = 0009
    
    // generate request parameter data
    var form_data = {
        'USER': semester,
        'DELIMITER': '\\t',

        'SUBST_STR': 'G:Graduate',
        'SUBST_STR': 'U:Undergraduate',
        'SUBST_STR': 'L:Lab',
        'SUBST_STR': 'D:Discussion',
        'SUBST_STR': 'S:Seminar',
        'SUBST_STR': 'I:Independent Study',
        'SUBST_STR': 'GRD:A-E',
        'SUBST_STR': 'SUS:Satisfactory/Unsatisfactory',
        'SUBST_STR': 'GLU:Load Credit or Unsatisfactory',
        'SUBST_STR': 'GRU:Research Credit or Unsatisfactory',

        'HEADING_FONT_FACE': 'Arial',
        'HEADING_FONT_SIZE': '3',
        'HEADING_FONT_COLOR': 'black',

        'RESULTS_PAGE_TITLE': '',
        'RESULTS_PAGE_BGCOLOR': '#F0F0F0',
        'RESULTS_PAGE_HEADING': '',
        'RESULTS_PAGE_FONT_FACE': 'Arial',
        'RESULTS_PAGE_FONT_SIZE': '2',
        'RESULTS_PAGE_FONT_COLOR': 'black',

        'NO_MATCHES_MESSAGE': 'Sorry, no courses were found that match your criteria.',
        'NO_PRINT': '3',
        'NO_PRINT': '4',
        'NO_PRINT': '6',
        'NO_PRINT': '7',
        'NO_PRINT': '8',
        'GREATER_THAN_EQ': '26',
        'NO_PRINT': '26',

        'Level': level,
        'College_or_School': college,
        'Department_or_Program': program,
        'Course_Subject': subject,
        'Course_Number': catNum,
        'Class_Number': classNum,
        'Course_Title': '',
        'Days': '',
        'Instructor': '',
        'Grading': grading,

        'Course_Info': '',
        'Meeting_Info': '',
        'Comments': '',
        'Credit_Range': '',
        'Component_is_blank_if_lecture': '',
        'Topic_if_applicable': '',
        'Seats_remaining_as_of_last_update': '',

        'Session': session,
        'IT_Commons_Course': it_commons,
        'Fully_Online_Course': online,
        'General_Education_Course': gened,
        'Honors_College_Course': honors,
        'Writing_Intensive_Course': writing,
        'Oral_Discourse_Course': oral,
        'Information_Literacy_Course': infolit,
        
        'Special_Restriction': ''
    }
    
    // make a post request
    $.post("http://www.albany.edu/cgi-bin/general-search/search.pl", form_data, function(data) {
        var results = document.getElementById("results_section");
        
        var remove = null;
        
        for(var e = 0; e < results.childNodes.length; e++) {
            var child = results.childNodes[e];
            
            if( child.id === 'search_results' ) remove = child;
        }
        
        if( remove != null ) {
            results.removeChild( remove );
        }
        
        parse(data, special_restrictions);
    });
}

function parse(data, specRestrict) {
    if( typeof(String.prototype.trim) === "undefined") {
        String.prototype.trim = function() {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }
    
    // create table
    var table = document.createElement('table');
    
    table.id = 'search_results';
    table.style.backgroundColor = '#CCFF99';
    table.style.borderBottom = '';
    
    var columns = new Array('Level', 'College', 'Department', 'Class Number', 'Grading', 'Course', 'Days', 'Time', 'Room', 'Instructor', 'Comments', 'Credit Range', 'Lab?', 'Notes/Topic', 'Seats Remaining', 'Session', 'Special Restrictions');
    
    var header = table.createTHead();
    
    var row = header.insertRow(0);
    
    row.style.backgroundColor = 'blue';
    row.style.color = 'white';
    
    var cell;
    
    var index = 0;
    var len = columns.length;
    
    for (index; index < len; index++) {
        cell = row.insertCell(index);
        cell.innerHTML = columns[index];
    }
    
    var colleges = {
        'College of Computing &amp; Information':'CCI',
        'College of Engineering and Applied Sciences':'CEAS',
        'College of Arts and Sciences': 'CAS',
        'School of Education': 'SED',
        'Rockefeller College of Public Affairs & Policy': 'RCPAP',
        'Coll Emergency Prep,HomelandSecurity&Cybersecurity': 'CEPHSCS'
    }
    
    // do the actual parsing
    var tag = 0; // is the current data inside a tag
    var rowNum = 1;
    var cellNum = 0;
    
    var temp = '';
    var strtemp = '';
    var row1 = null;
    var cell1 = null;
    
    var lineCount = 0;
    
    var index2 = 0;
    var len2 = data.length;
    
    // go through every character
    for (index2; index2 < len2; index2++) {
        var ch = data[index2];
        
        // skip over html tags
        if( ch === '<' )      tag = 1; // opening tag
        else if( ch === '>' ) tag = 0;  // closing tag

        // if the current data isn't inside part of an opening/closing tag
        if( tag === 0 ) {
            if( ch === '\n' ) {
                lineCount = lineCount + 1;
                console.log('LINE ' + lineCount);
                
                if( temp === '\n' || temp === '' ) continue;

                if( temp.length > 3 && temp[2] != '\n' ) {
                    var match_count = temp.includes('Number of matches:');
                    var it_commons  = temp.includes('IT Commons Course:');
                    var online      = temp.includes('Fully Online Course:');
                    var gen_ed      = temp.includes('General Education Course:');
                    var honors      = temp.includes('Honors College Course:');
                    var writing     = temp.includes('Writing Intensive Course:');
                    var oral_disc   = temp.includes('Oral Discourse Course:');
                    var info_lit    = temp.includes('Information Literacy Course:');
                    
                    if( !(match_count || it_commons || online || gen_ed || honors || writing || oral_disc || info_lit) ) {
                        console.log('Row: ' + rowNum);
                        console.log('Cell: ' + cellNum);
                        
                        console.log('temp: ' + temp);
                        
                        var temp1 = temp.split(':');
                        
                        // NOTE: KLUDGE FIX FOR MEETING INFO FORMAT
                        if( temp.startsWith('Meeting Info') ) {
                            var num = temp.indexOf(':');
                            
                            var temp2 = temp.substring(num + 1, temp.length).trim().split(' ');
                            
                            console.log('temp2: ', temp2);
                            
                            var num2 = 0;
                            
                            var start = temp1[0];
                            temp1 = [];
                            temp1[0] = start;
                            
                            for(var num2 = 0; num2 < temp2.length; num2++) {
                                temp1[num2 + 1] = temp2[num2];
                            }
                        }
                        
                        // show pieces of line split
                        for(var i=0; i < temp1.length; i++) {
                            console.log('temp1[' + i + ']: ' + temp1[i]);
                        }

                        // Level
                        if( temp.includes('Level') ) {
                            // create a new row
                            row1 = table.insertRow(rowNum);
                            
                            row1.id = 'results_row' + rowNum;
                            
                            row1.style.borderBottom = 'border-bottom: 1px solid #ccc';
                            
                            cell1 = row1.insertCell(cellNum++);
                            
                            cell1.id = row1.id + 'level';
                            
                            cell1.style.align="center";
                            
                            cell1.style.height = "100px"; // KLUDGE to make the whole row a certain height

                            if( temp1.length > 1 ) {
                                var level = temp1[1].trim();

                                console.log('Level: \'' + level + '\'')

                                switch(level) {
                                    case 'Undergraduate': cell1.innerHTML = 'UG';  break;
                                    case 'Graduate':      cell1.innerHTML = 'G';   break;
                                    default:              cell1.innerHTML = level;  break;
                                }
                            }
                        }
                        // College or School
                        else if( temp.includes('College or School') ) {
                            cell1 = row1.insertCell(cellNum++);
                            
                            cell1.id = row1.id + '_college';

                            if( temp1.length > 1 ) {
                                //console.log('\'' + temp1[0] + '\'');
                                //console.log('\'' + temp1[1] + '\'');

                                c = temp1[1].trim();
                                
                                strtemp = colleges[c];
                                
                                if( typeof(strtemp) != 'undefined' ) cell1.innerHTML = strtemp;
                                else                                 cell1.innerHTML = temp1[1];
                                
                                strtemp = '';
                            }
                        }
                        // Department
                        else if( temp.includes('Department or Program') ) {
                             cell1 = row1.insertCell(cellNum++);
                             
                             cell1.id = row1.id + '_department';
                             
                             if( temp1.length > 1 ) {
                                 cell1.innerHTML = temp1[1].trim();
                             }
                        }
                        // Class Number
                        else if( temp.startsWith('Class Number') ) {
                            cell1 = row1.insertCell(cellNum++);
                            
                            cell1.id = row1.id + '_classnum';
                            
                            cell1.setAttribute('align', 'center');
                            
                            if( temp1.length > 1 ) {
                                cell1.innerHTML = temp1[1].trim();
                            }
                        }
                        // Grading
                        else if( temp.includes('Grading') ) {
                            cell1 = row1.insertCell(cellNum++);
                            
                            cell1.id = row1.id + '_grading';
                            
                            cell1.setAttribute('align', 'center');
                            
                            if( temp1.length > 1 ) {
                                var grading = temp1[1].trim();
                                
                                switch(grading) {
                                    case  'SUS': cell1.innerHTML = 'S/U';   break;
									case  'GRD': cell1.innerHTML = 'A-E';   break;
                                    default:     cell1.innerHTML = grading; break;          
                                }
                            }
                        }
						// Course Info
						else if( temp.includes('Course Info') ) {
							cell1 = row1.insertCell(cellNum++);
                            
                            cell1.id = row1.id + '_course';
                            
                            if( temp1.length > 1 ) {
								var temparray = temp1.slice(1, temp1.length);
								
								var temparray2 = temparray.join().trim().split(' ');
								
								console.log(temparray);
								console.log(temparray2);
								
								var ts1 = temparray2[0] + ' ' + temparray2[2];
								
								var temparray3 = temparray2.slice(3, temparray2.length);
								
								var ts2 = temparray3.join(' ');
								
								//cell1.innerHTML = ts1;
								//cell1.innerHTML = ts1 + '<br />' + ts2;

                                var clg = temparray2[0].substring(0, 1).toLowerCase();
                                var dep = temparray2[0].substring(1).toLowerCase();

                                var course_number = parseInt(temparray2[2]);

                                console.log( course_number );

                                if( course_number < 500 ) {
                                    // special cases for special pages
                                    if( temparray2[0] === 'ICSI' ) {
                                        cell1.innerHTML = '<a href="http://www.albany.edu/undergraduate_bulletin/I_csi.html">' + ts1 + '</a>';                                    
                                    }
                                    else {
                                        cell1.innerHTML = '<a href="http://www.albany.edu/undergraduate_bulletin/' + clg + '_' + dep + '.html">' + ts1 + '</a>';
                                    }
                                }
                                else {
                                   // special cases for special pages
                                    if( temparray2[0] === 'ICSI' ) {
                                        cell1.innerHTML = '<a href="http://www.albany.edu/graduatebulletin/a_csi.htm">' + ts1 + '</a>';                                    
                                    }
                                    else if( temparray2[0] === 'IINF' ) {
                                        cell1.innerHTML = '<a href="http://www.albany.edu/graduatebulletin/i_inf.htm">' + ts1 + '</a>';                                    
                                    }
                                    else {
                                        cell1.innerHTML = '<a href="http://www.albany.edu/graduatebulletin/' + clg + '_' + dep + '.htm">' + ts1 + '</a>';
                                    }
                                }
							}
						}
                        // Meeting Info
                        else if( temp.includes('Meeting Info') ) {
                            if( temp1.length > 1 ) {
                                var info = temp1.slice(1, temp1.length); // drop label
                                
                                console.log('Info: ' + info);
                                
                                var state = 'day';
                                
                                var index3 = 0;
                                var len3 = info.length;
                                
                                var states = new Array('day', 'time', 'room', 'instructor', 'done');
                                
                                //alert(info);
                                
                                /// Testing
                                /*
                                while(index3 < len3) {
                                    var data1 = info[index3];]
                                    
                                    console.log('index: ' + index3);
                                    console.log('state : ' + state);
                                    
                                    var day_cell = row1.insertCell(cellNum++);
                                    day_cell.id = row1.id + '_date';
                                    
                                    var time_cell = row1.insertCell(cellNum++);
                                    cell1.id = row1.id + '_time';
                                    
                                    var room_cell = row1.insertCell(cellNum++);
                                    cell1.id = row1.id + '_room';
                                    
                                    var instr_cell = row1.insertCell(cellNum++);
                                    cell1.id = row1.id + '_instructor';
                                    
                                    if( state === 'day' ) {
                                        
                                    }
                                    else if( state === 'time' ) {}
                                    else if( state === 'room' ) {}
                                    else if( state === 'instructor' ) {
                                    }
                                    
                                    index3++;
                                }
                                */
                                ///
                                
                                for(index3; index3 < len3; index3++) {
                                    var data1 = info[index3];
                                    
                                    //console.log(data1);
                                    
                                    console.log('index: ' + index3);
                                    console.log('state : ' + state);
                                    
                                    var regex = new RegExp('(\\d+)(:)(\\d)(\\d)(_)(.)(.)(-)(\\d+)(:)(\\d)(\d)(_)(.)(.)');
                                    
                                    if( state === 'day' ) {
                                        if( data1 === '-' ) {
                                            cell1 = row1.insertCell(cellNum++);
                                            
                                            cell1.id = row1.id + '_date';
                                            cell1.innerHTML = 'TBD';
                                        }
                                        else if( data1.includes('AM') || data1.includes('PM') ) {
                                            cell1 = row1.insertCell(cellNum++);
                                            
                                            cell1.id = row1.id + '_date';
                                            cell1.style.color = 'red';
                                            cell1.innerHTML = 'undefined';
                                            
                                            // FIX this kludge
                                            index3--;
                                        }
                                        else {
                                            days = data1;
                                            
                                            //var table2 = document.getElementsByName(row1.id + '_dates')[0];
                                            var table2 = null;
                                            
                                            if( table2 === null || typeof(table2) === "undefined" ) {
                                                //alert('table is NULL (' + row1.id + '_dates)');
                                                
                                                cell1 = row1.insertCell(cellNum++);
                                                
                                                cell1.id = row1.id + '_date';
                                                
                                                table2 = document.createElement("table");
                                                
                                                table2.id = 'mytable';
                                                table2.name = row1.id + '_dates';
                                            }
                                            
                                            var row2 = table2.insertRow(-1);
                                            
                                            // http://www.computerhope.com/htmcolor.htm
                                            var color_data = {
                                                'M':  { 'bgcolor': '#990012', 'color': 'white' }, // red (burgundy)
                                                'T':  { 'bgcolor': '#CC6600', 'color': 'white' }, // orange (sedona)
                                                'W':  { 'bgcolor': '#D4A017', 'color': 'white' }, // yellow (orange gold)
                                                'TH': { 'bgcolor': '#254117', 'color': 'white' }, // green (dark forest green)
                                                'R': { 'bgcolor': '#254117', 'color': 'white' },  // green (dark forest green)
                                                'F':  { 'bgcolor': '#2B3856', 'color': 'white' }  // blue (dark slate blue)
                                            };
                                            
                                            var ih;
                                            var bgcolor;
                                            var color;
                                            
                                            var boolDayFound = false;
                                            
                                            var str = '';
                                            
                                            for(var c = 0; c < days.length; c++) {
                                                var ch = days.charAt(c);
                                                
                                                str += ch;
                                                if( str === 'M' ) {       ih = 'M'; boolDayFound = true; }
                                                else if( str === 'T' ) {
                                                    var ch1 = days.charAt(c + 1);
                                                    
                                                    if( ch1 == null || ch1 != 'H' ) {
                                                        ih = 'T';
                                                        boolDayFound = true; 
                                                    }
                                                }
                                                else if( str === 'W' ) {  ih = 'W'; boolDayFound = true; }
                                                else if( str === 'TH' ) { ih = 'R'; boolDayFound = true; }
                                                else if( str === 'F' ) {  ih = 'F'; boolDayFound = true; }
                                                
                                                if( boolDayFound ) {
                                                    var cell2 = row2.insertCell(-1);
                                                    
                                                    n = n + 1;
                                                    
                                                    var colors = color_data[ih];
                                                    
                                                    cell2.innerHTML = ih;
                                                    cell2.style.backgroundColor = colors['bgcolor'];
                                                    cell2.style.color = colors['color'];
                                                    
                                                    str = '';
                                                    boolDayFound = false;
                                                }
                                            }
                                            
                                            ///
                                            
                                            cell1.appendChild( table2 );
                                        }
                                        
                                        state = 'time';
                                    }
                                    else if( state === 'time' ) {
                                        //var table3 = document.getElementsByName(row1.id + '_time').childNodes[0];
                                         var table3 = null;
                                        
                                        if( table3 === null || typeof(table3) == "undefined" ) {
                                            //alert('table is NULL (' + row1.id + '_times)');
                                            
                                            cell1 = row1.insertCell(cellNum++);
                                            
                                            cell1.id = row1.id + '_time';
                                        
                                            table3 = document.createElement('table');
                                            
                                            table3.id = 'mytable';
                                            table3.name = row1.id + '_times';
                                        }
                                        
                                        var row3 = table3.insertRow(-1);
                                        
                                        var time = data1.trim();
                                        
                                        console.log('time: ' + time);
                                        
                                        if( time === 'ARR') {
                                            //cell1.innerHTML = 'ARR';
                                            
                                            var cell3 = row3.insertCell(-1);
                                            cell3.innerHTML = 'ARR';
                                            
                                            var cell2 = row1.insertCell(cellNum++);
                                            cell2.innerHTML = 'ARR';
                                            
                                            state = 'instructor';
                                        }
                                        else{
                                            //cell1.innerHTML = time;
                                            
                                            var cell3 = row3.insertCell(-1);
                                            cell3.innerHTML = time;
                                            
                                            state = 'room';
                                        }
                                        
                                        cell1.appendChild( table3 );
                                    }
                                    else if( state === 'room' ) {
                                        cell1 = row1.insertCell(cellNum++);
                                        
                                        cell1.id = row1.id + '_room';
                                        
                                        cell1.innerHTML = data1;
                                        
                                        state = 'instructor';
                                    }
                                    else if( state === 'instructor' ) {
                                        console.log('data1: ' + data1);

                                        // TODO if data1 starts with 'AND' there is a second set
                                        // of meeting info to parse before we get to the instructor
                                        // and it needs to go in the same table

                                        ///if( data1.startsWith('AND') || data1.startsWith("M") || data1.startsWith("T") || data1.startsWith("W") || data1.startsWith("R") || data1.startsWith("F") ) {
                                        if( data1.startsWith('AND') ) {
                                            //state = 'day';
                                            //index3++;
                                        }
                                        else {
                                            cell1 = row1.insertCell(cellNum++);
                                            
                                            cell1.id = row1.id + '_instructor';
                                            
                                            var instructor = data1;
                                            
                                            switch(instructor) {
                                                case 'undefined':
                                                    cell1.style.color = 'red';
                                                    cell1.innerHTML = 'Unassigned';
                                                    break;
                                                default:
                                                    cell1.innerHTML = instructor;
                                                    break;
                                            }
                                            
                                            state = 'done';
                                        }
                                    }
                                }
                                
                                var lastStateNum = states.indexOf(state);
                                
                                for(var stateNum = lastStateNum + 1; stateNum < states.length; stateNum++) {
                                    console.log(states[stateNum]);
                                    
                                    var mi_table_cell = row1.insertCell(cellNum++);
                                    
                                    mi_table_cell.style.color = 'red';
                                    mi_table_cell.innerHTML = 'undefined';
                                }
                            }
                        }
                        else if( temp.startsWith('Comments') ) {
                            cell1 = row1.insertCell(cellNum++);
                            
                            cell1.setAttribute('width', '50px');
                            
                            //cell1.innerHTML = '';
                            
                            if( temp1.length > 1 ) {
                                var comment = temp1.slice(1, temp1.length).join(' ').trim();

                                console.log( temp1 );
                                console.log( comment );
                                
                                if( comment.startsWith('Fully Online (100%) - Asynchronous') ) {
                                    cell1.innerHTML = 'Fully Online (100%) - Asynchronous';
                                }
                                else if( comment.startsWith('Blended/Hybrid - Asynchronous') ) {
                                    cell1.innerHTML = 'Blended/Hybrid - Asynchronous';
                                }
                                else if( comment.includes('You may NOT enroll for this Class Number') ) {
                                    //cell1.innerHTML = 'You may NOT enroll for this Class #. Obtain BOTH the Class # & Permission # from the Instructor.';
                                    cell1.innerHTML = 'Class # & Permission # Required';
                                }
                                else if( comment === '' ) {
                                    cell1.style.color = 'red';
                                    cell1.innerHTML = 'None';
                                }
                                else {
                                    cell1.innerHTML = 'Comment';
                                    cell1.setAttribute('title', comment);
                                }
                            }
                        }
                        else if( temp.includes('Credit Range') ) {
                            cell1 = row1.insertCell(cellNum++);

                            var credit_range = temp1[1].trim();

                            cell1.innerHTML = credit_range;
                        }
                        else if( temp.includes('Component is blank if lecture') ) {
                            cell1 = row1.insertCell(cellNum++);

                            var comp = temp1[1].trim();

                            switch(comp) {
                                case 'D': cell1.innerHTML = 'Disc'; break;
                                case 'L': cell1.innerHTML = 'Lab'; break;
                                default:  cell1.innerHTML = '';     break;
                            }
                        }
                        else if( temp.includes('Topic if applicable') ) {
                            cell1 = row1.insertCell(cellNum++);
                            cell1.innerHTML = temp1[1].trim();
                        }
                        // Seats remaining as of last update
                        else if( temp.includes('Seats remaining as of last update') ) {
                            cell1 = row1.insertCell(cellNum++);
                            
                            cell1.id = 'seats_rem';
                            
                            if( temp1.length > 1 ) {
                                var seats = parseInt(temp1[1].trim())
                                
                                cell1.style.color = 'white';
                                
                                if( seats > 0 ) cell1.style.backgroundColor = 'green';
                                else            cell1.style.backgroundColor = 'red';
                                
                                cell1.innerHTML = seats;
                            }
                        }
                        else if( temp.includes('Session') ) {
                            cell1 = row1.insertCell(cellNum++);
                            
                            cell1.innerHTML = temp1[1].trim();
                        }
                        else if( temp.includes('Special Restriction') ) {
                            cell1 = row1.insertCell(cellNum++);
                            
                            var html = '';
                            
                            var work = temp;
                            
                            var i = work.indexOf(':');
                            
                            work = work.substring(i+1, work.length);
                            
                            work = work.replace(',','');
                            
                            work = work.replace('Seats Remaining for: ',',');
                            
                            work = work.replace('Seats Remaining for:',',');
                            
                            work = work.replace('Seats Remaining for any students:',', any students:')
                            
                            work = work.trim();
                            
                            work = work.replace(' - ',':');
                            
                            var arr = work.split(',');
                            
                            for(var n = 0; n < arr.length; n++) {
                                arr[n] = arr[n].replace(' - ',':');
                            }
                            
                            var arr2 = arr.slice(1, arr.length);
                            
                            //
                            html = html + '<table id="seat_restrict" style="height: 100%; width: 100%;">';
                            
                            //var hideRestricted = true;
                            var hideRestricted = false;
                            
                            for(var r = 0; r < arr2.length; r++) {
                                html = html + '<tr>';
                                
                                var req = arr2[r].split(':')[0];
                                var num = arr2[r].split(':')[1];
                                
                                if( req.trim() == specRestrict ) {
                                    //hideRestricted = false;
                                }
                                
                                html = html + '<td>' + req + '</td>';
                                //html = html + '<td>' + num + '</td>';
                                
                                if( num > 0 ) {
                                    html = html + '<td style="color:white; background-color:green; font-weight: bold; text-align: center !important;">' + num + '</td>';
                                }
                                else {
                                    html = html + '<td style="color:white; background-color:red; font-weight: bold; text-align: center !important;">' + num + '</td>';
                                }

                                html = html + '</tr>';
                            }
                            
                            html = html + '</table>';
                            
                            cell1.innerHTML = html;
                            
                            console.log('Row Done!');
                            console.log('Row: ' + rowNum + ' Cell: ' + cellNum);
                            
                            temp = '';
                            
                            if( hideRestricted ) table.deleteRow(rowNum);
                            else                 rowNum = rowNum + 1;
                            
                            cellNum = 0;
                            
                            //temp = '';
                            //rowNum = rowNum + 1;
                            //cellNum = 0;
                        }
                    }
                    else {
                        temp = '';
                    }
                }
                
                temp = '';
            }
            else if( ch != '<' && ch != '>' ) {
                temp = temp + ch;
                
                //console.log(ch)
                //console.log(temp);
            }
        }
    }
    
    var label = document.getElementById("num_results");
    
    label.innerHTML = rowNum + ' results.';
    
    document.getElementById("results_section").appendChild( table );
}