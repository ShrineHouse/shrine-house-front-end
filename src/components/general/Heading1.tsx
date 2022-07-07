import React from 'react'

const Heading1 = (props: { text: string, className?: string }) => {
    return <div className={`text-4xl -mb-2 font-semibold ${props.className}`}>
        {props.text}
    </div>

}

export default Heading1