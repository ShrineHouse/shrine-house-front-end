import React from 'react'

export const BodyLink = (props: { text: string, className?: string }) => {
    return <div className={`primaryColor cursor-pointer hover:underline ${props.className}`}>{props.text}</div>

}