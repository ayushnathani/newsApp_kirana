/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import List from './src/components/List';

import axios from 'axios';
import {SyncStorage} from './src/services/storage';
import {Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const [page, setPage] = useState(1);
  const newsData = SyncStorage.get('newsData');
  const [error, setError] = useState(false);

  const [newsArticles, setNewsArticles] = useState(newsData ?? []);

  const getNewsArticles = useCallback(async () => {
    try {
      console.log('isCalled??');
      // const response = await axios.post(
      //   'https://asia-south1-kc-stage-rp.cloudfunctions.net/globalNews',
      //   '',
      //   {
      //     params: {
      //       endpoint: 'everything',
      //       q: 'india',
      //       page: page,
      //       apiKey: '5c659f698d0549b0895d0fcb6ba84e20',
      //     },
      //     headers: {
      //       Accept: 'application/json, text/plain, */*',
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //   },
      // );
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=india&page=${page}&apiKey=df3e14fc00cd4f26baf9b6c09c79d57e`,
      );
      if (response.data.articles) {
        setNewsArticles([]);
        SyncStorage.set('newsData', response.data.articles);
        setNewsArticles(response.data.articles);
      }
    } catch (e) {
      console.log(e);
    }
  }, [page]);

  useEffect(() => {
    if (!newsData || newsData.length === 0) {
      getNewsArticles();
    }
  }, [getNewsArticles, newsData]);

  if (error) {
    return <Text>Something went wrong...</Text>;
  }

  if (!newsArticles || newsArticles.length === 0) {
    return <Text>Loading...</Text>;
  }

  console.log('newsArticles', newsArticles.length);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <List page={page} setPage={setPage} newsData={newsArticles} />
    </GestureHandlerRootView>
  );
}

export default App;
