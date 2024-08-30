import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  StatusBar,
  Pressable,
  StyleSheet,
} from 'react-native';
import {NewsArticle} from '../helpers/types';
import NewsListItem from './NewsListItem';
import {SyncStorage} from '../services/storage';
import Divider from './Divider';

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  headerImage: {width: 111, height: 31},
  refresh: {color: 'black', fontSize: 24, fontWeight: '700'},
});

const News = ({
  page,
  setPage,
  newsData,
}: {
  page: number;
  setPage: (value: number) => void;
  newsData: NewsArticle[];
}) => {
  const intervalRef = useRef<number>();
  const [pinnedNews, setPinnedNews] = useState<NewsArticle[]>([]);

  const [trimmedData, setTrimmedData] = useState<Array<NewsArticle>>(
    newsData?.slice(0, 10) ?? [],
  );

  const refreshHeadlines = useCallback(() => {
    const nextHeadlines = newsData.slice(
      trimmedData.length - 1,
      trimmedData.length - 1 + 5,
    );

    setTrimmedData(prevData => {
      const updatedData = [...nextHeadlines, ...prevData];
      return updatedData;
    });
  }, [newsData, trimmedData]);

  const handleListExhaustion = useCallback(() => {
    if (trimmedData.length >= newsData.length) {
      clearInterval(intervalRef.current);
      SyncStorage.delete('newsData');
      setPage(page + 1);
      setTrimmedData([]);
    }
  }, [newsData.length, page, setPage, trimmedData.length]);

  useEffect(() => {
    if (newsData && newsData.length > 0) {
      //@ts-ignore
      intervalRef.current = setInterval(() => {
        refreshHeadlines();
      }, 10000);

      handleListExhaustion();

      return () => clearInterval(intervalRef.current);
    }
  }, [
    handleListExhaustion,
    newsData,
    page,
    refreshHeadlines,
    setPage,
    trimmedData,
  ]);

  const handleDelete = (index: number) => {
    setTrimmedData(prevData => {
      const updatedData = prevData.filter((_, _index) => index !== _index);
      return updatedData;
    });
  };

  const handlePin = (index: number) => {
    const pinnedValue = trimmedData.find((_, _index) => index === _index);
    if (pinnedValue) {
      setPinnedNews([...pinnedNews, pinnedValue]);
    }
    handleDelete(index);
  };

  if (!trimmedData || trimmedData.length === 0) {
    return <Text>Loading more headlines...</Text>;
  }

  return (
    <View>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={styles.header}>
        <Image
          source={require('../images/headline.png')}
          style={styles.headerImage}
        />
        <Pressable onPress={refreshHeadlines}>
          <Text style={styles.refresh}>↻</Text>
        </Pressable>
      </View>
      <Divider />
      <FlatList
        ListHeaderComponent={
          <View>
            {pinnedNews &&
              pinnedNews.map((item, index) => {
                return (
                  <>
                    <NewsListItem
                      handleDelete={handleDelete}
                      handlePin={handlePin}
                      index={index}
                      item={item}
                      key={item.title}
                      isPinned={true}
                    />
                    <Divider />
                  </>
                );
              })}
          </View>
        }
        data={trimmedData}
        initialNumToRender={10}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item, index}) => {
          return (
            <NewsListItem
              handleDelete={handleDelete}
              handlePin={handlePin}
              index={index}
              item={item}
              key={item.title}
            />
          );
        }}
      />
    </View>
  );
};

export default News;
