import { fireEvent, render, screen } from "@testing-library/react";
import { LegendConfigType } from "~/@/admin/types/giga-layer.type";
import CountryLegendBenchmark from "../CountryLegendBenchmark";
import { defaultGigaLayerForm } from "~/@/admin/constants/giga-layer.constant";

describe('CountryLegendBenchmark Component', () => {
  const mockOnChange = jest.fn();

  const mockGlobalConfig: LegendConfigType = {
    legend1: { values: ['value1', 'value2'], labels: 'Label 1', tooltip: 'Tooltip 1' },
    legend2: { values: ['value3'], labels: 'Label 2' }
  };

  const mockConfig: LegendConfigType = {
    legend1: { values: ['custom1', 'custom2'], labels: 'Custom Label 1' }
  };

  it('renders Add Legend button if no legend config exists', () => {
    render(<CountryLegendBenchmark config={{}} onChange={mockOnChange} globalConfig={mockGlobalConfig} />);
    const addLegendButton = screen.getByText('Add Legend');
    expect(addLegendButton).toBeInTheDocument();
  });

  it('shows the legend form when Add Legend button is clicked', () => {
    render(<CountryLegendBenchmark config={{}} onChange={mockOnChange} globalConfig={mockGlobalConfig} />);
    const addLegendButton = screen.getByText('Add Legend');
    fireEvent.click(addLegendButton);
    const applyGlobalButton = screen.getByText('Apply Global Legends');
    expect(applyGlobalButton).toBeInTheDocument();
  });

  it('calls onChange with globalConfig when Apply Global Legends is clicked', () => {
    render(<CountryLegendBenchmark config={mockConfig} onChange={mockOnChange} globalConfig={mockGlobalConfig} />);
    const applyGlobalButton = screen.getByText('Apply Global Legends');
    fireEvent.click(applyGlobalButton);
    expect(mockOnChange).toHaveBeenCalledWith({ ...mockGlobalConfig });
  });
  
  it('renders the default legend configs if config is undefined', () => {
    render(<CountryLegendBenchmark config={undefined} onChange={mockOnChange} globalConfig={mockGlobalConfig} />);
    const defaultLegendLabel = defaultGigaLayerForm.legendConfigs[Object.keys(defaultGigaLayerForm.legendConfigs)[0]].labels;
    expect(screen.getByText(defaultLegendLabel)).toBeInTheDocument();
  });
})