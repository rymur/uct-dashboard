$   save_verify = 'f$verify(0)'
$   completion_code = 1
$!  COPYRIGHT (c) 2001 BY
$!  VOLKSWAGEN AG, WOLFSBURG, GERMANY. ALL RIGHTS RESERVED.
$!++
$! Facility:
$!  PARSE_CGI - START_MISC Kit
$!
$! Abstract:
$!   Parses a querystring and returns global symbols
$!
$! Output:
$!   PARSE_CGI_Status:	0   nothing done
$!			>0  number of symbols created
$!   PARSE_CGI_Items:	    &-separated item list
$!
$! Author:
$!  Cluster-Karl Rohwedder
$!
$! Creation Date: 29-APR-2002
$!
$! Modification History:
$!  V1.1-1  Roh  31-JUL-2002  - add CONVERT function (P3) to convert from %Xdd -> ascii
$!--
$!
$!
$!__error handlers
$   On  Error              Then $ Goto Execution_Error
$   On  Control_Y          Then $ Goto Control_Y
$!
$!__verification
$   If "''Dcl_Debug'"		Then $ Set Verify
$   If "''Parse_Cgi_Debug'"	Then $ Set Verify
$   If F$Integer("''Max_Verify_Level'") .Ge. F$Environment("Depth") Then $ Tmp = F$Verify(Save_Verify)
$   If "''DCL_Dlines'"
$   Then DclDbg = " "
$   Else DclDbg = " !"
$   Endif
$!
$!__help
$   Version = "V1.1-1"
$   Params  = "QUERY_STRING [Prefix] [CONVERT]"
$   Facility= F$Parse(F$Environment("Procedure"),,,"Name")
$   If F$Locate("?",P1) .Ne. F$Length(P1)
$   Then
$       Ws  "Version: ''version'"
$       ws  "Usage: @''facility' ''params'"
$       Goto Exit
$   Endif
$!
$!  ===============================================
$!__D E C L A R A T I O N S
$!  ===============================================
$!
$   Ws = "Write Sys$Output"
$!
$!  ===============================================
$!__E X E C U T I O N
$!  ===============================================
$!
$   Prefix  = F$Edit(P2,"Trim,Upcase,Collapse,UnComment")
$!
$   Str	= F$Edit(P1,"Compress,Trim")
$!
$   Parse_CGI_Status	== 0
$   Parse_CGI_Items	== ""
$!
$   CFlag   = (F$Edit(P3,"Trim,Upcase,Compress,Collapse").eqs."CONVERT")
$!
$   Ix	= -1
$ loop:
$   Ix	= Ix + 1
$   Nx	= F$Element(Ix,"&",Str)
$   If (Nx.nes."" .and. Nx.nes."&")
$   Then
$	Parse_CGI_Status    == Parse_CGI_Status + 1
$	Tmp		    = F$Element(0,"=",Nx)
$	Parse_CGI_Items	    == Parse_CGI_Items + "&" + Tmp
$	TmpData		    =  F$Element(1,"=",Nx)
$	If Cflag    Then $ GoSub Convert
$	'Prefix''Tmp'	    == TmpData
$	Goto Loop
$   Endif
$!
$   Parse_CGI_Items	    == F$Extract(1,9999,Parse_CGI_Items)    ! skip leading &
$!
$   Goto Exit
$!
$!
$!  ===============================================
$!__E X I T
$!  ===============================================
$!
$ Execution_Error:
$   ___Status = $Status
$   Ws "?''Facility', Execution error: ''___Status'"
$   Ws "-''F$message(___Status)'"
$ Control_Z:
$ Control_Y:
$ Exit:
$   Set Noon
$   Set Noverify
$   Tmp = "! " + F$Parse(F$Environment("Procedure"),,,"NAME")
$   If "''Save_Verify'"	Then $ Set Verify
$   Exit 'Completion_Code' 'Tmp'
$!
$!  ===============================================
$!__C O N V E R T
$!  converts data in TMPDATA:
$!  - + -> space
$!  - %hexcode -> ascii
$!  ===============================================
$!
$ Convert:
$   Convert_Len	= F$Length(TmpData)
$   Convert_New	= ""
$   If (Convert_Len.le.0)   Then $ Goto Convert_End
$   Convert_Ix	= -1
$!
$ Convert_1:
$   Convert_Ix	= Convert_Ix + 1
$   If (Convert_ix.gt.Convert_Len)  Then $ Goto Convert_End
$   Convert_Nx	= F$Extract(Convert_Ix,1,TmpData)
$   If  (Convert_Nx.eqs."+")
$   Then
$	Convert_New = Convert_New + " "
$	Goto Convert_1
$   Endif
$!
$   If (Convert_Nx.eqs."%")
$   Then
$	Convert_x   = " "
$	Convert_Xa  = "%X" + F$Extract(Convert_Ix+1,2,TmpData)
$	Convert_X[0,8]	= 'Convert_Xa
$	Convert_New = Convert_New + Convert_x
$	Convert_Ix  = Convert_Ix + 2
$	Goto Convert_1
$   Endif
$!
$   Convert_New	= Convert_New + Convert_Nx
$   Goto Convert_1
$   
$ Convert_End:
$   TmpData = Convert_New
$   Return 1
