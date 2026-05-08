export interface GameData {
  no: string
  title: string
  tagline: string
  intro: string
  status: string
  genre: string
  platform: string
  players: string
  releaseEta: string
  shotsTone: string
  longCopy: string[]
  facts: { head: string; text: string }[]
  otherId: string
  otherTitle: string
  otherNo: string
}

export const GAME_DATA: Record<string, GameData> = {
  numops: {
    no: 'PROJECT I',
    title: 'NumOps',
    tagline: 'Top-down math solver',
    intro: 'A mathematical game about solving problems at reload, practice your early stage math.',
    status: 'In development',
    genre: 'Top-down shooter',
    platform: 'Mobile / PC',
    players: 'Single-player',
    releaseEta: 'TBA · 2027',
    shotsTone: 'warm',
    longCopy: [
      "NumOps started as a jam prototype: a single screen, a handful of operator tiles, and a target number. We kept coming back to it. Three jams later, it has rules, a soundtrack, and a stubborn personality.",
      "Each puzzle is a small machine. You feed it numbers; you arrange operators; you press run. When it works, the screen exhales. When it doesn't, the puzzle quietly tells you which step gave up first — and then it's on you.",
      "We're building it for the kind of evening where you want to think, but gently. Forty-five minutes, a cup of something warm, and a problem that fits.",
    ],
    facts: [
      { head: 'Born in a 48-hour jam',       text: "Jam #11. The first prototype was a spreadsheet with a play button. We've kept the spreadsheet energy and lost the spreadsheet." },
      { head: 'Puzzles compose, like operators', text: 'Solutions to early puzzles become primitives in later ones. The further you go, the more your toolbox is something you built yourself.' },
      { head: 'No timer, no score',           text: "We don't believe in punishing thought. The only reward is the next puzzle, and the only score is the one you keep in your head." },
      { head: 'Hand-tuned, not generated',    text: "Every puzzle is authored. We tried procgen for a week and it produced 4,000 puzzles with one good one in the pile. We'd rather hand you the good one." },
    ],
    otherId: 'slotcarvr',
    otherTitle: 'SlotcarVR Racing',
    otherNo: 'PROJECT II',
  },
  slotcarvr: {
    no: 'PROJECT II',
    title: 'SlotcarVR Racing',
    tagline: 'Slot-car nostalgia, in room-scale.',
    intro: 'A toy-shelf racing sim built for VR. Exciting tracks, hairline timing, challenge your friends!',
    status: 'In development',
    genre: 'Racing / VR',
    platform: 'Meta Quest · Standalone VR',
    players: '1–4 online',
    releaseEta: 'TBA · 2026',
    shotsTone: 'cool',
    longCopy: [
      "We grew up with these. The figure-eight tracks on the kitchen floor; the trigger that gave you exactly enough throttle to fly off the third corner. SlotcarVR is our love letter to that — and our quiet attempt to fix the parts the carpet always ruined.",
      "Tracks are dioramas. Each one is a tiny, lit world you can lean into and look around. Cars are scaled toys with real physics — light enough to lose in a corner, heavy enough that getting the line right feels like a thing.",
      "Multiplayer is split-screen reborn: two to four players around the same shelf, each with their own controller, all looking at the same plastic landscape from different angles.",
    ],
    facts: [
      { head: 'Built for the Quest, first',  text: "Standalone VR is the design constraint. If a track doesn't run at frame on the headset, it doesn't ship — full stop." },
      { head: 'Hand-painted track skins',    text: "Every loop, hairpin and chicane is dressed by hand. The 'plastic with brushstrokes' look is the goal, not an accident." },
      { head: 'Hairline timing matters',     text: 'Slot cars live or die in the last centimeter before the corner. We rebuilt the throttle model three times to get that millisecond right.' },
      { head: 'Local + online, same room',   text: "Up to four players can share a virtual shelf. Bring your own headset; pick your own car; argue over who gets the red one." },
    ],
    otherId: 'numops',
    otherTitle: 'NumOps',
    otherNo: 'PROJECT I',
  },
}
