import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const LandingPage = () => {
  return (
   <>
    <div>LandingPage(unprotected)</div>
   <Link href="/sign-in">
   <Button>Sign in</Button>
   </Link>
   <Link href="/sign-up">
   <Button>Register</Button>
   </Link>
   </>
  )
}

export default LandingPage