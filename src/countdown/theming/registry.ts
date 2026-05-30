import { Background } from '../components/Background'
import { Chrome } from '../components/Chrome'
import { EffectLayer } from '../components/EffectLayer'
import { EventTitle } from '../components/EventTitle'
import { Group } from '../components/Group'
import { Particles } from '../components/Particles'
import { Progress } from '../components/Progress'
import { Sprite } from '../components/Sprite'
import { Timer } from '../components/Timer'
import { TimerLabel } from '../components/TimerLabel'
import { TimerSeparator } from '../components/TimerSeparator'

import type { SlotComponent, SlotType } from './types'

/**
 * Slot type -> React component. Add a new visual primitive by adding a member
 * to SlotType (in ./types) and an entry here. No renderer changes needed.
 */

export const slotRegistry: Record<SlotType, SlotComponent<any>> = {
  timer: Timer,
  'timer-separator': TimerSeparator,
  'timer-label': TimerLabel,
  'event-title': EventTitle,
  progress: Progress,
  background: Background,
  group: Group,
  chrome: Chrome,
  sprite: Sprite,
  particles: Particles,
  'effect-layer': EffectLayer,
}
