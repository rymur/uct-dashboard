require("lymph-test").runner.run([
     require("../src/test/client/main")
    ,require("../src/test/client/disks")
    ,require("../src/test/client/scheduling")
    ,require("../src/test/server/scheduling")
    ,require("../src/test/client/data")
    ,require("../src/test/client/calendar")
    ,require("../src/test/client/weekCalendar")
    ,require("../src/test/client/WeekView")
    ,require("../src/test/client/EventView")
])

