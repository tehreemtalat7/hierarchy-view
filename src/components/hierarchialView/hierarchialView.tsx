// Native imports
import React, { PropsWithChildren } from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  Image,
  ImageSourcePropType,
  StyleProp,
  ImageStyle,
} from 'react-native';
// 3rd Party imports
import {
  TouchableOpacity,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
// Utils imports
import { HierarchyData } from '../../models';

interface HierarchicalViewProps<T> {
  /**
   * @data Data to display in a hierarchical listing.
   */
  data: HierarchyData<T>[];
  /**
   * @renderRowComponent The component to be displayed for one object.
   */
  renderRowComponent: (obj: T) => JSX.Element;
  /**
   * @onItemPress On Press handler for press of one row of hierarchy.
   */
  onItemPress: (obj: HierarchyData<T>) => void;
  /**
   * @collapsedIcon Icon to show in collapsed state.
   */
  collapsedIcon: ImageSourcePropType;
  /**
   * @expandedIcon Icon to show in expanded state.
   */
  expandedIcon: ImageSourcePropType;
  /**
   * @containerStyle (optional) These styles are applied to the outer container that contains the Flat list.
   */
  containerStyle?: ViewStyle;
}

interface HierarchyDataObject {
  id: string | number;
}

export default function HierarchicalView<T extends HierarchyDataObject>(
  props: PropsWithChildren<HierarchicalViewProps<T>>
) {
  const {
    data,
    renderRowComponent,
    onItemPress,
    collapsedIcon,
    expandedIcon,
    containerStyle,
  } = props;

  // ==================
  // = HELPER METHODS =
  // ==================

  const calculateLineContainerWidth = (level: number) => {
    return level * 46;
  };

  const calculateHierarchyLineLeftMargin = (level: number) => {
    return (level - 1) * 46 + 16;
  };

  // =====================
  // = RENDERING HELPERS =
  // =====================

  const renderHierarchyLine = (item: HierarchyData<T>) => {
    if (item.level > 0) {
      return (
        <View
          style={{
            width: calculateLineContainerWidth(item.level),
            ...styles.horizontalLineContainer,
          }}
        >
          <View
            style={{
              marginLeft: calculateHierarchyLineLeftMargin(item.level),
              ...styles.horizontalLine,
            }}
          />
        </View>
      );
    } else {
      return <></>;
    }
  };

  const renderArrowSection = (item: HierarchyData<T>) => {
    let arrowICon: ImageSourcePropType = collapsedIcon;
    let imageStyle: StyleProp<ImageStyle> = styles.arrowIconCollapsed;
    if (item.state === 'expanded') {
      arrowICon = expandedIcon;
      imageStyle = styles.arrowIconExpanded;
    }
    return (
      <View style={styles.arrow} key={item.level}>
        {item.hasChild ? (
          <Image source={arrowICon} style={imageStyle} />
        ) : (
          <View style={imageStyle} />
        )}
      </View>
    );
  };

  const renderRowItem = (item: HierarchyData<T>) => {
    const handleOnRowPress = () => {
      onItemPress(item);
    };

    return (
      <GestureHandlerRootView key={item.data.id}>
        <TouchableOpacity onPress={handleOnRowPress}>
          <View
            style={{
              ...containerStyle,
              ...styles.container,
            }}
          >
            {renderHierarchyLine(item)}
            {renderArrowSection(item)}
            {renderRowComponent(item.data)}
          </View>
        </TouchableOpacity>
      </GestureHandlerRootView>
    );
  };

  // ==========
  // = RETURN =
  // ==========

  return (
    <View>
      {data.map(item => {
        return renderRowItem(item);
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  arrow: {
    paddingTop: 32,
    paddingLeft: 8,
    backgroundColor: 'white',
  },
  arrowIconCollapsed: {
    width: 7,
    height: 9,
  },
  arrowIconExpanded: {
    width: 9,
    height: 7,
  },
  horizontalLineContainer: {
    backgroundColor: 'white',
  },
  horizontalLine: {
    borderColor: '#A2A6AC',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    height: 35,
  },
});
