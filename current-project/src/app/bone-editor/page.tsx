"use client"

import Left from "./Left"
import Right from "./Right"

import ResponsiveLayout from "./responsiveLayout"

function Left2(){
    return(
        <div>
            <Left/>
        </div>
    )
}

function Right2(){
    return(
        <div>
            <Right/>
        </div>
    )
}

export default function Home(){
    return <ResponsiveLayout Left={Left2} Right={Right2} />
}



/*
export default function Home(){
    return(
    <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Left Sidebar - hidden below lg */
    /*
    }
        <div className="bg-gray-400/10 hidden lg:block lg:col-span-1">
            <Left />
        </div>

        {/* Right Content - full width below lg, spans 4 columns at lg */
    /*}
        <div className="col-span-1 lg:col-span-4">
            <Right />
        </div>
    </div>
    )
}


/*
<div>
<div className="w-2/5 bg-gray-200">
    <Left></Left>
</div>
<div className="w-3/5 bg-white">
    <Right></Right>
</div>
</div>
*/