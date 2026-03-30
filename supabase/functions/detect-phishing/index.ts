import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface DetectionResult {
  result: 'safe' | 'phishing' | 'suspicious'
  confidence: number
  riskFactors: string[]
  inputType: 'url' | 'email'
}

// Suspicious keywords commonly found in phishing attempts
const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'sign-in', 'verify', 'verification', 'confirm', 'update',
  'account', 'secure', 'security', 'bank', 'paypal', 'amazon', 'apple', 'microsoft',
  'password', 'credential', 'suspend', 'locked', 'urgent', 'immediate', 'expire',
  'winner', 'prize', 'lottery', 'free', 'gift', 'click', 'limited', 'act now'
]

// Common phishing TLDs
const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.work', '.click', '.link', '.info', '.biz', '.tk', '.ml', '.ga', '.cf'
]

function detectInputType(input: string): 'url' | 'email' {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(input.trim())) {
    return 'email'
  }
  return 'url'
}

function analyzeUrl(url: string): DetectionResult {
  const riskFactors: string[] = []
  let riskScore = 0

  // Normalize URL
  let normalizedUrl = url.toLowerCase().trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'http://' + normalizedUrl
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(normalizedUrl)
  } catch {
    riskFactors.push('Invalid URL format')
    return { result: 'phishing', confidence: 95, riskFactors, inputType: 'url' }
  }

  // Check 1: HTTPS usage
  if (parsedUrl.protocol !== 'https:') {
    riskFactors.push('No HTTPS encryption')
    riskScore += 15
  }

  // Check 2: URL length (phishing URLs are often very long)
  if (url.length > 75) {
    riskFactors.push(`Unusually long URL (${url.length} characters)`)
    riskScore += 20
  }

  // Check 3: Special characters in domain
  const domain = parsedUrl.hostname
  if (domain.includes('@')) {
    riskFactors.push('Contains @ symbol in URL (redirect attack)')
    riskScore += 30
  }
  if (domain.includes('//')) {
    riskFactors.push('Contains double slashes in domain')
    riskScore += 25
  }
  if ((domain.match(/-/g) || []).length > 3) {
    riskFactors.push('Excessive hyphens in domain')
    riskScore += 15
  }

  // Check 4: IP address instead of domain
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipRegex.test(domain)) {
    riskFactors.push('Uses IP address instead of domain name')
    riskScore += 35
  }

  // Check 5: Suspicious TLDs
  for (const tld of SUSPICIOUS_TLDS) {
    if (domain.endsWith(tld)) {
      riskFactors.push(`Suspicious TLD: ${tld}`)
      riskScore += 20
      break
    }
  }

  // Check 6: Suspicious keywords
  const fullUrl = normalizedUrl.toLowerCase()
  const foundKeywords: string[] = []
  for (const keyword of SUSPICIOUS_KEYWORDS) {
    if (fullUrl.includes(keyword)) {
      foundKeywords.push(keyword)
    }
  }
  if (foundKeywords.length > 0) {
    riskFactors.push(`Suspicious keywords: ${foundKeywords.slice(0, 3).join(', ')}`)
    riskScore += Math.min(foundKeywords.length * 8, 30)
  }

  // Check 7: Subdomain count
  const subdomains = domain.split('.').length - 2
  if (subdomains > 2) {
    riskFactors.push(`Excessive subdomains (${subdomains})`)
    riskScore += 15
  }

  // Check 8: Common typosquatting patterns
  const typoPatterns = ['g00gle', 'amaz0n', 'paypa1', 'micros0ft', 'app1e', 'faceb00k']
  for (const pattern of typoPatterns) {
    if (domain.includes(pattern)) {
      riskFactors.push('Possible typosquatting detected')
      riskScore += 40
      break
    }
  }

  // Check 9: URL shorteners (could hide malicious destinations)
  const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly', 'is.gd']
  for (const shortener of shorteners) {
    if (domain.includes(shortener)) {
      riskFactors.push('URL shortener detected (destination unknown)')
      riskScore += 10
      break
    }
  }

  // Calculate result
  const confidence = Math.min(Math.max(riskScore, 5), 100)
  let result: 'safe' | 'phishing' | 'suspicious'
  
  if (riskScore >= 50) {
    result = 'phishing'
  } else if (riskScore >= 25) {
    result = 'suspicious'
  } else {
    result = 'safe'
  }

  // Adjust confidence for safe results
  const finalConfidence = result === 'safe' ? 100 - riskScore : confidence

  return { result, confidence: finalConfidence, riskFactors, inputType: 'url' }
}

function analyzeEmail(email: string): DetectionResult {
  const riskFactors: string[] = []
  let riskScore = 0
  const lowerEmail = email.toLowerCase()

  // Check 1: Suspicious keywords in email content
  const foundKeywords: string[] = []
  for (const keyword of SUSPICIOUS_KEYWORDS) {
    if (lowerEmail.includes(keyword)) {
      foundKeywords.push(keyword)
    }
  }
  if (foundKeywords.length > 0) {
    riskFactors.push(`Phishing keywords detected: ${foundKeywords.slice(0, 5).join(', ')}`)
    riskScore += Math.min(foundKeywords.length * 10, 40)
  }

  // Check 2: Urgency indicators
  const urgencyPatterns = ['urgent', 'immediate', 'expire', 'suspended', 'locked', 'act now', '24 hours', 'immediately']
  for (const pattern of urgencyPatterns) {
    if (lowerEmail.includes(pattern)) {
      riskFactors.push('Contains urgency language')
      riskScore += 20
      break
    }
  }

  // Check 3: Request for sensitive information
  const sensitivePatterns = ['password', 'credit card', 'ssn', 'social security', 'bank account', 'pin']
  for (const pattern of sensitivePatterns) {
    if (lowerEmail.includes(pattern)) {
      riskFactors.push('Requests sensitive information')
      riskScore += 30
      break
    }
  }

  // Check 4: Generic greetings
  const genericGreetings = ['dear customer', 'dear user', 'dear member', 'dear valued']
  for (const greeting of genericGreetings) {
    if (lowerEmail.includes(greeting)) {
      riskFactors.push('Uses generic greeting')
      riskScore += 10
      break
    }
  }

  // Check 5: URLs in email
  const urlPattern = /https?:\/\/[^\s]+/gi
  const urls = lowerEmail.match(urlPattern)
  if (urls && urls.length > 0) {
    riskFactors.push(`Contains ${urls.length} link(s)`)
    riskScore += urls.length * 5
    
    // Analyze the first URL found
    for (const url of urls.slice(0, 2)) {
      const urlAnalysis = analyzeUrl(url)
      if (urlAnalysis.result === 'phishing') {
        riskFactors.push('Contains suspicious link')
        riskScore += 25
        break
      }
    }
  }

  // Calculate result
  const confidence = Math.min(Math.max(riskScore, 5), 100)
  let result: 'safe' | 'phishing' | 'suspicious'
  
  if (riskScore >= 50) {
    result = 'phishing'
  } else if (riskScore >= 25) {
    result = 'suspicious'
  } else {
    result = 'safe'
  }

  const finalConfidence = result === 'safe' ? 100 - riskScore : confidence

  return { result, confidence: finalConfidence, riskFactors, inputType: 'email' }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { input, userId } = await req.json()

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      console.error('Invalid input received:', input)
      return new Response(
        JSON.stringify({ error: 'Please provide a URL or email text to analyze' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const trimmedInput = input.trim()
    console.log('Analyzing input:', trimmedInput.substring(0, 100))

    // Detect input type and analyze
    const inputType = detectInputType(trimmedInput)
    let result: DetectionResult

    if (inputType === 'email') {
      result = analyzeEmail(trimmedInput)
    } else {
      result = analyzeUrl(trimmedInput)
    }

    console.log('Detection result:', result)

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error: dbError } = await supabase
      .from('scan_history')
      .insert({
        input_text: trimmedInput.substring(0, 2000), // Limit stored text
        input_type: result.inputType,
        result: result.result,
        confidence: result.confidence,
        risk_factors: result.riskFactors,
        user_id: userId || null, // Link scan to authenticated user
      })
    if (dbError) {
      console.error('Database error:', dbError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Detection error:', error)
    return new Response(
      JSON.stringify({ error: 'An error occurred during analysis' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
