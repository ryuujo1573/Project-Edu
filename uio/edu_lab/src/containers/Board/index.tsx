import { hsl2rgb, Label, Slider } from '@fluentui/react'
import React, { CSSProperties, ReactElement, useReducer, useState } from 'react'
import { TimerWidget, Widget, WidgetProperty } from '../../components/Widget'
import { Toggle } from '@fluentui/react/lib/Toggle';
import boardReducer, { BoardActions, BoardState } from './board.reducer'
import './style.scss'
import { useDrag } from '@use-gesture/react';
import { animated, config, SpringValue, useSpring, useSprings } from 'react-spring';

export default function Board(props: BoardState) {
  const [state, dispatch] = useReducer(boardReducer, props);

  const fn = (state: BoardState, active = false, originalIndex = undefined, dx = 0, dy = 0) => (index: number) => {
    const [xc, yc] = state.map.pages[0].widgets[index].geometry;

    return (active && index === originalIndex
      ? {
        x: (xc - 1) * (size + gap) + dx,
        y: (yc - 1) * (size + gap) + dy,
        scale: 1.05,
        zIndex: 1,
        shadow: 15,
        shouldShake: 0,
        immediate: (key: string) => key === 'zIndex' || key === 'shouldShake',
        config: (key: string) => ((key === 'y' || key === 'x') ? config.stiff : config.default),
      } : {
        x: (xc - 1) * (size + gap),
        y: (yc - 1) * (size + gap),
        scale: 1,
        zIndex: 0,
        shadow: 1,
        immediate: (key: string) => key === 'shouldShake',
        shouldShake: 1,
      });
  }

  const [springs, api] = useSprings(state.map.pages[0].widgets.length, fn(state),);

  const [flip, set] = useState(false);
  const [shake, it] = useSpring(() => ({
    to: {
      rotate: 0,
    },
    from: {
      rotate: 0.5,
    },
    reset: true,
    reverse: flip,
    config: {tension: 800, friction: 0},
    onRest: () => set(!flip),
  }));  

  const min = 0;
  const max = 359;
  const rand = () => min + Math.random() * (max - min);

  const [performingLayout, setPerfLayout] = useState(false);
  const [size, setSize] = useState(80);
  const [gap, setGap] = useState(15);

  const [maxWidth, maxHeight] = props.map.size;

  const bind = useDrag(({ args: [index], active, movement: [dx, dy] }) => {
    if (performingLayout) {
      const [x, y, w, h] = state.map.pages[0].widgets[index].geometry;
      let pos = [x + Math.trunc(dx / size), y + Math.trunc(dy / size)];

      api.start(fn(state, active, index, dx, dy));

      if (!active) {
        state.map.pages[0].widgets[index].geometry.splice(0, 2, ...pos);
        api.start(fn(state, active, index, dx, dy));
      }
    }
  })
  return (
    <>
      <div className={''.concat('board', performingLayout ? ' repos' : '')} style={{
        width: maxWidth * size + (maxWidth - 1) * gap,
        height: maxHeight * size + (maxHeight - 1) * gap,
      }}>
        {state.map.pages[0].widgets.map((widget, i) => {
          const [xc, yc, w, h] = widget.geometry;
          const { x, y, scale, zIndex, shadow, shouldShake, } = springs[i];

          return <animated.div
            {...bind(i)}
            key={i}
            className='round'
            style={{
              width: w * size + (w - 1) * gap,
              height: h * size + (h - 1) * gap,
              x: (xc - 1) * (size + gap),
              y: (yc - 1) * (size + gap),
              ...performingLayout ? { x: x, y: y, ...shake } : {},
              boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
              transformOrigin: "50% 50% 0px",
              touchAction: 'none',
              scale,
              zIndex,
            }}
          >
            {(() => {
            switch (widget.typeid) {
              case 'datetime':
                return <TimerWidget where={{ x: xc, y: yc, w, h }}></TimerWidget>
              case 'stack':
                return (
                  <Widget where={{ x: xc, y: yc, w, h }}>
                    <div className='s-grid'>
                      {Array(9).fill(0).map((_, i, __) => {
                        let c = hsl2rgb(rand(), 80, 90);
                        return (<div key={i} className='block' style={{
                          backgroundColor: `rgba(${c.r},${c.g},${c.b},${0.8})`,
                          // gridArea: `${i / 3 + 1}/${i % 3 + 1}/1/1`
                        }} />)
                      })}
                    </div>
                  </Widget>
                )
              case 'weather':
                return (
                  <Widget where={{ x: xc, y: yc, w, h }}>
                    <div id="he-plugin-standard"></div>
                  </Widget>
                )
              case 'schedule':
                return (
                  <Widget where={{ x: xc, y: yc, w, h }}>
                    <iframe title='schedule' src='https://i.ai.mi.com/h5/precache/ai-schedule/#/todaylesson' frameBorder={'none'}></iframe>
                  </Widget>
                )
              case 'blank':
              default:
                return <Widget where={{ x: xc, y: yc, w, h }}>({widget.geometry.join(', ')})</Widget>
            }
          }).call({})}</animated.div>
        })}
      </div>
      <div className='control'>
        <Toggle label="Reposition" onText="On" offText="Off" onChange={(_, checked) => {
          setPerfLayout(checked ? checked : false);
        }} />
        {/* <Label>({pos?.join(', ') ?? 'none'})</Label> */}
        <Slider label="Metro Size" min={50} max={160} step={5} defaultValue={80} showValue snapToStep onChange={setSize} />
        <Slider label="Gap Size" min={3} max={42} step={3} defaultValue={15} showValue snapToStep onChange={setGap} />
      </div>
    </>
  )
}