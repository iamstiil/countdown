import { Background } from '../components/Background'
import { EventTitle } from '../components/EventTitle'
import { Group } from '../components/Group'
import { Progress } from '../components/Progress'
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
}
