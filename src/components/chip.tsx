import * as React from 'react';

export default function Chip(props: { text: string }) {
    const [active, setActive] = React.useState(false);
    return (
        <div className={active ? 'chipActive' : 'chip'} onClick={() => setActive(!active)}>
            {props.text}
        </div>
    );
}