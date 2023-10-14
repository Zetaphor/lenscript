export const grammar = {
  triggers: {
    started: [
      "started"
    ],
    triggered: [
      "triggered"
    ],
    inVicinity: [
      "someone in vicinity",
      "[target] in vicinity"
    ],
    nearby: [
      "someone nearby",
      "[target] nearby"
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
    destroyed: [
      "destroyed"
    ],
    remembered: [
      "remembered [value]"
    ]
  },
  actions: {
    rename: [
      "call me [value]"
    ],
    play: [
      "play [value]",
      "play [value] [volume]",
      "play [value] [volume] [pitch]"
    ],
    loop: [
      "loop [value]"
    ],
    endLoop: [
      "end loop"
    ],
    toggle: [
      "toggle [value]"
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
    emit: [
      "emit",
      "emit [value]"
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
      "remember [value] [value]"
    ]
  }
}