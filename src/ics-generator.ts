export const generateIcsResponse = async (
  url: string,
  startNeedle: string,
): Promise<Response> => {
  const response = await (await fetch(url)).text()

  var pendingEvent = ""
  let filteredCalendar = ""
  const lines = response.split('\r\n')


  let dansEvent = false
  for (const line of lines) {
    
    if (line.startsWith("BEGIN:VEVENT")) {
      dansEvent = true
    }
    
    if (!dansEvent) {
      filteredCalendar = filteredCalendar + line + "\r\n"
    } else {
      pendingEvent = pendingEvent + line + "\r\n"
    }

    if (line.startsWith("END:VEVENT")) {
      dansEvent = false
      
      if (pendingEvent.toLowerCase().search(startNeedle.toLowerCase()) != -1) {

        filteredCalendar = filteredCalendar + pendingEvent
      } else {

      }
      pendingEvent = ''
    }

  }

  if (filteredCalendar.lastIndexOf("\r\n") >0) {
    filteredCalendar = filteredCalendar.substring(0, filteredCalendar.lastIndexOf("\r\n"));
  } 

  return new Response(filteredCalendar, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition' : 'attachment; filename=filtered.ics' }})
}
