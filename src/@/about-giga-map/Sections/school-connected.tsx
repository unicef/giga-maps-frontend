import { ArrowRight } from '@carbon/icons-react'
import { Button, Link } from '@carbon/react'
import { useStore } from 'effector-react'

import { CustomIcon } from '~/@/common/style/styled-component-style'
import BarChart from '~/@/sidebar/ui/landing-page-side-bar/common/bar-chart'

import { $schoolMappedData } from '../about.model'
import { AboutType } from '../about.type'
import { BarChartWrapper, ConnectivityNumberWrapper, ImpactSection, ImpactSectionKnowMore, NumberContainer } from '../styles/about-giga-map-styles'

const SchoolConnected = ({ data }: { data: AboutType }) => {
  const schoolMappedData = useStore($schoolMappedData);
  return (
    <ImpactSection id={data?.type} $style={data.style}>
      <ImpactSectionKnowMore>
        <p>{data?.title}</p>
        <Link href={data?.cta?.link[0]} target="_blank">
          <Button kind='ghost'
            renderIcon={ArrowRight}>{data?.cta?.text[0]}
          </Button>
        </Link>
      </ImpactSectionKnowMore>
      <ConnectivityNumberWrapper>
        {data?.content.map((item, index) => (<NumberContainer key={`${index}-${item?.title}`} $style={item.style}>
          <CustomIcon $size={3.5} dangerouslySetInnerHTML={{ __html: item?.image ?? '' }} />
          <div>
            <h1>
              {index === 0 ? schoolMappedData[index]?.value?.split('/')[0] : schoolMappedData[index]?.value}
            </h1>
            <p>
              {item?.text?.[0]}
            </p>
            {schoolMappedData[index].chart && <BarChartWrapper>
              <BarChart
                type={schoolMappedData[index]?.type}
                TooltipAlign={"top"}
                total={1000}
                categories={schoolMappedData[index].chart?.categories ?? []}
                categoryColors={schoolMappedData[index].chart?.categoryColors ?? []}
                categoryValues={schoolMappedData[index].chart?.categoryValues ?? []}
              />
            </BarChartWrapper>
            }
          </div>
        </NumberContainer>))}
      </ConnectivityNumberWrapper>
    </ImpactSection>
  )
}

export default SchoolConnected