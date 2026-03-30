/**
 * Phishing Detection Utility
 * Local implementation for client-side detection
 */

export interface DetectionResult {
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

  const domain = parsedUrl.hostname || ''
  const fullUrl = parsedUrl.toString()

  // Check 1: HTTPS usage
  if (parsedUrl.protocol !== 'https:') {
    riskFactors.push('Not using HTTPS')
    riskScore += 15
  }

  // Check 2: IP address instead of domain
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipRegex.test(domain)) {
    riskFactors.push('Using IP address instead of domain name')
    riskScore += 35
  }

  // Check 3: Suspicious TLDs
  for (const tld of SUSPICIOUS_TLDS) {
    if (domain.endsWith(tld)) {
      riskFactors.push(`Suspicious TLD: ${tld}`)
      riskScore += 25
      break
    }
  }

  // Check 4: Domain length analysis
  if (domain.length > 30) {
    riskFactors.push('Unusually long domain name')
    riskScore += 5
  }

  // Check 5: Number-letter homoglyphs (l33t speak)
  if (/[0l1!|]/g.test(domain) && /[a-z]/i.test(domain)) {
    riskFactors.push('Possible homoglyph attack (letter/number look-alike)')
    riskScore += 20
  }

  // Check 6: Suspicious keywords
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

  // Confidence represents certainty of the detection
  // For phishing: high risk score = high confidence it's phishing
  // For safe: low risk score = high confidence it's safe
  const finalConfidence = result === 'safe' ? Math.max(100 - riskScore, 80) : confidence

  return { result, confidence: finalConfidence, riskFactors, inputType: 'url' }
}

function analyzeEmailAddress(emailAddress: string): DetectionResult {
  const riskFactors: string[] = []
  let riskScore = 0
  
  const lowerEmail = emailAddress.toLowerCase()
  const [localPart, domain] = emailAddress.split('@')
  
  // Check 1: Suspicious keywords in email address
  const suspiciousKeywords = ['verify', 'confirm', 'update', 'secure', 'security', 'support', 'admin', 'noreply']
  for (const keyword of suspiciousKeywords) {
    if (localPart.includes(keyword)) {
      riskFactors.push(`Suspicious keyword in email: "${keyword}"`)
      riskScore += 15
    }
  }
  
  // Check 2: Brand name spoofing patterns
  const brandPatterns = [
    { brand: 'amazon', domains: ['amazoon', 'amaz0n', 'amazon-security', 'amazon-verify', 'amazonsecurity'] },
    { brand: 'paypal', domains: ['paypa1', 'paypa-l', 'paypal-secure', 'paypal-verify', 'paypalsecurity'] },
    { brand: 'apple', domains: ['app1e', 'apple-security', 'apple-verify', 'applesecurity'] },
    { brand: 'microsoft', domains: ['microsof', 'microsoft-security', 'microsoft-verify', 'microsoftsecurity'] },
    { brand: 'google', domains: ['g00gle', 'goole', 'google-security', 'google-verify', 'googlesecurity'] },
    { brand: 'bank', domains: ['bank-verify', 'bank-secure', 'banksecurity'] }
  ]
  
  for (const { brand, domains } of brandPatterns) {
    for (const suspiciousDomain of domains) {
      if (domain.includes(suspiciousDomain)) {
        riskFactors.push(`Brand spoofing detected: "${brand}" impersonation`)
        riskScore += 40
        break
      }
    }
  }
  
  // Check 3: Domain with suspicious TLD
  for (const tld of SUSPICIOUS_TLDS) {
    if (domain.endsWith(tld)) {
      riskFactors.push(`Suspicious TLD detected: ${tld}`)
      riskScore += 25
    }
  }
  
  // Check 4: Free email service used for business/bank purposes
  const businessDomains = ['amazon', 'paypal', 'apple', 'microsoft', 'google', 'bank', 'finance', 'admin', 'support']
  const freeEmailServices = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com']
  const isFreeEmail = freeEmailServices.some(service => domain.endsWith(service))
  
  if (isFreeEmail) {
    for (const business of businessDomains) {
      if (localPart.includes(business) || domain.includes(business)) {
        riskFactors.push(`Business account using free email service (${domain})`)
        riskScore += 30
        break
      }
    }
  }
  
  // Check 5: Multiple hyphens or suspicious characters
  const hyphenCount = domain.split('-').length - 1
  if (hyphenCount > 1) {
    riskFactors.push(`Multiple hyphens in domain (possible typosquatting)`)
    riskScore += 10
  }
  
  // Check 6: Unusual domain length
  if (domain.length > 40) {
    riskFactors.push(`Unusually long domain name`)
    riskScore += 5
  }
  
  // Calculate result
  let result: 'safe' | 'phishing' | 'suspicious'
  
  if (riskScore >= 50) {
    result = 'phishing'
  } else if (riskScore >= 25) {
    result = 'suspicious'
  } else {
    result = 'safe'
  }
  
  const confidence = result === 'safe' ? Math.max(100 - riskScore, 80) : Math.min(Math.max(riskScore, 5), 100)
  
  return { result, confidence, riskFactors, inputType: 'email' }
}

function analyzeEmail(emailContent: string): DetectionResult {
  const riskFactors: string[] = []
  let riskScore = 0
  const lowerContent = emailContent.toLowerCase()

  // Check 1: Urgent action required language
  const urgentPhrases = [
    'immediately', 'urgent', 'act now', 'verify now', 'confirm identity',
    'click here', 'update information', 'suspended', 'locked', 'compromised'
  ]
  for (const phrase of urgentPhrases) {
    if (lowerContent.includes(phrase)) {
      riskScore += 5
    }
  }
  if (riskScore > 0) {
    riskFactors.push('Contains urgent action language')
  }

  // Check 2: Generic greetings
  if (lowerContent.includes('dear user') || lowerContent.includes('dear customer')) {
    riskFactors.push('Generic greeting instead of personal name')
    riskScore += 10
  }

  // Check 3: Link presence without context
  const linkRegex = /(https?:\/\/[^\s]+)/gi
  const links = emailContent.match(linkRegex) || []
  if (links.length > 0) {
    riskFactors.push(`Contains ${links.length} hyperlink(s)`)
    riskScore += 5
  }

  // Check 4: Requests for sensitive information
  const sensitiveRequests = [
    'password', 'credit card', 'social security', 'bank account',
    'cvv', 'security code', 'pin', 'confirm password'
  ]
  for (const request of sensitiveRequests) {
    if (lowerContent.includes(request)) {
      riskFactors.push('Requesting sensitive personal information')
      riskScore += 20
      break
    }
  }

  // Check 5: Suspicious sender address (if available)
  const emailMatch = emailContent.match(/from:\s*([^\s<]+@[^\s>]+)/i)
  if (emailMatch) {
    const senderDomain = emailMatch[1].split('@')[1]
    for (const tld of SUSPICIOUS_TLDS) {
      if (senderDomain.includes(tld)) {
        riskFactors.push(`Sender domain uses suspicious TLD: ${tld}`)
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

  // Confidence represents certainty of the detection
  // For phishing: high risk score = high confidence it's phishing
  // For safe: low risk score = high confidence it's safe
  const finalConfidence = result === 'safe' ? Math.max(100 - riskScore, 80) : confidence

  return { result, confidence: finalConfidence, riskFactors, inputType: 'email' }
}

export function detectPhishing(input: string): DetectionResult {
  const inputType = detectInputType(input)

  if (inputType === 'email') {
    // Check if it's just an email address or email body content
    const emailAddressRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailAddressRegex.test(input.trim())) {
      // It's an email address - analyze for spoofing/phishing patterns
      return analyzeEmailAddress(input)
    } else {
      // It's email body content
      return analyzeEmail(input)
    }
  } else {
    return analyzeUrl(input)
  }
}
