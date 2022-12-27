import { generateHomepageResponse } from './homepage'
import { generateIcsResponse } from './ics-generator'

export const handleRequest = async (request: Request): Promise<Response> => {
  const requestUrl = new URL(request.url)

  switch (requestUrl.pathname) {
    case '/':
      return generateHomepageResponse()
    case '/ics':
      const calendarURL = new URL(requestUrl.searchParams.get('calendarURL')!)
      calendarURL.protocol = 'https'

      const startNeedle = requestUrl.searchParams
        .get('summaryFilter')!
        .toLowerCase()
      return generateIcsResponse(calendarURL.toString(), startNeedle)
    default:
      return new Response(null, { status: 404 })
  }
}

