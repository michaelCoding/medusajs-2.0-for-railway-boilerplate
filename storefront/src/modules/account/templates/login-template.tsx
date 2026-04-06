"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  return currentView === LOGIN_VIEW.SIGN_IN ? (
    <Login setCurrentView={setCurrentView} />
  ) : (
    <Register setCurrentView={setCurrentView} />
  )
}

export default LoginTemplate
