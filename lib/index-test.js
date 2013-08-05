require("lymph-test").runner.run({
     "main": require("../src/client/main")
    ,"disks": require("../src/client/disks")
    ,"client scheduling": require("../src/client/scheduling")
    ,"server scheduling": require("../src/server/scheduling")
    ,"data": require("../src/client/data")
    ,"calendar": require("../src/client/calendar")
    ,"week calendar": require("../src/client/weekCalendar")
    ,"week view": require("../src/client/WeekView")
    ,"bus": require("../src/client/Bus")
})

