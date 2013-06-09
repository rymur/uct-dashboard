lymph.define("disks", function(require) {
    var h = require("lymph-client/html");
    var objects = {
        each: function(obj, fn) {
            for (var i in obj) {
                fn(obj[i]);
            }
        }
    };
    return {
        buildView: buildView,
        buildItemView: buildItemView,
        preProcess: preProcess
    };
    function buildView(data) {
        return h.SECTION(h.HEADER(h.I({
            "class": "icon-hdd"
        }), h.SPAN("Disks Usage")), h.TABLE({
            "class": "widget"
        }, h.THEAD(h.TH("Name"), h.TH("Used"), h.TH("Free"), h.TH("Total")), h.TBODY(data.map(buildItemView))));
    }
    function buildItemView(data) {
        var maxBytes = data.max / 2;
        var freeBytes = data.free / 2;
        var percent = percentageUsed(freeBytes, maxBytes);
        return h.TR(h.TD(data.name), h.TD(buildProgressView(percent)), h.TD({
            "class": "number"
        }, bytesToSize(freeBytes)), h.TD({
            "class": "number"
        }, bytesToSize(maxBytes)));
    }
    function buildProgressView(percentage) {
        return h.METER({
            low: "80",
            high: "95",
            max: "100",
            value: percentage,
            title: percentage + "% Used"
        });
    }
    function percentageUsed(free, max) {
        var used = max - free;
        return (used / max * 100).toFixed(2);
    }
    function bytesToSize(bytes) {
        var sizes = [ "KB", "MB", "GB", "TB" ];
        if (bytes == 0) return "n/a";
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + " " + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
    }
    function volume2name(vol) {
        if (vol === "I64SYS") {
            return "DISK0";
        } else if (vol === "IUSER_01") {
            return "DISK1";
        } else if (/IDATA_02[A-T]/.test(vol)) {
            return "DISK3";
        } else if (/IDATA_03[A-E]/.test(vol)) {
            return "DISK4";
        } else if (/IDATA_04[A-L]/.test(vol)) {
            return "DISK5";
        } else if (/IDATA_01[A-c]/.test(vol)) {
            return "DISK2";
        } else {
            return null;
        }
    }
    function hasVolumes(device) {
        return device.volCount > 0;
    }
    function transform(device) {
        return {
            name: volume2name(device.volName),
            description: "",
            free: device.free,
            max: device.max
        };
    }
    function preProcess(rawData) {
        var grouped = {};
        var groupedArray = [];
        rawData.filter(hasVolumes).map(transform).forEach(function(i) {
            if (!grouped[i.name]) {
                grouped[i.name] = i;
            } else {
                grouped[i.name].free = grouped[i.name].free + i.free;
                grouped[i.name].max = grouped[i.name].max + i.max;
            }
        });
        for (var i in grouped) {
            groupedArray.push(grouped[i]);
        }
        return groupedArray.sort(function(a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
    }
});

lymph.define("main", function(require) {
    var ajax = require("lymph-client/ajax");
    var disks = require("disks");
    var scheduling = require("scheduling");
    var measurements = require("measurements");
    var mainEl = $("#main");
    routie("/", function() {
        $("header.title nav a").removeClass("active");
        $("#navMeasurements").addClass("active");
        mainEl.html("");
        mainEl.append(measurements.buildView([]));
    });
    routie("/scheduling", function() {
        $("header.title nav a").removeClass("active");
        $("#navScheduling").addClass("active");
        mainEl.html("");
        mainEl.append(scheduling.buildView(new Date(), []));
    });
    routie("/admin", function() {
        $("header.title nav a").removeClass("active");
        $("#navAdmin").addClass("active");
        mainEl.html("");
        ajax.get("/cgi-bin/disks.com", function(data) {
            mainEl.append(disks.buildView(disks.preProcess(data)));
        });
    });
});

lymph.define("measurements", function(require) {
    var h = require("lymph-client/html");
    return {
        buildView: buildView,
        buildItemView: buildItemView
    };
    function buildView(data) {
        var view = h.SECTION(h.HEADER(h.I({
            "class": "icon-picture"
        }), h.SPAN("Measurements")), h.TABLE({
            "class": "widget"
        }, h.THEAD(h.TH(h.INPUT({
            id: "checkAll",
            type: "checkbox"
        })), h.TH("Date"), h.TH("Sample Name"), h.TH("Sample Number"), h.TH("Meas. Number")), h.TBODY(data.map(buildItemView))));
        $("#checkAll", view).on("click", function() {
            $("input.selected", view).trigger("click");
        });
        return view;
    }
    function formatDate(dateString) {
        return new Date(dateString).toDateString();
    }
    function buildItemView(data) {
        return h.TR(h.TD(h.INPUT({
            type: "checkbox",
            "class": "selected"
        })), h.TD(formatDate(data.measurementDate)), h.TD(data.sampleName), h.TD(data.sampleNumber), h.TD(data.measurementNumber));
    }
});

lymph.define("scheduling", function(require) {
    var u = require("lymph-core/utils");
    var d = require("lymph-core/dates");
    var h = require("lymph-client/html");
    return u.expose(buildView, process, timeSlotLabels, daySlotLabels, daySlotColumns);
    function buildView(startDate, data) {
        var d = new Date(startDate);
        var day = d.getDay();
        var diff = d.getDate() - day + (day == 0 ? -6 : 1);
        monday = new Date(d.setDate(diff));
        return h.SECTION(h.HEADER(h.I({
            "class": "icon-calendar"
        }), h.SPAN("Schedule")), timeSlotLabels(), daySlotColumns(monday));
    }
    function timeSlotLabels() {
        function formatTimeSlotLabel(time) {
            var t = parseTime(time);
            return t.m == "30" ? h.space : attachAmPM(humanHour(t.h));
        }
        function isHalfHour(time) {
            return parseTime(time).m == "30";
        }
        function timeSlotLabelsItem(time) {
            return h.DIV({
                "class": isHalfHour(time) ? "half" : "hour"
            }, formatTimeSlotLabel(time));
        }
        return h.DIV({
            "class": "day-label"
        }, h.DIV(h.space), timeSlots().map(timeSlotLabelsItem));
    }
    function daySlotLabels(monday) {
        function formatDaySlotLabel(date) {
            var dw = d.translateDay(date.getDay());
            var mo = date.getMonth() + 1;
            var da = date.getDate();
            return dw + " " + mo + "/" + da;
        }
        function daySlotLabelsItem(date) {
            return h.DIV({
                "class": "day",
                dataDate: date
            }, formatDaySlotLabel(date));
        }
        return h.DIV({
            "class": "day-slot-labels"
        }, h.DIV({
            "class": "day"
        }, h.space), daySlots(monday).map(daySlotLabelsItem));
    }
    function daySlotColumns(monday) {
        function formatDaySlotLabel(date) {
            var dw = d.translateDay(date.getDay());
            var mo = date.getMonth() + 1;
            var da = date.getDate();
            return dw + " " + mo + "/" + da;
        }
        function daySlotLabel(date) {
            return h.DIV(formatDaySlotLabel(date));
        }
        function daySlotRowsItem(time) {
            return h.DIV({
                "class": "time",
                dataTime: time
            }, h.space);
        }
        function daySlotRows(date) {
            return h.DIV({
                "class": "day"
            }, daySlotLabel(date), timeSlots().map(daySlotRowsItem));
        }
        return daySlots(monday).map(daySlotRows);
    }
    function extractComment(data) {
        return data.slice(data.indexOf(" ", 43)).trim();
    }
    function daySlots(startDate) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push(d.addDays(startDate, i));
        }
        return days;
    }
    function timeSlots() {
        var slots = [];
        for (var i = 1; i <= 24; i++) {
            slots.push(i + ":00");
            slots.push(i + ":30");
        }
        return slots;
    }
    function extractFields(data) {
        var fields = data.split(" ");
        var comment = extractComment(data);
        return {
            scanner: fields[0],
            startDate: fields[1],
            startTime: fields[2],
            start: new Date(fields[1] + " " + fields[2]).toString(),
            endDate: fields[3],
            endTime: fields[4],
            end: new Date(fields[3] + " " + fields[4]).toString(),
            account: fields[5],
            comment: comment,
            title: fields[5] + ": " + comment,
            allDay: false,
            backgroundColor: "blue"
        };
    }
    function dataFromLine(line) {
        return line.split("|")[0];
    }
    function process(rawData) {
        return rawData.split("\n").map(dataFromLine).map(extractFields);
    }
    function humanHour(h) {
        return h % 12 || 12;
    }
    function leadingZeroHour(h) {
        return h < 10 ? "0" + h : " " + h;
    }
    function attachAmPM(h) {
        return h < 12 ? h + "am" : h + "pm";
    }
    function parseTime(time) {
        var t = time.split(":");
        return {
            h: t[0],
            m: t[1]
        };
    }
});//@ sourceMappingURL=index-client.js.map