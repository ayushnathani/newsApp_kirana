import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {NewsArticle} from '../helpers/types';
import NewsListItem from './NewsListItem';
import {SyncStorage} from '../services/storage';

const List = ({
  page,
  setPage,
  newsData,
}: {
  page: number;
  setPage: (value: number) => void;
  newsData: NewsArticle[];
}) => {
  console.log('already rendered');
  const flatListRef = useRef<FlatList>(null);
  const intervalRef = useRef<number>();

  console.log('NewsData', newsData?.length);

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
    if (trimmedData) {
      flatListRef.current?.scrollToIndex({index: 0, animated: true});
    }
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

  console.log(trimmedData.length);

  if (!trimmedData || trimmedData.length === 0) {
    return <Text>Loading more headlines...</Text>;
  }

  return (
    <FlatList
      ref={flatListRef}
      data={trimmedData}
      initialNumToRender={10}
      ItemSeparatorComponent={() => (
        <View style={{width: '100%', height: 2, backgroundColor: '#EAEAEA'}} />
      )}
      renderItem={({item}) => {
        return <NewsListItem item={item} key={item.title} />;
      }}
    />
  );
};

export default React.memo(List);
