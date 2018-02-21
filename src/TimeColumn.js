import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'

import { elementType, dateFormat } from './utils/propTypes'
import BackgroundWrapper from './BackgroundWrapper'
import TimeSlotGroup from './TimeSlotGroup'

export default class TimeColumn extends Component {
  static propTypes = {
    culture: PropTypes.string,
    getNow: PropTypes.func.isRequired,
    showLabels: PropTypes.bool,
    slotMetrics: PropTypes.object.isRequired,
    labelFormat: dateFormat,
    className: PropTypes.string,
    resource: PropTypes.string,

    slotPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    timeSlotWrapperComponent: elementType,
  }
  static defaultProps = {
    showLabels: false,
    className: '',
    timeSlotWrapperComponent: BackgroundWrapper,
  }

  render() {
    const {
      className,
      children,
      style,
      getNow,
      slotMetrics,
      resource,
      timeSlotWrapperComponent,
      showLabels,
      slotPropGetter,
      dayPropGetter,
      labelFormat,
      culture,
    } = this.props

    return (
      <div className={cn(className, 'rbc-time-column')} style={style}>
        {slotMetrics.groups.map((grp, idx) => (
          <TimeSlotGroup
            key={idx}
            getNow={getNow}
            group={grp}
            slotPropGetter={slotPropGetter}
            dayPropGetter={dayPropGetter}
            culture={culture}
            resource={resource}
            showLabels={showLabels}
            labelFormat={labelFormat}
            timeSlotWrapperComponent={timeSlotWrapperComponent}
          />
        ))}
        {children}
      </div>
    )
  }
}
