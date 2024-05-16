import {curveBasis, line} from 'd3-shape';
import {SCREEN_WIDTH} from '../config/Screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMemo} from 'react';
import {parse} from 'react-native-redash';

type GenerateTabShapePath = (
  position: number,
  adjustedHeight: number,
) => string;

const NUM_TABS = 5;
const SCALE = 0.7;
const TAB_BAR_HEIGHT = 55;

const generateTabShapePath: GenerateTabShapePath = (
  position,
  adjustedHeight,
) => {
  const adjustedWith = SCREEN_WIDTH / NUM_TABS;
  const tabX = adjustedWith * position;
  const linearGenerator = line().curve(curveBasis);

  const tab = linearGenerator([
    [tabX - 100 * SCALE, 0],
    [tabX - (65 + 40) * SCALE, 0],
    [tabX - (50 - 15) * SCALE, -1 * SCALE],
    [tabX - (50 - 20) * SCALE, (adjustedHeight - 14) * SCALE],
    [tabX + (50 - 20) * SCALE, (adjustedHeight - 14) * SCALE],
    [tabX + (50 - 15) * SCALE, -1 * SCALE],
    [tabX + (65 + 40) * SCALE, 0],
    [tabX + 100 * SCALE, 0],
  ]);
  return `${tab}`;
};

const usePath = () => {
  const insets = useSafeAreaInsets();
  const tHight = TAB_BAR_HEIGHT + insets.bottom;
  const adjustedHeight = tHight * 1.4;

  const containerPath = useMemo(() => {
    return `M0,0L${SCREEN_WIDTH},0L${SCREEN_WIDTH},0L${SCREEN_WIDTH},${tHight}L0,${tHight}Z`;
  }, [tHight]);

  const curvedPaths = useMemo(() => {
    return Array.from({length: NUM_TABS}, (_, index) => {
      const tabShapePath = generateTabShapePath(
        index + 0.5,
        adjustedHeight + 10,
      );
      return parse(`${tabShapePath}`);
    });
  }, [adjustedHeight]);

  return {containerPath, curvedPaths, tHight};
};

export default usePath;
