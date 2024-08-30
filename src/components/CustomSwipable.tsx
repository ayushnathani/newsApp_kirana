import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},
  rightAction: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
  },
});

export const CustomSwipable = ({
  RightSwipeOptions,
  content,
  close,
  disabled,
}: {
  RightSwipeOptions: ReactElement;
  content: ReactElement;
  close?: boolean;
  disabled?: boolean;
}) => {
  const swipeableStyles = StyleSheet.create({
    containerStyle: {zIndex: 100},
  });

  const startingPosition = 0;
  const pressed = useSharedValue(false);
  const x = useSharedValue(startingPosition);

  const eventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {startX: number}
  >({
    onStart: (event, ctx) => {
      pressed.value = true;
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
    },
    onEnd: event => {
      pressed.value = false;
      if (event.velocityX < 0) {
        x.value = withTiming(-75, {
          duration: 300,
        });
      } else {
        x.value = withTiming(startingPosition, {duration: 300});
      }
    },
  });

  const swipeAnimatedStyle = useAnimatedStyle(() => {
    if (x.value > 0) {
      x.value = 0;
    }
    if (x.value < -75) {
      x.value = -75;
    }

    if (close) {
      x.value = withTiming(0, {duration: 200});
    }

    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler
        activeOffsetX={[-10, 10]}
        onGestureEvent={!disabled ? eventHandler : undefined}>
        <Animated.View
          style={[swipeableStyles.containerStyle, swipeAnimatedStyle]}>
          {content}
        </Animated.View>
      </PanGestureHandler>

      <View style={styles.rightAction}>{RightSwipeOptions}</View>
    </View>
  );
};
