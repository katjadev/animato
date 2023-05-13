import 'firebase/auth'
import { firebaseAdminSDK } from '@animato/lib/firebase/FirebaseAdminSDK'

async function verifyCookie(cookie: string) { 
  let userId: string | undefined = ''
  let email: string | undefined = ''
  let authenticated = false

  try {
    const decodedClaims = await firebaseAdminSDK.auth().verifySessionCookie(cookie, true)
    authenticated = true
    email = decodedClaims.email
    userId = decodedClaims.user_id
  } catch (_) {
    authenticated = false
  }

  return { authenticated, email, userId }
}
  
export default verifyCookie