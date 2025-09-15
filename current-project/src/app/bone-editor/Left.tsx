"use client"

import { Button } from "@/components/ui/button"
import "../globals.css"
import Field from "./fields"
import taxField from "./taxfields"
import locField from "./locfields"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

function Left() {

    return(

    <div className = "flex-col h-screen overflow-y-scroll">

        <div className = "flex py-10 justify-center items-center whitespace-nowrap">
            <Button 
                variant="outline" 
                className="lg:w-1/2 rounded-2xl bg-maroon text-white border-maroon hover:bg-maroon/90 hover:text-white"> 
                Exit
            </Button>
        </div>

        <div className="w-[90%] py-20">
            <Field/>
        </div>
        

        <div className="flex-col w-full justify-center items-center max-w-md p-4">

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline" // This is likely a prop for a design system — you might need to adjust how this behaves too
                        size="lg"
                        className="h-16 w-full text-base sm:text-lg md:text-xl font-medium transition-all duration-200"
                    >
                        Taxonomy
                    </Button>
                </DialogTrigger>
                <DialogContent>

                    <locField/>

                </DialogContent>

            </Dialog>

            
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline" // This is likely a prop for a design system — you might need to adjust how this behaves too
                        size="lg"
                        className="h-16 w-full text-base sm:text-lg md:text-xl font-medium transition-all duration-200"
                    >
                        Locality
                    </Button>
                </DialogTrigger>
                <DialogContent>

                    <taxField/>
                    
                </DialogContent>

            </Dialog>

        </div>

        <div className = "flex w-full max-w-md mx-auto p-4">
            <Button
            variant="outline"
            size="lg"
            className="bg-maroon  hover:bg-maroon/90 text-white hover:text-white 
            h-16 w-full text-base sm:text-lg md:text-xl font-medium transition-all duration-200"
            >
                Save
            </Button>
        </div>
    </div>
    );
} export default Left