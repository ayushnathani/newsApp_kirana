import React, {ReactElement, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export const CustomSwipable = ({
  index,
  isValidating,
  RightSwipeOptions,
  content,
  seenNudge,
  setSeenNudge,
  close,
  first,
  singleItem,
  setFirst,
  count,
}: {
  index: number;
  isValidating: boolean;
  RightSwipeOptions: ReactElement;
  content: ReactElement;
  seenNudge: number;
  setSeenNudge: (i: number) => void;
  close?: boolean;
  first?: boolean;
  setFirst: (i: boolean) => void;
  singleItem?: boolean;
  count?: number;
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
        x.value = withTiming(singleItem ? -75 : count ? -count * 70 : -150, {
          duration: 300,
        });
      } else {
        x.value = withTiming(startingPosition, {duration: 300});
      }
    },
  });

  useEffect(() => {
    if (
      seenNudge < 3 &&
      x.value === 0 &&
      index === 0 &&
      !isValidating &&
      !singleItem &&
      first
    ) {
      setFirst(false);
      x.value = withSequence(
        withTiming(singleItem ? -60 : count ? -count * 70 : -150, {
          duration: 1000,
        }),
        withTiming(0, {duration: 1000}),
      );
      setTimeout(() => {
        setSeenNudge(seenNudge >= 3 ? 1 : seenNudge + 1);
      }, 1000);
    }
  }, [
    count,
    index,
    isValidating,
    seenNudge,
    setSeenNudge,
    singleItem,
    x,
    first,
    setFirst,
  ]);

  const swipeAnimatedStyle = useAnimatedStyle(() => {
    if (x.value > 0) {
      x.value = 0;
    }
    if (x.value < (count ? -count * 70 : -150) && !singleItem) {
      x.value = count ? -count * 70 : -150;
    }
    if (singleItem && x.value < -75) {
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
    <View style={{flex: 1}}>
      <PanGestureHandler
        activeOffsetX={[-10, 10]}
        onGestureEvent={eventHandler}>
        <Animated.View
          style={[swipeableStyles.containerStyle, swipeAnimatedStyle]}>
          {content}
        </Animated.View>
      </PanGestureHandler>

      <View
        style={{
          position: 'relative',
          height: '100%',
          right: 0,
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}>
        {RightSwipeOptions}
      </View>
    </View>
  );
};
