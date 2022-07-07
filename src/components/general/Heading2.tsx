import React from 'react'

export const Heading2 = (props: { text: string, className?:string }) => {

    return <div className={`text-2xl font-medium ${props.className}`}>{props.text}</div>

}