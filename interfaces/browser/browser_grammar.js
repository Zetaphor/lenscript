export const grammar = {
  triggers: {
    remembered: [
      "remembered [name]",
      "remembered [name] [value]"
    ],
    saved: [
      "saved [name]",
      "saved [name] [value]"
    ],
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
    ]
  },
  actions: {
    become: [
      "become [value]"
    ],
    remember: [
      "remember [name] [value]"
    ],
    save: [
      "save [name] [value]"
    ],
    visibility: [
      "set visibility [value]"
    ],
    tell: [
      "tell [target] [value]"
    ],
    bgColor: [
      "set bg color [value]",
      "set bg color [r] [g] [b]"
    ],
    textColor: [
      "set text color [value]",
      "set text color [r] [g] [b]"
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