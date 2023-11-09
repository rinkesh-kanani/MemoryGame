import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, FlatList } from 'react-native';

const images = [
  require('./assets/card1.png'),
  require('./assets/card2.png'),
  require('./assets/card3.png'),
  require('./assets/card4.png'),
  require('./assets/card5.png'),
  require('./assets/card6.png'),
  require('./assets/card7.png'),
  require('./assets/card8.png'),
];

const App = () => {
  const [cards, setCards] = useState([...images, ...images].sort(() => Math.random() - 0.5));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [flips, setFlips] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let interval;
    if (!gameOver) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [gameOver]);

  const handleCardPress = (index) => {
    if (flippedIndices.length < 2 && !flippedIndices.includes(index) && !matchedPairs.includes(index)) {
      setFlippedIndices([...flippedIndices, index]);
      setFlips(flips + 1);

      if (flippedIndices.length === 1) {
        const [firstIndex] = flippedIndices;
        if (cards[firstIndex] === cards[index]) {
          setTimeout(() => {
            setMatchedPairs([...matchedPairs, firstIndex, index]);
            setFlippedIndices([]);
          }, 1000);
        } else {
          setTimeout(() => {
            setFlippedIndices([]);
          }, 1000);
        }
      }
    }
  };

  useEffect(() => {
    if (matchedPairs.length === images.length * 2) {
      setGameOver(true);
    }
  }, [matchedPairs]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor:
            flippedIndices.includes(index) || matchedPairs.includes(index) ? '#fff' : '#3498db',
        },
      ]}
      onPress={() => handleCardPress(index)}
      disabled={flippedIndices.includes(index) || matchedPairs.includes(index) || gameOver}
    >
      {flippedIndices.includes(index) || matchedPairs.includes(index) ? (
        <Image source={item} style={styles.cardImage} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Flips: {flips}</Text>
        <Text style={styles.headerText}>Timer: {timer}s</Text>
      </View>
      <FlatList
        data={cards}
        renderItem={renderItem}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.cardContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginStart: 50,
    marginEnd: 50,
    marginTop: 100,
    marginBottom: 100,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  headerText: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 60,
    height: 60,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2980b9',
  },
  cardImage: {
    width: 40,
    height: 55,
  },
});

export default App;