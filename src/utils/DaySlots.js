import dates from './dates'

const getKey = (min, max, step, slots) =>
  `${+dates.startOf(min, 'minutes')}` +
  `${+dates.startOf(max, 'minutes')}` +
  `${step}-${slots}`

export function getSlotMetrics({ min: start, max: end, step, timeslots }) {
  const key = getKey(start, end, step, timeslots)

  const dstOffset = Math.abs(
    start.getTimezoneOffset() - end.getTimezoneOffset()
  )
  const totalMin = dates.diff(start, end, 'minutes') + dstOffset
  const minutesFromMidnight = dates.diff(
    dates.startOf(start, 'day'),
    start,
    'minutes'
  )

  const numGroups = Math.ceil(totalMin / (step * timeslots))
  const numSlots = numGroups * timeslots

  const groups = new Array(numGroups)
  const slots = new Array(numSlots)
  // Each slot date is created from "zero", instead of adding `step` to
  // the previous one, in order to avoid DST oddities
  for (let grp = 0; grp < numGroups; grp++) {
    groups[grp] = new Array(timeslots)

    for (let slot = 0; slot < timeslots; slot++) {
      const slotIdx = grp * timeslots + slot
      const minFromStart = slotIdx * step
      // A date with total minutes calculated from the start of the day
      slots[slotIdx] = groups[grp][slot] = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        0,
        minutesFromMidnight + minFromStart,
        0,
        0
      )
    }
  }

  function positionFromDate(date) {
    const diff = dates.diff(start, date, 'minutes') + dstOffset
    return Math.min(diff, totalMin)
  }

  return {
    groups,
    update(args) {
      if (getKey(args) !== key) return getSlotMetrics(args)
      return this
    },
    nextSlot(slot) {
      let next = slots[Math.min(slots.indexOf(slot) + 1, slots.length - 1)]
      // in the case of the last slot we won't a long enough range so manually get it
      if (next === slot) next = dates.add(slot, step, 'minutes')
      return next
    },

    closestSlotToPosition(percent) {
      const slot = Math.floor(percent * numSlots)
      return slots[slot]
    },

    startsBefore(date) {
      return dates.lt(dates.merge(start, date), start, 'minutes')
    },
    startsAfter(date) {
      return dates.gt(dates.merge(end, date), end, 'minutes')
    },
    getRange(rangeStart, rangeEnd) {
      rangeStart = dates.min(end, dates.max(start, rangeStart))
      rangeEnd = dates.min(end, dates.max(start, rangeEnd))

      const rangeStartMin = positionFromDate(rangeStart)
      const rangeEndMin = positionFromDate(rangeEnd)
      const top = rangeStartMin / totalMin * 100

      return {
        top,
        height: rangeEndMin / totalMin * 100 - top,
        start: positionFromDate(rangeStart),
        startDate: rangeStart,
        end: positionFromDate(rangeEnd),
        endDate: rangeEnd,
      }
    },
  }
}
