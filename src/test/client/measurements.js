var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var measurements = require("../../main/client/measurements")

module.exports = lymphTest.suite("disks", function (test) {

    var data = [ // {{
         {
             "listDate":"31-MAY-2013 22:33"
            ,"sampleNumber":"1"
            ,"sampleName":"QC1 (weekly, density)"
            ,"sampleRemarks":""
            ,"sampleDOB":""
            ,"measurementNumber":"23234"
            ,"measurementDate":"22-MAY-2013 09:13"
            ,"measurementRemarks":""
            ,"measurementOperator":"Erick Fleming"
            ,"measurementFileName":"C0020977"
            ,"controlNumber":"3"
            ,"controlName":"QC1 70kVp  200 mg HA (weekly)"
            ,"site":"Phantom"
            ,"numberOfSlices":"104"
            ,"scannerID":"4283"
            ,"locationRAWDir":"TP0:00023234_RAW"
            ,"locationRAWLabel":"7R0001"
            ,"locationIMADir":"DK0:[MICROCT.DATA.00000001.00023234]"
            ,"locationIMALabel":""
            ,"energyICode":"E3_Imax"
            ,"integrationTime":"250"
        }
        ,{
             "listDate":"31-MAY-2013 22:33"
            ,"sampleNumber":"12609"
            ,"sampleName":"SCH_2051_VB_L6"
            ,"sampleRemarks":"20_M"
            ,"sampleDOB":"G6KO"
            ,"measurementNumber":"23235"
            ,"measurementDate":"22-MAY-2013 11:21"
            ,"measurementRemarks":""
            ,"measurementOperator":"Sasi"
            ,"measurementFileName":"C0020978"
            ,"controlNumber":"B23235"
            ,"controlName":"JN vb 70kV"
            ,"site":"Custom"
            ,"numberOfSlices":"270"
            ,"scannerID":"4283"
            ,"locationRAWDir":"TP0:00023235_RAW"
            ,"locationRAWLabel":"7R0001"
            ,"locationIMADir":"DK0:[MICROCT.DATA.00012609.00023235]"
            ,"locationIMALabel":""
            ,"energyICode":"E3_Imax"
            ,"integrationTime":"300"
        }
    ] //}}
})

