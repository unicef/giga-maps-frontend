import { render, screen } from '@testing-library/react';
import { BarChartWrapper } from '../styles/about-giga-map-styles';
import BarChart from '~/@/sidebar/ui/landing-page-side-bar/common/bar-chart';

describe('BarChartWrapper Component', () => {
  const mockSchoolMappedData = [
    {type: 'schools', value: '2.1M/6M', chart: null},
    {type: 'school-connectivity', value: '334.5K', chart: {
      categories: ['Connected', 'Not connected'],
      categoryColors: ['#00d661', '#ff5538', '#1D8Cf0'],
      categoryValues: [239065, 95446, 1799302],
    }},
    {type: 'connectivity', value: '94.9K', chart: {
      categories: ['Good', 'Moderate', 'Bad', 'Unknown'],
      categoryColors: ['#00d661', '#f6C344', '#ff5538', '#1D8Cf0'],
      categoryValues: [20931, 5841, 641, 67483],
    }},
  ]

  it('renders BarChart with correct props', () => {
    render(
      <BarChartWrapper>
        <BarChart
          type={mockSchoolMappedData.type}
          TooltipAlign={"top"}
          total={1000}
          categories={mockSchoolMappedData.chart.categories}
          categoryColors={mockSchoolMappedData.chart.categoryColors}
          categoryValues={mockSchoolMappedData.chart.categoryValues}
        />
      </BarChartWrapper>
    );

    // Ensure that the BarChart component is rendered
    const barChartElement = screen.getByTestId('bar-chart');
    expect(barChartElement).toBeInTheDocument();

    // Verify the props passed to the BarChart component
    expect(barChartElement).toHaveAttribute('type', mockSchoolMappedData.type);
    expect(barChartElement).toHaveAttribute('TooltipAlign', 'top');
    expect(barChartElement).toHaveAttribute('total', '1000');

    // Check if categories, categoryColors, and categoryValues props are passed correctly
    expect(barChartElement).toHaveAttribute('categories', JSON.stringify(mockSchoolMappedData.chart.categories));
    expect(barChartElement).toHaveAttribute('categoryColors', JSON.stringify(mockSchoolMappedData.chart.categoryColors));
    expect(barChartElement).toHaveAttribute('categoryValues', JSON.stringify(mockSchoolMappedData.chart.categoryValues));
  });
});
