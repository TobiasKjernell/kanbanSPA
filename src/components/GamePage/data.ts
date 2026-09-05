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
  shots?: string[]
  longCopy: string[]
  facts: { head: string; text: string }[]
  otherId: string
  otherTitle: string
  otherNo: string
  websiteUrl?: string
}

export const GAME_DATA: Record<string, GameData> = {
  numops: {
    no: 'PROJECT I',
    title: 'NumberOps',
    tagline: 'Shoot straight. Reload smart.',
    intro: 'A top-down shooter where clearing monsters is only half the fight — every reload hands you a math problem, and getting it right is what keeps you standing.',
    status: 'In development',
    genre: 'Top-down shooter',
    platform: 'Mobile / PC',
    players: 'Single-player',
    releaseEta: 'TBA · 2027',
    shotsTone: 'warm',
    shots: [
      '/NumberOpsPicture/Image%20Sequence_001_0000.webp',
      '/NumberOpsPicture/Image%20Sequence_002_0000.webp',
      '/NumberOpsPicture/Image%20Sequence_003_0000.webp',
      '/NumberOpsPicture/Image%20Sequence_004_0000.webp',
    ],
    websiteUrl: 'https://numberops.polarbearsandboxproduction.com/',
    longCopy: [
      "NumberOps started as a prototype: a single room, a handful of monsters, and a magazine that ran out at the worst possible time. We kept coming back to it. When the people had time over, it has levels, a soundtrack, and a stubborn personality.",
      "You fight the way you'd expect — line up the shot, clear the area. Then the mag runs dry, and the game asks you a question instead of showing you a loading bar. Answer it fast and clean, and you're back in the fight before the next wave notices you stopped.",
      "It's a shooter for the part of your brain that likes both things at once: the twitch of a good dodge, and the small, satisfying click of a problem solved under pressure.",
    ],
    facts: [
      { head: 'Born during free-time', text: "André started it as a side project and then other joined in." },
      { head: 'Reloading is the math problem', text: "There is no idle reload animation. The pause where you'd normally wait is replaced with a problem — solve it, and the gun comes back up loaded, fail and you will punished." },
      { head: 'Levels scale the fight, not just the math', text: "Later levels don't just ask harder sums — they ask them while more monsters are closing in." },
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
      { head: 'Built for the Quest, first', text: "Standalone VR is the design constraint. If a track doesn't run at frame on the headset, it doesn't ship — full stop." },
      { head: 'Hand-painted track skins', text: "Every loop, hairpin and chicane is dressed by hand. The 'plastic with brushstrokes' look is the goal, not an accident." },
      { head: 'Hairline timing matters', text: 'Slot cars live or die in the last centimeter before the corner. We rebuilt the throttle model three times to get that millisecond right.' },
      { head: 'Local + online, same room', text: "Up to four players can share a virtual shelf. Bring your own headset; pick your own car; argue over who gets the red one." },
    ],
    otherId: 'numops',
    otherTitle: 'NumberOps',
    otherNo: 'PROJECT I',
  },
}
