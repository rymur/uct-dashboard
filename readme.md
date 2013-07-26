uCT Interactive

# Notes on scan/recon event handling

    scan started event =>
        1. create a recon event log file with first entry being the scan started event
        2. append the same "scan started event" to system event log
    scan completed event =>
        1. append the event to systsem event log
    recon started event =>
        1. read existing recon events
        2. stored total slice count from scan started event
        2. sum existing recon started slices
        3. read the total scan slices from scan started event 
        4. if (total scanned slices == summed slice count)
              append recon started event to system log
           else
              append recon started event to recon log
    recon completed event =>
        1. calculate the number of slices in recon job
        2. read existing recon completed event from recon event log
        3. sum the slices of all exsiting recon completed events
        4. read the total scanned slices from the scan started event
        5. if (total scanned sliced === summed slices completed)
                append recon completed event to system log
            else
                append recon completed event to recon log

# ISAM Notes

This is much easier than it sounds! I have a number of command procedures
which contain segments such as:

        $ CREATE INDEXED.DAT/FDL=SYS$INPUT
        FILE
            ORGANIZATION INDEXED
        KEY 0
            SEG0_LENGTH  12
        $ OPEN/READ/WRITE INDEXED INDEXED.DAT

Most things will default to a reasonable value such as the key will be a
string
at position 0 and the records will be variable with carriage return carriage
control. Of course you can add FDL statements to specify any special
parameters such as bucket size.

When the file is populated with lots of records it would probably pay to
'tune'
it by reloading with recomputed parameters (eg bucket size):-

        $ ANALYZE/RMS/FDL/OUTPUT=INDEXED.FDL INDEXED.DAT
        $ EDIT/FDL/NOINTERACTIVE/ANALYSIS=INDEXED.FDL INDEXED.FDL
        $ CONVERT/NOSORT/FDL=INDEXED.FDL  INDEXED.DAT INDEXED.DAT

# Faces API

    rindex: 
    9  = uCT 40
    16 = uCT 50

# Calendar Notes

* The calendar will have 6 rows of per month, though not all of the current month's days will
  be on every row.  This is the case, so that every month has a uniform shape to it.

    August 2013
    ---------------------------------
     29 | 30 | 31 |  1 |  2 |  3 |  4
    ---------------------------------
      5 |  6 |  7 |  8 |  9 | 10 | 11
    ---------------------------------
     12 | 13 | 14 | 15 | 16 | 17 | 18
    ---------------------------------
     19 | 20 | 21 | 22 | 23 | 24 | 25
    ---------------------------------
     26 | 27 | 28 | 29 | 30 | 31 |  1
    ---------------------------------
      2 |  3 |  4 |  5 |  6 |  7 |  8
    ---------------------------------

    September 2013
    ---------------------------------
     26 | 27 | 28 | 29 | 30 | 31 |  1
    ---------------------------------
      2 |  3 |  4 |  5 |  6 |  7 |  8
    ---------------------------------
      9 | 10 | 11 | 12 | 13 | 14 | 15
    ---------------------------------
     16 | 17 | 18 | 19 | 20 | 21 | 22
    ---------------------------------
     23 | 24 | 25 | 26 | 27 | 28 | 29
    ---------------------------------
     30 |  1 |  2 |  3 |  4 |  5 |  6
    ---------------------------------

