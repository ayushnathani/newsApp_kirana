import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
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
});

const NewsListItem = ({item}: {item: NewsArticle}) => {
  const content = (
    <View style={{paddingVertical: 14.5, paddingHorizontal: 16}}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <Text style={styles.source}>{item?.source?.name ?? ''}</Text>
        <Text style={styles.time}>
          {new Date(item.publishedAt).toTimeString().slice(0, 5)}
        </Text>
      </View>
      <View style={{flexDirection: 'row', flex: 1, marginTop: 16}}>
        <Text style={styles.heading}>{item.title}</Text>
        {item.urlToImage ? (
          <Image
            source={{uri: item?.urlToImage}}
            alt={item.title}
            style={{
              width: 77,
              height: 77,
              marginLeft: 19,
              borderRadius: 16,
            }}
          />
        ) : null}
      </View>
      <Text
        style={{
          color: '#818181',
          fontSize: 12,
          lineHeight: 16.2,
          fontWeight: '500',
        }}>
        {item.author ?? item?.source?.name ?? ''}
      </Text>
    </View>
  );
  return (
    <CustomSwipable
      index={0}
      isValidating={false}
      RightSwipeOptions={<Text>Hello</Text>}
      content={content}
      seenNudge={0}
      setSeenNudge={() => {}}
      setFirst={() => {}}
    />
  );
};
export default NewsListItem;
