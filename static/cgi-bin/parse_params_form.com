$set noon
$read/error=exit/end=error apache$input data
$field_index = 0
$loop:
$  field = f$element(field_index, "&", data)
$  if (field .nes. "" .and. field .nes. "&")
$  then
$    field_name  = f$element(0, "=", field)
$    field_value = f$element(1, "=", field)
$    FORM_'field_name' == field_value
$    field_index = field_index + 1
$    goto loop
$  else
$    goto loop_end
$  endif
$loop_end:
