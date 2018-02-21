import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import localizer from './localizer'
import { elementType, dateFormat } from './utils/propTypes'

export default class TimeSlotGroup extends Component {
  static propTypes = {
    timeSlotWrapperComponent: elementType,
    group: PropTypes.array.isRequired,
    showLabels: PropTypes.bool,
    isNow: PropTypes.bool,
    slotPropGetter: PropTypes.func,
    labelFormat: dateFormat,
    culture: PropTypes.string,
    resource: PropTypes.string,
  }
  static defaultProps = {
    isNow: false,
    showLabels: false,
  }

  renderSlot = (value, idx) => {
    const {
      isNow,
      resource,
      showLabels,
      culture,
      labelFormat,
      slotPropGetter,
      timeSlotWrapperComponent: Wrapper,
    } = this.props

    const slotProps = (slotPropGetter && slotPropGetter(value)) || {}
    const children =
      !!(idx === 0 && showLabels) &&
      localizer.format(value, labelFormat, culture)

    return (
      <Wrapper key={idx} value={value} resource={resource}>
        <div
          {...slotProps}
          className={cn(
            'rbc-time-slot',
            slotProps.className,
            children && 'rbc-label',
            isNow && 'rbc-now'
          )}
        >
          {children}
        </div>
      </Wrapper>
    )
  }

  render() {
    const { group } = this.props

    return (
      <div className="rbc-timeslot-group">{group.map(this.renderSlot)}</div>
    )
  }
}
