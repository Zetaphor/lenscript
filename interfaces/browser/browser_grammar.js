export const grammar = {
  triggers: {
    started: [
      "started"
    ],
    triggered: [
      "triggered"
    ],
    touchStart: [
      "touch started",
      "touch started by [target]"
    ],
    touching: [
      "touching",
      "touching by [target]"
    ],
    touchEnd: [
      "touched",
      "touched by [target]"
    ],
    hoverStart: [
      "hover started",
      "hover started by [target]"
    ],
    hovering: [
      "hovering",
      "hovering by [target]"
    ],
    hoverEnd: [
      "hovered",
      "hovered by [target]"
    ],
    told: [
      "told [value]",
      "told [value] by [target]"
    ],
    grabStart: [
      "grabbed",
      "grabbed by [target]"
    ],
    grabbing: [
      "grabbing",
      "grabbing by [target]"
    ],
    grabEnd: [
      "dropped",
      "dropped by [target]"
    ],
    heard: [
      "heard [value]",
      "heard [value] from [target]"
    ],
    remembered: [
      "remembered [name]",
      "remembered [name] [value]"
    ]
  },
  actions: {
    play: [
      "play [value]",
      "play [value] [volume]",
    ],
    loop: [
      "loop [value]"
    ],
    endLoop: [
      "end loop"
    ],
    toggle: [
      "toggle [target]"
    ],
    visibility: [
      "set visibility [value]"
    ],
    show: [
      "show"
    ],
    hide: [
      "hide"
    ],
    become: [
      "become [value]"
    ],
    destroy: [
      ""
    ],
    tell: [
      "tell [target] [value]"
    ],
    remember: [
      "remember [name] [value]"
    ],
    bgColor: [
      "set bg color [r] [b] [g]"
    ],
    textColor: [
      "set text color [value]"
    ],
    rotation: [
      "set rotation [value]"
    ],
    scale: [
      "set scale [value]"
    ],
    opacity: [
      "set opacity [value]"
    ]
  }
}