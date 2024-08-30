import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {NewsArticle} from '../helpers/types';
import {CustomSwipable} from './CustomSwipable';

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    lineHeight: 24.7,
    fontWeight: '700',
    color: '#808080',
    flex: 1,
  },
  source: {
    fontSize: 14,
    lineHeight: 18.9,
    fontWeight: '400',
  },
  time: {
    fontSize: 14,
    lineHeight: 18.9,
    fontWeight: '400',
    color: '#808080',
  },
  pinnedText: {
    paddingVertical: 14.5,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  sourceContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {flexDirection: 'row', flex: 1, marginTop: 16},
  image: {
    width: 77,
    height: 77,
    marginLeft: 19,
    borderRadius: 16,
  },
  author: {
    color: '#818181',
    fontSize: 12,
    lineHeight: 16.2,
    fontWeight: '500',
  },
  options: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    padding: 16,
    backgroundColor: '#4BBDFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {justifyContent: 'center', alignItems: 'center'},
  icon: {width: 15, height: 20},
  pinIcon: {width: 20, height: 20, marginTop: 10},
  buttonText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.2,
    color: 'white',
  },
});

const NewsListItem = ({
  item,
  index,
  handleDelete,
  handlePin,
  isPinned,
}: {
  item: NewsArticle;
  index: number;
  handleDelete: (index: number) => void;
  handlePin: (index: number) => void;
  isPinned?: boolean;
}) => {
  const content = (
    <View style={styles.pinnedText}>
      {isPinned && <Text style={styles.pinnedText}>📌 Pinned on top</Text>}

      <View style={styles.sourceContainer}>
        <Text style={styles.source}>{item?.source?.name ?? ''}</Text>
        <Text style={styles.time}>
          {new Date(item.publishedAt).toTimeString().slice(0, 5)}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>{item.title}</Text>
        {item.urlToImage ? (
          <Image
            source={{uri: item?.urlToImage}}
            alt={item.title}
            style={styles.image}
          />
        ) : null}
      </View>
      <Text style={styles.author}>
        {item.author ?? item?.source?.name ?? ''}
      </Text>
    </View>
  );

  const rightSwipeOptions = (
    <View style={styles.options}>
      <Pressable onPress={() => handleDelete(index)} style={styles.button}>
        <Image style={styles.icon} source={require('../images/bin.png')} />
        <Text style={styles.buttonText}>Delete</Text>
      </Pressable>

      <Pressable onPress={() => handlePin(index)} style={styles.button}>
        <Image style={styles.pinIcon} source={require('../images/pin.png')} />
        <Text style={styles.buttonText}>Pin</Text>
      </Pressable>
    </View>
  );

  return (
    <CustomSwipable
      disabled={isPinned}
      RightSwipeOptions={rightSwipeOptions}
      content={content}
      close={false}
    />
  );
};
export default NewsListItem;
