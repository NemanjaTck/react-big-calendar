import PropTypes from 'prop-types'
import React, { Component } from 'react'

import * as DaySlotUtils from './utils/DaySlots'
import { elementType, dateFormat } from './utils/propTypes'
import TimeColumn from './TimeColumn'

export default class TimeGutter extends Component {
  static propTypes = {
    width: PropTypes.number,
    min: PropTypes.instanceOf(Date).isRequired,
    max: PropTypes.instanceOf(Date).isRequired,
    timeslots: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    timeGutterFormat: dateFormat,

    timeSlotWrapperComponent: elementType,
    showLabels: PropTypes.bool,
    isNow: PropTypes.bool,
    slotPropGetter: PropTypes.func,
    labelFormat: dateFormat,
    culture: PropTypes.string,
    resource: PropTypes.string,
  }

  constructor(...args) {
    super(...args)

    const { min, max, timeslots, step } = this.props
    this.slotMetrics = DaySlotUtils.getSlotMetrics({
      min,
      max,
      timeslots,
      step,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { min, max, timeslots, step } = nextProps
    this.slotMetrics = this.slotMetrics.update({ min, max, timeslots, step })
  }

  render() {
    const {
      timeGutterFormat,
      width,
      culture,
      isNow,
      resource,
      slotPropGetter,
      timeSlotWrapperComponent,
    } = this.props

    return (
      <TimeColumn
        showLabels
        className="rbc-time-gutter"
        style={{ width }}
        isNow={isNow}
        culture={culture}
        resource={resource}
        labelFormat={timeGutterFormat}
        slotMetrics={this.slotMetrics}
        slotPropGetter={slotPropGetter}
        timeSlotWrapperComponent={timeSlotWrapperComponent}
      />
    )
  }
}
