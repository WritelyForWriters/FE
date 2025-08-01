/**
 * 공통 JoyRide
 * @author 선우
 */
import dynamic from 'next/dynamic'

import { Props } from 'react-joyride'

import CustomTooltip from '@components/custom-tooltip/CustomTooltip'

const JoyRide = dynamic(() => import('react-joyride'), { ssr: false })

const CUSTOM_STYLES = {
  options: {
    overlayColor: 'rgba(26, 26, 26, 0.7)',
    arrowColor: '#333333',
  },
  spotlight: {
    boxShadow: 'rgb(155 47 11) 0px 0px 0px 2px',
    borderRadius: '1rem',
  },
}

export default function ProductTour(props: Props) {
  return (
    <JoyRide
      floaterProps={{
        styles: {
          arrow: {
            length: 8,
            spread: 10,
          },
        },
      }}
      tooltipComponent={CustomTooltip}
      hideBackButton={true}
      spotlightPadding={0}
      styles={CUSTOM_STYLES}
      disableScrolling={true}
      disableScrollParentFix={true}
      {...props}
    />
  )
}
