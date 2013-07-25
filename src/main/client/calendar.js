var lymphUtils = require("lymph-utils")

var arrays = lymphUtils.arrays

var h = require("lymph-client").html
var d = require("lymph-dates").dates

var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"]

module.exports = function (startDate) {
    return h.TABLE(
        h.THEAD(calDaysOfWeek(dayNames)),
        h.TBODY(calWeeksOfMonth(2013, 0)))
}

function calDaysOfWeek (names) {
    return h.TR(arrays.map(function (n) {
        return h.TD(n)
    }, names))
}

function calWeeksOfMonth (year, month) {
    var weeks = []
    var s = h.space()
    for (var i = 0; i < 6; i++) {
        weeks.push(calDaysOfWeek([s, s, s, s, s, s, s]))
    }
    return weeks
}

function isLeapYear (year) { 
    return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
}

function daysInFeb (year) {
    return (isLeapYear(year) ? 29 : 28)
}

function daysInMonth (year, month) {
    return [31, daysInFeb(), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
}

function daysOfMonth (year, month) {
    var days = []
    for (var i = 1; i <= daysInMonth(year, month); i++) {
        days.push(i)
    }
    return days
}

function buildNavigation () {
    var navigationBar = document.createElement("div");
    navigationBar.className = "jsc-calendar-bar";

    var prev = document.createElement("span");
    var next = document.createElement("span");

    prev.innerHTML = "<<";
    prev.className = "prev";

    if (!prev.addEventListener) {
        prev.attachEvent("onclick", function(ev){
            self.currentStartDate = jsc.Calendar.addMonth(self.currentStartDate, -1);
            self.update(self.currentStartDate);
        });
    }
    else {
        prev.addEventListener("click", function(ev){
            self.currentStartDate = jsc.Calendar.addMonth(self.currentStartDate, -1);
            self.update(self.currentStartDate);
        }, false);
    }

    navigationBar.appendChild(prev);

    next.innerHTML = ">>";
    next.className = "next";

    if (!next.addEventListener) {
        next.attachEvent("onclick", function(ev){
            self.currentStartDate = jsc.Calendar.addMonth(self.currentStartDate, 1);
            self.update(self.currentStartDate);
        });
    }
    else {
        next.addEventListener("click", function(ev){
            self.currentStartDate = jsc.Calendar.addMonth(self.currentStartDate, 1);
            self.update(self.currentStartDate);
        }, false);
    }

    navigationBar.appendChild(next);

    return navigationBar;
}

function initer () {
    options = options || {};

    self.startDate = jsc.Calendar.zeroTime(options.startDate || new Date());
    self.selectedDate = undefined;//jsc.Calendar.zeroTime(options.startDate || new Date());
    self.selectedDateEl1 = undefined;//jsc.Calendar.zeroTime(options.startDate || new Date());
    self.selectedDateEl2 = undefined;//jsc.Calendar.zeroTime(options.startDate || new Date());
    self.numberOfMonths = options.numberOfMonths || 1;
    self.hasNavigation = options.hasNavigation || false;
    self.rangeEpochs = [];
    self.selectionEpochs = [];
    self.selectionMode = options.selectionMode || "single"; 
    self.selectionClass = options.selectionClass;
    self.rangeClass = options.rangeClass || "";

    self.targetId = targetId;

    self.numberOfWeeks = 6;
    self.numberOfDaysInWeek = 7;
    self.el = document.createElement("div");
    self.el.className = "jsc-calendar";

    self.months = document.createElement("div");
    self.months.className = "jsc-calendar-months";
    self.el.appendChild(self.months);

    self.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if(self.hasNavigation){
        self.el.insertBefore(buildNavigation(), self.months);
    }
}

function zeroTime(initDate){
    var newDate = new Date(initDate);
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
}

function datesInRange(startEpoch, endEpoch){
    var epochArray = [];
    var currentEpoch = startEpoch;
    while(currentEpoch <= endEpoch){
        epochArray.push(currentEpoch);
        currentEpoch = jsc.Calendar.addDay(currentEpoch, 1);
    }
    return epochArray;
}

function addMonth (date, amount) {
    var n = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + amount * 1);
    date.setDate(Math.min(n, jsc.Calendar.getDaysInMonth(date.getFullYear(), date.getMonth())));
    return date;
}

function addDay (date, amount){
    var newDate = new Date(date);
    newDate.setHours(0)
    newDate.setDate(newDate.getDate()+amount);
    return newDate.getTime();
}

function update (startDate){
    var table, self = this;

    function buildCaption(date){
        var caption = document.createElement("caption"),
            text = document.createTextNode(self.monthNames[date.getMonth()]);
        caption.appendChild(text);
        return caption;
    }

    function buildMonth(firstDateOfMonth){
        var body = document.createElement("tbody"),
            lastDateOfMonth = new Date(firstDateOfMonth),
            currentDateOfMonth = new Date(firstDateOfMonth),
            currentTime = currentDateOfMonth.getTime();

        lastDateOfMonth.setMonth(firstDateOfMonth.getMonth()+1);
        lastDateOfMonth.setDate(0);

        for(var x = 0; x < self.numberOfWeeks; x++){
            var tr = document.createElement("tr");
            for(var y = 0; y < self.numberOfDaysInWeek; y++){
                var td = document.createElement("td");

                if(self.selectedDate && self.selectedDate.getTime() === currentTime){
                    $(td).addClass("jsc-calendar-selected");
                }

                if(currentDateOfMonth.getDay() === y && currentDateOfMonth <= lastDateOfMonth){
                    td.innerHTML = currentDateOfMonth.getDate();
                    td.setAttribute("data-date", currentTime);
                    if(self.rangeEpochs.indexOf(currentTime) >= 0){
                        $(td).addClass(self.rangeClass);
                    }
                    currentDateOfMonth = new Date(jsc.Calendar.addDay(currentTime, 1));
                    currentTime = currentDateOfMonth.getTime();
                }else{
                    td.innerHTML = "&nbsp;";
                }
                tr.appendChild(td);
            }
            body.appendChild(tr);
        }
        return body;
    }

    function handleTableClick(evt){
        var selectedEpocs = [];
        if(self.selectionMode === "range"){
            if(self.selectedDateEl1 === undefined && self.selectedEl2 === undefined){
                self.selectedDateEl1 = evt.srcElement;
                $(self.selectedDateEl1).addClass(self.selectionClass);
            }else if(self.selectedDateEl1 !== undefined && self.selectedDateEl2 === undefined){
                if(self.selectedDateEl1.getAttribute("data-date") < evt.srcElement.getAttribute("data-date")){
                    self.selectedDateEl2 = evt.srcElement;
                    $(self.selectedDateEl2).addClass(self.selectionClass);
                    selectedEpocs = jsc.Calendar.datesInRange(
                        parseInt(self.selectedDateEl1.getAttribute("data-date"), 0),
                        parseInt(self.selectedDateEl2.getAttribute("data-date"), 0)
                    );
                    selectedEpocs.forEach(function(epoch){
                        $("[data-date='"+epoch+"']", self.months).first().addClass(self.selectionClass);
                    });
                }
            }else if(self.selectedDateEl1 !== undefined && self.selectedDateEl2 !== undefined){
                selectedEpocs = jsc.Calendar.datesInRange(
                    parseInt(self.selectedDateEl1.getAttribute("data-date"), 0),
                    parseInt(self.selectedDateEl2.getAttribute("data-date"), 0)
                );
                selectedEpocs.forEach(function(epoch){
                    $("[data-date='"+epoch+"']", self.months).first().removeClass(self.selectionClass);
                });
                self.selectedDateEl1 = evt.srcElement;
                $(self.selectedDateEl1).addClass(self.selectionClass);
                self.selectedDateEl2 = undefined;
            }else{
                console.log("jsc.Calendar: what just happened");
            }
        }else{
            self.selectedDate = new Date(parseInt(evt.srcElement.getAttribute("data-date"), 0));
            self.selectedDate.setDate(parseInt(evt.srcElement.innerHTML, 0));
            if(self.selectedDateEl1){
                $(self.selectedDateEl1).removeClass("jsc-calendar-selected");
            }
            self.selectedDateEl1 = evt.srcElement;
            $(self.selectedDateEl1).addClass("jsc-calendar-selected");
        }
    }

    self.months.innerHTML = "";

    for(var i = 0; i < self.numberOfMonths; i++){
        var firstDateOfMonth = jsc.Calendar.addMonth(new Date(startDate), i);
        firstDateOfMonth.setDate(1);

        table = document.createElement("table");
        table.appendChild(buildCaption(firstDateOfMonth));
        table.appendChild(buildHeader());
        table.appendChild(buildMonth(firstDateOfMonth));

        if (!table.addEventListener) {
            table.attachEvent("onclick", handleTableClick);
        }
        else {
            table.addEventListener("click", handleTableClick, false);
        }

        self.months.appendChild(table);
    }
}

function render (data){
    var self = this;
    data = data || {};
    self.rangeEpochs = data.rangeEpochs || [];
    self.currentStartDate = jsc.Calendar.zeroTime(self.startDate || new Date());
    self.update(self.startDate);
    document.getElementById(self.targetId).appendChild(self.el);
}

function addDates (newEpochs){
    var self = this;
    self.rangeEpochs = self.rangeEpochs.concat(newEpochs);
    self.currentStartDate = jsc.Calendar.zeroTime(self.startDate || new Date());
    self.update(self.startDate);
}

function clearSelection (){
    var self = this;
    var selectedItems = self.months.querySelectorAll("."+self.selectionClass);
    for(var i = 0; i < selectedItems.length; i++){
        $(selectedItems[i]).removeClass(self.selectionClass);
    }
    self.selectedDateEl1 = undefined;
    self.selectedDateEl2 = undefined;
}

