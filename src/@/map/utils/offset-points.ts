import { Expression } from 'mapbox-gl';

/**
 * Creates a Mapbox GL expression that applies a dynamic offset to points
 * based on their ID modulo value to handle overlapping points.
 * 
 * This function generates Mapbox GL expressions that:
 * 1. Take the point's ID modulo the specified divisor
 * 2. Apply an offset pattern based on the remainder
 * 3. Scale the offset based on zoom level (smaller offset at higher zoom)
 * 
 * @param propertyName The property name containing a unique identifier for each point
 * @param divisor Number of different offset positions in the pattern
 * @param baseOffset Base offset distance in pixels
 * @returns A pair of Mapbox GL expressions for x and y offsets
 */
export function createOffsetExpressions(
  propertyName: string = 'id',
  divisor: number = 8,
  baseOffset: number = 5
): [Expression, Expression] {

  // The x offset expression uses cosine to create a circular pattern
  const xOffsetExpression: Expression = [
    'let',
    // Calculate the position in the circular pattern (0-7)
    'position', ['%', ['to-number', ['get', propertyName]], divisor],
    [
      'interpolate',
      ['linear'],
      ['zoom'],
      // At low zoom levels (0-5), use the full offset
      0, [
        '*',
        baseOffset,
        ['cos', ['*', ['var', 'position'], (Math.PI * 2) / divisor]]
      ],
      // At medium zoom (6-12), gradually reduce the offset
      6, [
        '*',
        baseOffset,
        ['cos', ['*', ['var', 'position'], (Math.PI * 2) / divisor]]
      ],
      12, [
        '*',
        baseOffset / 2,
        ['cos', ['*', ['var', 'position'], (Math.PI * 2) / divisor]]
      ],
      // At high zoom (13+), use minimal offset
      18, [
        '*',
        baseOffset / 4,
        ['cos', ['*', ['var', 'position'], (Math.PI * 2) / divisor]]
      ]
    ]
  ];

  // The y offset expression uses sine to create a circular pattern
  const yOffsetExpression: Expression = [
    'let',
    // Calculate the position in the circular pattern (0-7)
    'position', ['%', ['to-number', ['get', propertyName]], divisor],
    [
      'interpolate',
      ['linear'],
      ['zoom'],
      // At low zoom levels (0-5), use the full offset
      0, [
        '*',
        baseOffset,
        ['sin', ['*', ['var', 'position'], (Math.PI * 2) / divisor]]
      ],
      // At medium zoom (6-12), gradually reduce the offset
      6, [
        '*',
        baseOffset,
        ['sin', ['*', ['var', 'position'], (Math.PI * 2) / divisor]]
      ],
      12, [
        '*',
        baseOffset / 2,
        ['sin', ['*', ['var', 'position'], (Math.PI * 2) / divisor]]
      ],
      // At high zoom (13+), use minimal offset
      18, [
        '*',
        baseOffset / 4,
        ['sin', ['*', ['var', 'position'], (Math.PI * 2) / divisor]]
      ]
    ]
  ];

  return [xOffsetExpression, yOffsetExpression];
} 