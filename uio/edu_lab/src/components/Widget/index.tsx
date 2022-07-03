import { css, DefaultButton, SharedColors } from "@fluentui/react";
import React from "react";
import { animated } from "react-spring";
import './style.scss'

export type WidgetProperty = {
    where: { x: number, y: number, h: number, w: number },
    children?: any,

}

export function TimerWidget(wp: WidgetProperty) {

    return (
        <Widget {...wp}>
            <p className='time'>16:55</p>
            <div className='date'>
                <p>12/22 <span>周二</span></p>
                <p>海淀 3°C</p>
            </div>
        </Widget>
    )
}


export function Widget(props: WidgetProperty) {
    const { x, y, h, w } = props.where;
    return (props.children)
}