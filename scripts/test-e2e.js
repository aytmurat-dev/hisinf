async function testAll() {
  console.log('--- 1. Testing GET /uz (Uzbek Homepage) ---')
  const resUz = await fetch('http://localhost:3000/uz')
  console.log('Status:', resUz.status)
  const textUz = await resUz.text()
  console.log('Contains Uzbek title:', textUz.includes('Oʻzbekiston va Qoraqalpogʻiston tarixi portali'))
  console.log('Contains periods section:', textUz.includes('Tarixiy davrlar'))

  console.log('\n--- 2. Testing GET /kaa (Karakalpak Homepage) ---')
  const resKaa = await fetch('http://localhost:3000/kaa')
  console.log('Status:', resKaa.status)
  const textKaa = await resKaa.text()
  console.log('Contains Karakalpak title:', textKaa.includes('Ózbekstan hám Qaraqalpaqstan tariyxı portalı'))
  console.log('Contains Karakalpak periods:', textKaa.includes('Tariyxıy dáwirler'))

  console.log('\n--- 3. Testing Live Search /api/search?q=Temur ---')
  const resSearch = await fetch('http://localhost:3000/api/search?q=Temur&locale=uz')
  const searchJson = await resSearch.json()
  console.log('Search status:', resSearch.status, 'Results found:', searchJson.results?.length)
  if (searchJson.results?.length > 0) {
    console.log('First result title:', searchJson.results[0].title)
    console.log('Snippet:', searchJson.results[0].snippet)
  }

  console.log('\n--- 4. Testing Reader Registration ---')
  const testUsername = `user_${Date.now()}`
  const regPayload = {
    firstName: 'Temurbek',
    lastName: 'Qodirov',
    username: testUsername,
    password: 'password123',
    phone: '+998901234567',
  }
  const resReg = await fetch('http://localhost:3000/api/readers/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload),
  })
  const regJson = await resReg.json()
  console.log('Register status:', resReg.status, 'Success:', regJson.success)
  const regCookie = resReg.headers.get('set-cookie')

  console.log('\n--- 5. Testing Reader Login ---')
  const resLogin = await fetch('http://localhost:3000/api/readers/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUsername, password: 'password123' }),
  })
  const loginJson = await resLogin.json()
  console.log('Login status:', resLogin.status, 'Reader:', loginJson.reader?.username)
  const sessionCookie = resLogin.headers.get('set-cookie')

  console.log('\n--- 6. Testing Reader Me Endpoint ---')
  const resMe = await fetch('http://localhost:3000/api/readers/me', {
    headers: { cookie: sessionCookie || regCookie || '' },
  })
  const meJson = await resMe.json()
  console.log('Me endpoint status:', resMe.status, 'User:', meJson.user?.username)

  console.log('\n--- 7. Testing Comment Posting ---')
  const postId = searchJson.results?.[0]?.id || 1
  const commentPayload = {
    postId,
    body: 'Ajoyib maqola, Temuriylar saltanati haqida koʻproq maʼlumot kutib qolamiz!',
  }
  const resComment = await fetch('http://localhost:3000/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: sessionCookie || regCookie || '',
    },
    body: JSON.stringify(commentPayload),
  })
  const commentJson = await resComment.json()
  console.log('Comment post status:', resComment.status, 'Success:', commentJson.success, 'Author:', commentJson.comment?.authorName)

  console.log('\n--- 8. Testing Unauthenticated Comment (Must Fail) ---')
  const resUnauthComment = await fetch('http://localhost:3000/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentPayload),
  })
  const unauthJson = await resUnauthComment.json()
  console.log('Unauth Comment status:', resUnauthComment.status, 'Error message:', unauthJson.error)

  console.log('\n--- 9. Testing Contact Admin (Inquiries) ---')
  const resInquiry = await fetch('http://localhost:3000/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Temurbek Qodirov',
      phone: '+998901234567',
      message: 'Salom hurmatli admin, veb sayt ajoyib ishlanyapti!',
    }),
  })
  const inqJson = await resInquiry.json()
  console.log('Inquiry status:', resInquiry.status, 'Success:', inqJson.success)

  console.log('\n--- 10. Testing Admin Panel Access ---')
  const resAdmin = await fetch('http://localhost:3000/admin')
  console.log('Admin page status:', resAdmin.status)

  console.log('\n========================================')
  console.log('ALL VERIFICATION STEPS COMPLETED!')
  console.log('========================================')
}

testAll().catch(console.error)
