"use client"

import LoginForm from "@/components/LoginForm"
import CreateAccountForm from "@/components/CreateAccountForm"
import {useState} from 'react'

export function LoginPage() {

  const enum PAGE_TYPE {
    LoginForm,
    CreateAccountForm
  };

  const [pageStatus, setPageStatus] = useState(PAGE_TYPE.LoginForm);
  const GetPageContents = () => {
    switch(pageStatus) {
      default:
      case (PAGE_TYPE.LoginForm):
        return(<LoginForm goCreateAccount = {() => setPageStatus(PAGE_TYPE.CreateAccountForm)}/>)
      case (PAGE_TYPE.CreateAccountForm):
        return(<CreateAccountForm goLogin = {() => setPageStatus(PAGE_TYPE.LoginForm)}/>)
    }
  }

  return (
    <div className="flex w-full h-screen">
        <div className="hidden relative lg:w-1/5 lg:flex h-full items-center justify-center">
          <div className="w-full h-1/2 absolute bottom-0 bg-maroon "/>
          <div className="w-full h-1/2 absolute top-0 bg-gold">
            <div className="flex justify-center items-center h-screen">
              <img src='/sammy_logo.svg' alt="Logo" width="200" height="200" />
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center lg:w-3/5">
          {GetPageContents()}
        </div>
        <div className="hidden relative lg:w-1/5 lg:flex h-full items-center justify-center">
          <div className="w-full h-1/2 absolute bottom-0 bg-maroon "/>
          <div className="w-full h-1/2 absolute top-0 bg-gold">
            <div className="flex justify-center items-center h-screen">
              <img src='/sammy_logo.svg' alt="Logo" width="200" height="200" />
            </div>
          </div>
        </div>
      </div>
  )
}